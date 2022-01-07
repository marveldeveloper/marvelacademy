import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";
import { axios } from "../../../boot";
import { Form, Input, Dropdown, Button } from "../../../components";
import { roles } from "../../../constants";
import { rules, toast } from "../../../methods";
export default function User() {
  const formControls = [
    {
      tag: Input,
      label: "نام",
      state: "firstName",
    },
    {
      tag: Input,
      label: "نام خانوادگی",
      state: "lastName",
    },
    {
      tag: Input,
      label: "نام کاربری",
      state: "username",
    },
    {
      tag: Input,
      label: "کلمه عبور",
      state: "password",
    },
    {
      tag: Input,
      label: "ایمیل",
      state: "email",
    },
    {
      tag: Input,
      label: "شماره تلفن",
      state: "phone",
      rules: rules.phoneNumber,
    },
    {
      tag: Dropdown,
      label: "سطح دسترسی",
      state: "role",
      changeLabel: true,
      items: roles,
    },
  ];
  const params = useParams();
  const [data, setData] = useState({});
  const getUserInfo = () => {
    const url = `/admins/users/${params.id}`;
    axios.get(url).then(({ data }) => {
      setData({ ...data, phone: `0${data.phone.substring(3)}` });
    });
  };
  const submitChange = () => {
    const url = "/admins/users";
    const body = cloneDeep(data);
    body.phone = `+98${body.phone.substring(1)}`;
    delete body.progress;
    axios.put(url, body).then(() => {
      const text = "تغییرات با موفقیت ثبت شد.";
      toast({ text });
    });
  };
  useEffect(getUserInfo, []);
  return (
    <div className="User">
      <Form onSubmit={submitChange}>
        <Row>
          {formControls.map((item, index) => (
            <Col key={index} xs="12" md="6" lg="4">
              {React.createElement(item.tag, {
                rules: rules.required,
                value: data[item.state],
                setValue: (val) =>
                  setData((p) => ({ ...p, [item.state]: val })),
                ...item,
              })}
            </Col>
          ))}
          <Col xs="12">
            <div className="buttons">
              <Button type="submit" variant="success">
                ثبت تغییرات
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
