import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { showNumber, showTime } from "../../methods";
import { termStatus } from "../../constants";
import "./index.scss";
import React, { useEffect, useState } from "react";
import { ButtonGroup } from "react-bootstrap";
export default function Card({
  _id = "",
  index = 0,
  title = "",
  totalExams = 0,
  totalVideos = 0,
  description = "",
  teacherName = "",
  time = 0,
  status = "",
  unlocked = false,
  rule = "admin",
  onDelete = () => {},
  onEdit = () => {},
}) {
  const [termInfo, setTermInfo] = useState({});
  const navigate = useNavigate();
  const setTermInfoData = () => {
    if (rule === "admin") {
      setTermInfo({
        disabled: false,
        showStatus: true,
        label: "مدیریت",
        status: termStatus.findById(status).name,
      });
    } else if (rule === "student") {
      setTermInfo({
        disabled: !unlocked,
        showStatus: !unlocked,
        label: "مشاهده ترم",
        status: unlocked ? "فعال" : "غیر فعال",
      });
    }
  };
  const goToTerm = () => {
    navigate(_id);
  };
  useEffect(setTermInfoData, []);
  return (
    <div className="Card text-secondary position-relative shadow">
      {termInfo.showStatus && (
        <React.Fragment>
          {rule === "student" && (
            <div className="unlocked transition d-flex flex-center position-absolute w-100 h-100">
              <i className="bi bi-lock text-secondary" />
            </div>
          )}
          <div className="status position-absolute d-flex flex-center overflow-hidden">
            <span className="position-absolute fw-bold bg-indigo text-white shadow d-flex flex-center text-center">
              {termInfo.status}
            </span>
          </div>
        </React.Fragment>
      )}
      <div className="body d-flex flex-column w-100 bg-white rounded-3 overflow-hidden h-100">
        <div className="circle d-flex flex-center w-100">
          <h2 className="text-center text-white display-1 font-en">
            {showNumber(Number(index) + 1)}
          </h2>
        </div>
        <div className="content p-3 d-flex flex-column">
          <label className="title text-center fs-5">{title}</label>
          <div className="info mb-1 d-flex flex-center w-100 fs-7 text-center">
            <div className="d-flex flex-column flex-center h-100">
              <span className="fs-6">{showNumber(totalVideos)}</span>
              <span>ویدیو</span>
            </div>
            <span className="vertical-line bg-secondary" />
            <div className="d-flex flex-column flex-center h-100">
              <span className="fs-6">{showNumber(totalExams)}</span>
              <span>آزمون</span>
            </div>
          </div>
          <div className="d-flex justify-content-between fs-7">
            <span>مدرس:</span>
            <span>{teacherName}</span>
          </div>
          <div className="d-flex justify-content-between fs-7">
            <span>مدت زمان:</span>
            <span>{showTime(time)}</span>
          </div>
          <p className="description overflow-wrap-break-word my-2 text-center">
            {description}
          </p>
          {rule === "admin" ? (
            <ButtonGroup dir="ltr" className="mt-auto">
              <Button variant="danger" onClick={onDelete}>
                حذف
              </Button>
              <Button disabled={termInfo.disabled} onClick={goToTerm}>
                {termInfo.label}
              </Button>
              <Button variant="warning" onClick={onEdit}>
                ویرایش
              </Button>
            </ButtonGroup>
          ) : (
            <Button
              disabled={termInfo.disabled}
              variant="gradient-1"
              className="mt-auto"
              onClick={goToTerm}
            >
              {termInfo.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
