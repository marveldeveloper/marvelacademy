import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "../../../boot";
import { Table, Button } from "../../../components";
import { roles } from "../../../constants";
export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const getUsers = () => {
    const url = "/admins/users";
    axios.get(url).then(({ data }) => {
      setUsers(data.data);
    });
  };
  useEffect(getUsers, []);
  return (
    <div className="Users">
      <Table>
        <thead>
          <tr>
            <td>ردیف</td>
            <td>نام و نام خانوادگی</td>
            <td>شماره موبایل</td>
            <td>ایمیل</td>
            <td>سطح دسترسی</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {users.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{`${item.firstName} ${item.lastName}`}</td>
              <td>{`0${item.phone.substring(3)}`}</td>
              <td>{item.email}</td>
              <td>{roles.findById(item.role).name}</td>
              <td>
                <div className="buttons">
                  <Button onClick={() => navigate(item._id)}>جزئیات</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
