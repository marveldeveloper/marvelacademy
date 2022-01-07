import React from "react";
import { Col } from "react-bootstrap";

export default function Answers({ answers = [] }) {
  const statusClassName = (answer = "") => {
    if (answer.length === 0) {
      return (
        <span className="text-danger fw-bold">
          <i className="bi bi-x-lg ms-2" />
          پاسخی ثبت نشده است
        </span>
      );
    } else {
      return (
        <span className="text-success fw-bold">
          <i className="bi bi-check-lg ms-2" />
          پاسخ ذخیره شده است
        </span>
      );
    }
  };
  return (
    <div className="Answers row" style={{ minHeight: "60vh" }}>
      <Col xs="12" md="8" lg="6">
        <div className="row bg-white border border-light-gray rounded shadow-sm py-3">
          {answers.map((item, index) => (
            <React.Fragment key={index}>
              <Col xs="6" className="text-start">{`سوال ${index + 1}:`}</Col>
              <Col xs="6" className="text-end">
                {statusClassName(item)}
              </Col>
            </React.Fragment>
          ))}
        </div>
      </Col>
    </div>
  );
}
