import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { cloneDeep } from "lodash";
import {
  Modal,
  Form,
  Button,
  Input,
  Dropdown,
  FileUploader,
} from "../../../components";
import { termStatus } from "../../../constants";
import { axios } from "../../../boot";
import { rules, toast } from "../../../methods";
export default function AddVideo({
  show = false,
  onHide = () => {},
  afterSubmit = () => {},
}) {
  const [data, setData] = useState({
    status: "enabled",
    category: null,
  });
  const [categories, setCategories] = useState([]);
  const formControls = [
    {
      tag: Input,
      label: "موضوع",
      state: "title",
    },
    {
      tag: Input,
      label: "توضیحات",
      state: "description",
    },
    {
      tag: FileUploader,
      label: "پیش نمایش(اختیاری)",
      state: "thumbnail",
      multiple: false,
      rules: [],
      accept: ".jpeg, .jpg, .png",
    },
    {
      tag: FileUploader,
      label: "ویدیو",
      state: "video",
      multiple: false,
      accept: ".mp4, .webm",
    },
    {
      tag: Dropdown,
      label: "دسته بندی",
      state: "category",
      items: categories,
      changeLabel: true,
    },
    {
      tag: Dropdown,
      label: "وضعیت",
      state: "status",
      items: termStatus,
      changeLabel: true,
    },
  ];
  const getCategories = () => {
    const url = "/admins/pub/categories";
    axios.get(url).then(({ data }) => {
      const categories = data.data.map((e) => ({
        name: e.title_fa,
        id: e.title,
      }));
      setCategories(categories);
      setData((p) => ({ ...p, category: categories[0].id }));
    });
  };
  const submit = () => {
    const url = "/admins/pub/videos";
    const body = cloneDeep(data);
    const form = new FormData();
    body.video = body.video[0];
    if (body.thumbnail && body.thumbnail.length) {
      body.thumbnail = body.thumbnail[0];
    } else {
      delete body.thumbnail;
    }
    Object.keys(body).forEach((item) => {
      form.append(item, body[item]);
    });
    axios.post(url, form).then(() => {
      const text = "ویدیو با موفقیت اضافه شد.";
      toast({ text });
      onHide(false);
      afterSubmit();
    });
  };
  useEffect(getCategories, []);
  return (
    <Modal
      title="اضافه کردن ویدیو"
      show={show}
      onHide={onHide}
      className="AddVideo"
    >
      <Form className="row" onSubmit={submit}>
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
        <Col xs="12" className="buttons">
          <Button variant="success" type="submit">
            ثبت تغییرات
          </Button>
        </Col>
      </Form>
    </Modal>
  );
}
