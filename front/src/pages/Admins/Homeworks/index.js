import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../../components";
import {
  // fileStatus,
  activityStatus,
} from "../../../constants";
import { axios } from "../../../boot";
export default function Homeworks() {
  const navigate = useNavigate();
  const [homeworks, setHomeworks] = useState([]);
  const getHomeworks = () => {
    const url = "/admins/homeworks";
    const params = {
      sort: "createdAt:-1",
    };
    axios.get(url, { params }).then(({ data }) => {
      setHomeworks(data.data);
    });
  };
  useEffect(getHomeworks, []);
  return (
    <div className="Homeworks">
      <Table>
        <thead>
          <tr>
            <th>ردیف</th>
            <th>نام و نام خانوادگی</th>
            {/* <th>وضعیت فایل</th> */}
            <th>وضعیت قبولی</th>
          </tr>
        </thead>
        <tbody>
          {homeworks.map((item, index) => (
            <tr key={index} onClick={() => navigate(item._id)}>
              <td>{index + 1}</td>
              <td>{`${item.firstName} ${item.lastName}`}</td>
              {/* <td>{showStatus(fileStatus, item.status)}</td> */}
              <td>{activityStatus.badge(item.status)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
