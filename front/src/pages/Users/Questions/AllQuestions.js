import { cloneDeep } from "lodash";
import { Col, Row } from "react-bootstrap";
import { Button, Radio } from "../../../components";
import { downloadFile, showNumber } from "../../../methods";
import { surveyValues } from "../../../constants";
export default function AllQuestions({
  questions = [],
  answers = [],
  setAnswers = () => {},
}) {
  const checkQuestionFile = (question = {}) => {
    const condition1 = "image" in question && question.image.length !== 0;
    const condition2 = "video" in question && question.video.length !== 0;
    return condition1 || condition2;
  };
  const handleChangeAnswer = (index = 0, value = "") => {
    const newAnswers = cloneDeep(answers);
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  const handleSetOption = (questionIndex = 0, option = "") => {
    const newAnswers = cloneDeep(answers);
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
  };
  return (
    <div className="AllQuestions d-flex flex-column row-gap-3">
      {questions.map((item, questionIndex) => (
        <div
          key={questionIndex}
          className="position-relative row gap-0 w-100 rounded shadow-sm border border-light-gray bg-primary bg-opacity-10 py-2"
        >
          <span className="col-1 d-flex flex-center text-info font-en fs-6 fw-bold">
            {showNumber(questionIndex + 1)}
          </span>
          <div className="col-11">
            <p className="overflow-wrap-break-word">{item.question}</p>
            {item.type === "full" && (
              <textarea
                style={{ minHeight: "90px" }}
                className="form-control w-100 rounded-3 p-2 bg-light border border-primary"
                value={answers[questionIndex]}
                onInput={({ target }) =>
                  handleChangeAnswer(questionIndex, target.value)
                }
              />
            )}
            {item.type === "options" && (
              <Row className="align-items-start">
                {item.options.map((option, optionIndex) => (
                  <Col key={optionIndex} xs="12" sm="6" md="4" lg="3">
                    <Radio
                      name={questionIndex}
                      option={option}
                      value={answers[questionIndex]}
                      setValue={(val) => handleSetOption(questionIndex, val)}
                      label={option}
                    />
                  </Col>
                ))}
              </Row>
            )}
            {item.type === "survey" && (
              <Row className="justify-content-start">
                {surveyValues.map((option, optionIndex) => (
                  <Col key={optionIndex} xs="12" sm="6" md="4" lg="3">
                    <Radio
                      name={questionIndex}
                      option={option.id}
                      value={answers[questionIndex]}
                      setValue={(val) => handleSetOption(questionIndex, val)}
                      label={option.name}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </div>
          <div className="d-flex flex-column flex-center">
            {checkQuestionFile(item) && (
              <Button
                variant="link"
                onClick={() => downloadFile(item.image || item.video)}
              >
                فایل ضمیمه
                <i className="me-2 bi bi-download" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
