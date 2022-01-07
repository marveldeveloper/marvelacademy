import React from "react";
import { Row, Col } from "react-bootstrap";
import avatar from "../../assets/icons/cartoon-avatar.png";
import bgProfile from "../../assets/images/profile-bg.jpg";
import "./index.scss";
export default function ProfileCard({
  name = "",
  email = "",
  phoneNumber = "",
  progress = {},
}) {
  const info = [
    { label: "شماره تلفن", value: phoneNumber },
    { label: "ایمیل", value: email },
  ];
  const progressInfo = [
    {
      label: "ترم",
      value: progress.lastTerm + 1,
    },
    {
      label: "جلسه",
      value: progress.lastSection + 1,
    },
    {
      label: "فعالیت",
      value: progress.lastActivity + 1,
    },
  ];
  return (
    <div className="ProfileCard w-100 rounded shadow overflow-hidden bg-dark text-white">
      <div className="image-box position-relative w-100 d-flex flex-column px-3">
        <img className="bg-img" src={bgProfile} alt="bg-profile" />
        <img
          width="125"
          height="125"
          src={avatar}
          alt="avatar"
          className="profile position-relative rounded-circle border border-primary border-3 shadow bg-info me-auto mt-auto"
        />
      </div>
      <div className="content p-3">
        <p className="fs-5 fw-bold w-50">{name}</p>
        <Row className="mt-5">
          {info.map((item, index) => (
            <React.Fragment key={index}>
              <Col xs="12" className="text-start">
                {item.label}:
              </Col>
              <Col
                dir="ltr"
                xs="12"
                className="text-start text-light-gray text-truncate"
              >
                {item.value}
              </Col>
            </React.Fragment>
          ))}
        </Row>
        <Row className="mt-5 text-center">
          <Col xs="12">{`<< میزان پیشرفت >>`}</Col>
          {progressInfo.map((item, index) => (
            <Col key={index}>
              {item.label}: {item.value}
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
