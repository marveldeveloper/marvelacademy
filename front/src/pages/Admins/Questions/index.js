import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../../components";
import { activityStatus } from "../../../constants";
import { axios } from "../../../boot";
export default function Questions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const getQuestions = () => {
    const url = "/admins/answers";
    const params = {
      sort: "createdAt:-1",
    };
    axios.get(url, { params }).then(({ data }) => {
      setQuestions(data.data);
    });
  };
  useEffect(getQuestions, []);
  return (
    <div className="Homeworks">
      <Table>
        <thead>
          <tr>
            <td>ردیف</td>
            <td>نام و نام خانوادگی</td>
            {/* <td>پاسخ آزمون</td> */}
            <td>وضعیت قبولی</td>
          </tr>
        </thead>
        <tbody>
          {questions.map((item, index) => (
            <tr key={index} onClick={() => navigate(item._id)}>
              <td>{index + 1}</td>
              <td>{`${item.firstName} ${item.lastName}`}</td>
              <td>{activityStatus.badge(item.status)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
