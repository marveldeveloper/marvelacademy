import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button, Dropdown, BackBtn, Input } from "../../../components";
import { activityStatus } from "../../../constants";
import { downloadFile, toast } from "../../../methods";
import { axios } from "../../../boot";
import homeworkInfo from "./_homeworkInfo";
export default function Homework() {
  const params = useParams();
  const [homework, setHomework] = useState({});
  const getHomework = () => {
    const url = `/admins/homeworks/${params.id}`;
    axios.get(url).then(({ data }) => {
      setHomework(data);
    });
  };
  const submitNewStatus = () => {
    const url = `/admins/homeworks/review/${params.id}`;
    const body = {
      status: homework.status,
      comment: homework.comment ?? "",
    };
    axios.post(url, body).then(() => {
      const text = "وضعیت جدید با موفقیت ثبت شد.";
      toast({ text });
    });
  };
  useEffect(getHomework, []);
  return (
    <div className="Homework d-flex flex-column flex-center row-gap-4">
      <Row className="w-100">
        {homeworkInfo(homework).map((item, index) => (
          <Col key={index} xs="12" md="6" lg="4">
            <p className="mb-0 d-flex align-items-center col-gap-2">
              {item.label}:<span className="text-secondary">{item.value}</span>
            </p>
          </Col>
        ))}
        {/* </Row>
      <Row className="w-100"> */}
        <Col xs="12" md="6" lg="4">
          <Button outline onClick={() => downloadFile(homework.path)}>
            <i className="bi bi-download ms-1" />
            دانلود فایل تمرین
          </Button>
        </Col>
        <Col xs="12" md="6" lg="4">
          <Dropdown
            label="وضعیت جدید"
            value={homework.status}
            setValue={(status) => setHomework((p) => ({ ...p, status }))}
            items={activityStatus}
            changeLabel
          />
        </Col>
        <Col xs="12" md="6" lg="4">
          <Input
            as="textarea"
            label="توضیحات(اختیاری)"
            value={homework.comment}
            setValue={(val) => setHomework((p) => ({ ...p, comment: val }))}
          />
        </Col>
        <Col xs="12" className="d-flex flex-center">
          <Button variant="success" onClick={submitNewStatus}>
            ثبت تغییرات
          </Button>
        </Col>
      </Row>
      <div className="mt-5 w-100 d-flex justify-content-end">
        <BackBtn />
      </div>
    </div>
  );
}
