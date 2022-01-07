import { useEffect, useState } from "react";
import { Accordion } from "../../../components";
import { activityStatus } from "../../../constants";
import { axios } from "../../../boot";
export default function Exams() {
  const [Exams, setExams] = useState([]);
  const getExams = () => {
    const url = "/exams";
    const params = {
      sort: "createdAt:-1",
    };
    axios.get(url, { params }).then(({ data }) => {
      setExams(data);
    });
  };
  useEffect(getExams, []);
  return (
    <div className="Exams Table">
      {Exams.map((item, index) => (
        <Accordion key={index} title={`آزمون‌های ترم ${item.termIndex + 1}`}>
          <div className="d-flex flex-column">
            {item.data.map(({ exam }, index) => (
              <div
                key={index}
                className="w-100 row align-items-center border-top border-secondary px-2 py-3"
              >
                <div className="d-flex flex-column row-gap-1 text-secondary col-7">
                  <p className="mb-0">
                    <span className="text-dark">جلسه:</span>{" "}
                    {exam.sectionIndex + 1}
                  </p>
                  <p className="mb-0">
                    <span className="text-dark">فعالیت:</span>{" "}
                    {exam.activityIndex + 1}
                  </p>
                  <p className="mb-0">
                    <span className="text-dark">موضوع آزمون:</span> {exam.title}
                  </p>
                </div>
                <div className="col-5">
                  <p className="mb-0">
                    <span className="text-dark">وضعیت:</span>{" "}
                    {activityStatus.badge(exam.status)}
                  </p>
                </div>
                <div
                  style={{ borderTop: "1px dashed" }}
                  className="col-12 overflow-wrap-break-word border-gray pt-3"
                >
                  <span className="text-dark">توضیحات:</span> {exam.comment}
                </div>
              </div>
            ))}
          </div>
        </Accordion>
      ))}
    </div>
  );
}
