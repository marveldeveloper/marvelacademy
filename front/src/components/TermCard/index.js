import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "../../components";
import { showTime } from "../../methods";
import "./index.scss";
export default function TermCard({
  _id = "",
  index = 0,
  title = "",
  totalExams = 0,
  totalVideos = 0,
  description = "",
  teacherName = "",
  time = 0,
  unlocked = false,
}) {
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);
  const navigate = useNavigate();
  const goToTerm = () => {
    if (unlocked) {
      navigate(_id);
    } else {
      setShowModal(true);
    }
  };
  return (
    <React.Fragment>
      <div className="TermCard transition w-100 d-flex flex-column">
        <div className="id position-relative d-flex flex-center h2 bg-light-gray text-info rounded-circle border border-primary mx-auto">
          {unlocked ? (
            <span className="pt-1 font-en">{index + 1}</span>
          ) : (
            <i className="text-secondary bi bi-lock" />
          )}
        </div>
        <div className="content d-flex flex-column w-100 text-center bg-light-gray text-secondary rounded shadow-sm fs-7 p-4 pt-5">
          <h6 className="text-primary">{title}</h6>
          <hr className="bg-secondary my-3" />
          <p className="mb-1">
            <i className="bi bi-clock-fill text-primary ms-1 fs-6" />
            {`مدت زمان ترم: ${showTime(time)} ساعت`}
          </p>
          <p className="mb-1">
            <i className="bi bi-person-fill text-primary ms-1 fs-6" />
            {`نام مدرس: ${teacherName}`}
          </p>
          <p className="mb-1">تعداد ویدیو: {totalVideos}</p>
          <p className="mb-4">تعداد آزمون: {totalExams}</p>
          <p className="description overflow-wrap-break-word mx-auto">
            {description}
          </p>
          <Button variant="info" className="w-100 mt-auto" onClick={goToTerm}>
            مشاهده ترم
            <i className="bi bi-chevron-left me-1" />
          </Button>
        </div>
      </div>
      <Modal
        type="warning"
        title="ترم قفل است."
        show={showModal}
        onHide={setShowModal}
      >
        <div
          style={{ minHeight: "150px" }}
          className="d-flex flex-column justify-content-between"
        >
          <p className="text-primary">
            برای دسترسی به محتوای این ترم، باید ترم‌های قبل را بگذرانید.
          </p>
          <Button
            variant="success"
            label="متوجه شدم"
            className="px-3 w-fit me-auto"
            onClick={hideModal}
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}
