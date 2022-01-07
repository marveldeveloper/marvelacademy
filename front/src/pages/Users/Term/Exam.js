import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "../../../components";
import { showTime } from "../../../methods";
import { Context } from ".";
export default function Exam() {
  const navigate = useNavigate();
  const { activity } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const goToExam = () => {
    navigate(`/student/questions/${activity.exam._id}`);
  };
  return (
    <div className="Exam d-flex flex-column flex-center bg-white border border-light-gray shadow-sm px-3 py-2 rounded">
      <label className="w-100">آزمون {activity.title}</label>
      <p className="w-100 mb-0 mt-1 overflow-wrap-break-word">
        {activity.description}
      </p>
      <div className="mt-5 w-100 d-flex align-items-center justify-content-between">
        <span className="fs-7 text-gray">
          {`زمان مورد نیاز برای آزمون: ${showTime(activity.exam.timeout)}`}
        </span>
        <Button
          variant="info"
          onClick={() => setShowModal(true)}
          disabled={activity.asnwerd}
        >
          شرکت در آزمون
        </Button>
      </div>
      <Modal show={showModal} onHide={setShowModal} title="شرکت در آزمون">
        <p>آیا میخواهید در آزمون شرکت کنید؟</p>
        <div className="buttons">
          <Button variant="success" onClick={goToExam}>
            بله
          </Button>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            خیر
          </Button>
        </div>
      </Modal>
    </div>
  );
}
