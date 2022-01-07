import { useEffect, useState } from "react";
import { Accordion } from "../../../components";
import { activityStatus } from "../../../constants";
import { axios } from "../../../boot";
export default function Homeworks() {
  const [homeworks, setHomeworks] = useState([]);
  const getHomeworks = () => {
    const url = "/homeworks";
    const params = {
      sort: "createdAt:-1",
    };
    axios.get(url, { params }).then(({ data }) => {
      setHomeworks(data);
    });
  };
  useEffect(getHomeworks, []);
  return (
    <div className="Homeworks Table">
      {homeworks.map((item, index) => (
        <Accordion key={index} title={`تمرین‌های ترم ${item.termIndex + 1}`}>
          <div className="d-flex flex-column">
            {item.data.map(({ homework }, index) => (
              <div
                key={index}
                className="w-100 row align-items-center border-top border-secondary px-2 py-3"
              >
                <div className="d-flex flex-column row-gap-1 text-secondary col-7">
                  <p className="mb-0">
                    <span className="text-dark">جلسه:</span>{" "}
                    {homework.sectionIndex + 1}
                  </p>
                  <p className="mb-0">
                    <span className="text-dark">فعالیت:</span>{" "}
                    {homework.activityIndex + 1}
                  </p>
                  <p className="mb-0">
                    <span className="text-dark">موضوع تمرین:</span>{" "}
                    {homework.title}
                  </p>
                </div>
                <div className="col-5">
                  <p className="mb-0">
                    <span className="text-dark">وضعیت:</span>{" "}
                    {activityStatus.badge(homework.status)}
                  </p>
                </div>
                <div
                  style={{ borderTop: "1px dashed" }}
                  className="col-12 overflow-wrap-break-word border-gray pt-3"
                >
                  <span className="text-dark">توضیحات:</span> {homework.comment}
                </div>
              </div>
            ))}
          </div>
        </Accordion>
      ))}
    </div>
  );
}
