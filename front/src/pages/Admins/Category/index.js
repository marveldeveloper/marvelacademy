import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router";
import { Button, Form, Input, Dropdown, BackBtn } from "../../../components";
import { termStatus } from "../../../constants";
import { axios } from "../../../boot";
import { objectMultiSelect, rules, toast } from "../../../methods";

export default function Category() {
  const params = useParams();
  const [data, setData] = useState({});
  const getCategory = () => {
    const url = `/admins/pub/categories/${params.id}`;
    axios.get(url).then(({ data }) => {
      setData(data);
    });
  };
  const submitChange = () => {
    const url = "/admins/pub/categories";
    const keys = ["title", "title_fa", "description", "status"];
    const body = objectMultiSelect(keys, data);
    body._id = params.id;
    axios.put(url, body).then(() => {
      const text = "دسته بندی با موفقیت تغییر کرد.";
      toast({ text });
    });
  };
  const formControls = [
    {
      tag: Input,
      label: "موضوع",
      state: "title_fa",
    },
    {
      tag: Input,
      label: "کلمه کلیدی",
      state: "title",
    },
    {
      tag: Input,
      label: "توضیحات",
      state: "description",
    },
    {
      tag: Dropdown,
      label: "وضعیت",
      state: "status",
      changeLabel: true,
      items: termStatus,
    },
  ];

  useEffect(getCategory, []);
  return (
    <div className="Categories">
      <Form className="row" onSubmit={submitChange}>
        {formControls.map((item, index) => (
          <Col key={index} xs="12">
            {React.createElement(item.tag, {
              value: data[item.state],
              setValue: (val) => setData((p) => ({ ...p, [item.state]: val })),
              rules: rules.required,
              ...item,
            })}
          </Col>
        ))}
        <Col xs="12" className="d-flex flex-center">
          <Button type="submit" variant="success" label="ثبت تغییرات" />
        </Col>
      </Form>
      <div className="my-3 d-flex justify-content-end">
        <BackBtn />
      </div>
    </div>
  );
}
