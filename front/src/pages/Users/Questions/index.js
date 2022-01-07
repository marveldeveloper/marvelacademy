import React, { useEffect, useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { axios } from "../../../boot";
import { Button } from "../../../components";
import { showTime, toast } from "../../../methods";
import AllQuestions from "./AllQuestions";
import Answers from "./Answers";
export default function Questions() {
  const params = useParams();
  const navigate = useNavigate();
  const [interval, setMyInterval] = useState(null);
  const [step, setStep] = useState(0);
  const [examInfo, setExamInfo] = useState({
    timeleft: null,
    questions: [],
    title: "",
  });
  const [answers, setAnswers] = useState([]);
  const getExamInfo = () => {
    const url = `/exams/${params.id}`;
    axios
      .get(url)
      .then(({ data }) => {
        setExamInfo({ ...data, timeleft: data.timeleft * 60 });
        setAnswers(data.questions.map(() => ""));
        startTimer();
      })
      .catch((error) => {
        if (error.response) {
          const code = error.response.data.code;
          code === 133 && navigate(-1, { replace: true });
        }
      });
  };
  const submitExam = () => {
    const url = "/exams";
    const body = {
      _id: params.id,
      answers: answers.map((e) => ({ answer: e })),
    };
    axios.post(url, body).then(() => {
      const text = "پاسخ‌ها با موفقیت ثبت شدند.";
      toast({ text });
      navigate("/student/terms");
    });
  };
  const startTimer = () => {
    const timer = setInterval(
      () => setExamInfo((p) => ({ ...p, timeleft: p.timeleft - 1 })),
      1000
    );
    setMyInterval(timer);
  };
  useEffect(() => {
    getExamInfo();
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (examInfo.timeleft !== null && examInfo.timeleft <= 0) {
      clearInterval(interval);
      const text = "مهلت آزمون به اتمام رسید.";
      toast({ text, type: "error" });
      navigate(-1, { replace: true });
    }
  }, [examInfo.timeleft]);
  return (
    <div className="Questions">
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span>آزمون {examInfo.title}</span>
          <div
            className={`time rounded border border-dark-gray text-${
              examInfo.timeleft < 900 ? "danger" : "dark-gray"
            } px-3 py-1`}
          >
            {`زمان باقی‌مانده: ${showTime(Math.ceil(examInfo.timeleft / 60))}`}
          </div>
        </div>
        <Carousel indicators={false} activeIndex={step} controls={false}>
          <Carousel.Item>
            <AllQuestions
              questions={examInfo.questions}
              answers={answers}
              setAnswers={setAnswers}
            />
            <div className="buttons">
              <Button onClick={() => setStep(1)}>مرحله بعد</Button>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <Answers answers={answers} />
            <div className="buttons">
              <Button onClick={submitExam}>اتمام آزمون</Button>
              <Button onClick={() => setStep(0)} variant="dark">
                بازگشت به آزمون
              </Button>
            </div>
          </Carousel.Item>
        </Carousel>
      </Container>
    </div>
  );
}
