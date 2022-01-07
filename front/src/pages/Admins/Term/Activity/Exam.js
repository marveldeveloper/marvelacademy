import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Carousel } from "react-bootstrap";
import { useParams } from "react-router";
import { cloneDeep } from "lodash";
import { Button, Dropdown, Form, Input } from "../../../../components";
import { Context } from "..";
import { objectMultiSelect, rules, toast } from "../../../../methods";
import { axios } from "../../../../boot";
import { questionTypes } from "../../../../constants";
export default function Exam() {
  const formControls = [
    {
      tag: Input,
      label: "نام آزمون",
      state: "title",
      rules: rules.required,
    },
    {
      tag: Input,
      label: "زمان (دقیقه)",
      state: "time",
      rules: rules.required,
      type: "number",
    },
    {
      tag: Input,
      label: "توضیح آزمون",
      state: "description",
      rules: rules.required,
    },
  ];
  const { id, sectionIndex, activityIndex } = useParams();
  const { sections, submitChange, getTerm } = useContext(Context);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [questions, setQuestions] = useState([]);

  const setDefaultData = () => {
    const activity = cloneDeep(sections[sectionIndex][activityIndex]);
    activity.time = (activity.exam ?? { timeout: "0" }).timeout;
    const questions = (activity.exam ?? { questions: [] }).questions ?? [];
    setData({ ...activity });
    setQuestions(questions);
  };
  const goToStepTwo = () => {
    setStep(1);
  };
  const handleSetQuestions = (index = 0, value = "") => {
    const newQuestions = cloneDeep(questions);
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };
  const handleSetType = (index = 0, value = "") => {
    const newQuestions = cloneDeep(questions);
    newQuestions[index].type = value;
    if (value === "options") {
      newQuestions[index].options = ["", "", "", ""];
    }
    setQuestions(newQuestions);
  };
  const handleSetOption = (questionIndex = 0, optionIndex = 0, value = "") => {
    const newQuestions = cloneDeep(questions);
    const newQuestion = newQuestions[questionIndex];
    newQuestion.options[optionIndex] = value;
    setQuestions(newQuestions);
  };
  const handleSetFile = (questionIndex = 0, file = {}) => {
    const newQuestions = cloneDeep(questions);
    const newQuestion = newQuestions[questionIndex];
    const type = file.type.split("/")[0];
    delete newQuestion.video;
    delete newQuestion.image;
    newQuestion[type] = file;
    setQuestions(newQuestions);
  };
  const addNewQuestions = () => {
    setQuestions((p) => [...p, { question: "", type: "full" }]);
  };
  const deleteQuestion = (index = 0) => {
    const newQuestions = cloneDeep(questions);
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  const submit = () => {
    submitChange(data, submitQuestions);
  };
  const submitQuestions = () => {
    const _id = data.exam._id ?? null;
    const url = "/admins/exams";
    const body = {
      termId: id,
      sectionIndex,
      activityIndex,
      timeout: `${data.time}`,
      questions: questions.map((e) =>
        objectMultiSelect(["question", "type", "options"], e)
      ),
      ...(_id && { _id: _id }),
    };
    axios[_id ? "put" : "post"](url, body).then((response) => {
      const text = "فعالیت با موفقیت تغییر کرد.";
      toast({ text });
      const examId = response.data.insertedId ?? data.exam._id;
      setData((p) => {
        const newData = cloneDeep(p);
        newData.exam._id = examId;
        return newData;
      });
      submitFileQuestions(examId);
    });
  };
  const submitFileQuestions = (examId = "") => {
    const url = "/admins/exams/files";
    questions
      .filter((q) => q.video !== undefined || q.image !== undefined)
      .filter((q) => typeof q.video !== "string")
      .filter((q) => typeof q.image !== "string")
      .forEach((question, index) => {
        const body = new FormData();
        body.append("examId", examId);
        body.append("index", index);
        if ("video" in question) {
          body.append("video", question.video);
        } else if ("image" in question) {
          body.append("image", question.image);
        }
        axios.post(url, body).then(() => {
          if (index + 1 === questions.length) {
            getTerm();
          }
        });
      });
  };
  const deleteQuestionFile = (questionIndex = 0) => {
    const newQuestions = cloneDeep(questions);
    const newQuestion = newQuestions[questionIndex];
    const examId = data.exam._id;
    if (examId) {
      const url = "/admins/exams/files";
      const body = {
        examId: data.exam._id,
        index: `${questionIndex}`,
      };
      axios.delete(url, { data: body }).then(() => {
        const text = "فایل با موفقیت حذف شد.";
        toast({ text });
        delete newQuestion.image;
        delete newQuestion.video;
        setQuestions(newQuestions);
      });
    } else {
      const text = "فایل با موفقیت حذف شد.";
      toast({ text });
      delete newQuestion.image;
      delete newQuestion.video;
      setQuestions(newQuestions);
    }
  };
  useEffect(setDefaultData, []);
  return (
    <div className="Exam">
      <h5 className="text-center">{"<< آزمون >>"}</h5>
      <Form onSubmit={step === 0 ? goToStepTwo : submit}>
        <Carousel indicators={false} activeIndex={step} controls={false}>
          <Carousel.Item className="w-100 pb-4 py-1">
            <Row>
              {formControls.map((item, index) => (
                <Col key={index} xs="12" md="6" lg="4">
                  {React.createElement(item.tag, {
                    value: data[item.state],
                    setValue: (val) =>
                      setData((p) => ({ ...p, [item.state]: val })),
                    ...item,
                  })}
                </Col>
              ))}
            </Row>
          </Carousel.Item>
          <Carousel.Item className="w-100 pb-4 py-1">
            <Row>
              {questions.map((item, questionIndex) => (
                <Col
                  key={questionIndex}
                  xs="12"
                  className="d-flex flex-column bg-white py-1 rounded shadow-sm"
                >
                  <Input
                    as="textarea"
                    label={`سوال شماره ${questionIndex + 1}`}
                    value={item.question}
                    setValue={(val) => handleSetQuestions(questionIndex, val)}
                    rules={rules.required}
                    prepend={
                      <Dropdown
                        label="نوع"
                        changeLabel
                        items={questionTypes}
                        value={item.type}
                        setValue={(val) => handleSetType(questionIndex, val)}
                      />
                    }
                    append={
                      <Button
                        outline
                        variant="danger"
                        onClick={() => deleteQuestion(questionIndex)}
                      >
                        <i className="bi bi-x-lg" />
                      </Button>
                    }
                  />
                  {item.type === "options" && (
                    <Row className="w-100">
                      {item.options.map((option, optionIndex) => (
                        <Col key={optionIndex} xs="6" md="3">
                          <Input
                            label={`گزینه ${optionIndex + 1}`}
                            value={option}
                            rules={rules.required}
                            setValue={(val) =>
                              handleSetOption(questionIndex, optionIndex, val)
                            }
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                  <Row className="w-100">
                    <Col xs="12" md="6">
                      {item.image || item.video ? (
                        <Button
                          variant="danger"
                          onClick={() => deleteQuestionFile(questionIndex)}
                        >
                          حذف فایل ضمیمه
                        </Button>
                      ) : (
                        <input
                          accept=".png, .jpeg, .jpg, .mp4, .webm"
                          className="form-control"
                          placeholder="لینک ویدیو ضمیمه"
                          type="file"
                          multiple={false}
                          onInput={({ target }) => {
                            target.files.length &&
                              handleSetFile(questionIndex, target.files[0]);
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
              ))}
              <Col xs="12" className="d-flex flex-center mt-5">
                <Button variant="success" outline onClick={addNewQuestions}>
                  افزودن سوال جدید
                </Button>
              </Col>
            </Row>
          </Carousel.Item>
        </Carousel>
        <Col xs="12" className="d-flex flex-center col-gap-3">
          <Button
            disabled={step === 0}
            variant="info"
            onClick={() => setStep(0)}
          >
            رفتن به مرحله قبل
          </Button>
          <Button variant="success" type="submit">
            {step === 0 ? "مرحله بعد" : "ثبت تغییرات"}
          </Button>
        </Col>
      </Form>
    </div>
  );
}
