import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { BackBtn, Button, Dropdown, Input } from "../../../components";
import { axios } from "../../../boot";
import {
  activityStatus,
  questionTypes,
  surveyValues,
} from "../../../constants";
import { showNumber, objectMultiSelect, toast } from "../../../methods";
import questionInfo from "./_questionInfo";
export default function Questions() {
  const params = useParams();
  const [data, setData] = useState(null);
  const getAnswers = () => {
    const url = `/admins/answers/${params.id}`;
    axios.get(url).then(({ data }) => {
      const answers = data.answers[0].map((e) => e.answer);
      const questions = data.questions[0].map((item, index) => ({
        ...item,
        answer: answers[index] ?? "",
      }));
      const keys = ["firstName", "lastName", "status"];
      const userInfo = objectMultiSelect(keys, data);
      setData({ ...userInfo, questions });
    });
  };
  const showStatus = (value = "", type = "") => {
    const condition = value.length !== 0;
    const labelTypes = {
      survey: surveyValues.findById(value).name,
      options: value,
      full: value,
    };
    return {
      label: condition ? `پاسخ: ${labelTypes[type]}` : "پاسخی ثبت نشده است.",
      className: ["text", "border", "bg"]
        .map((e) => `${e}-${condition ? "success" : "danger"}`)
        .join(" "),
    };
  };
  const submitNewStatus = () => {
    const url = `/admins/answers/review/${params.id}`;
    const body = {
      status: data.status,
      comment: data.comment ?? "",
    };
    axios.post(url, body).then(() => {
      const text = "وضعیت جدید با موفقیت ثبت شد.";
      toast({ text });
    });
  };
  useEffect(getAnswers, []);
  return (
    data !== null && (
      <div className="Question">
        <Row>
          {questionInfo(data).map((item, index) => (
            <Col key={index} xs="12" md="6" lg="4">
              <p className="mb-0 d-flex align-items-center col-gap-2">
                {item.label}:
                <span className="text-secondary">{item.value}</span>
              </p>
            </Col>
          ))}
          <Col xs="12" md="6" lg="4">
            <Dropdown
              label="وضعیت جدید"
              value={data.status}
              setValue={(status) => setData((p) => ({ ...p, status }))}
              items={activityStatus}
              changeLabel
            />
          </Col>
          <Col xs="12" md="6" lg="4">
            <Input
              as="textarea"
              label="توضیحات(اختیاری)"
              value={data.comment}
              setValue={(val) => setData((p) => ({ ...p, comment: val }))}
            />
          </Col>
          <Col xs="12" className="d-flex flex-center">
            <Button variant="success" onClick={submitNewStatus}>
              ثبت تفییرات
            </Button>
          </Col>
        </Row>
        <div className="my-3 d-flex justify-content-end">
          <BackBtn />
        </div>
        <div className="d-flex flex-column row-gap-4 mt-4">
          {data.questions.map((item, index) => (
            <div
              key={index}
              className={`position-relative px-4 py-3 rounded shadow border d-flex flex-column row-gap-3 bg-opacity-10 ${
                showStatus(item.answer).className
              }`}
            >
              <span
                className="d-flex flex-center position-absolute text-info fw-bold fs-7 font-en"
                style={{
                  left: "5px",
                  top: "2.5px",
                }}
              >
                {showNumber(index + 1)}
              </span>
              <p className="mb-0 fs-7 text-info">{`نوع سوال: ${
                questionTypes.findById(item.type).name
              }`}</p>
              <p className="mb-0 text-dark overflow-wrap-break-word">
                {item.question}
              </p>
              <p className="mb-0 px-2 overflow-wrap-break-word">
                <i className="bi bi-activity" />{" "}
                {showStatus(item.answer, item.type).label}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
