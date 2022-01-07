import { useState } from "react";
import { Col } from "react-bootstrap";
import { Button, Form, Input, Modal } from "../../../components";
import { rules, objectMultiSelect, toast } from "../../../methods";
import { axios } from "../../../boot";

export default function AddNewTerm({
  show = true,
  onHide = () => {},
  afterAddTerm = () => {},
}) {
  const formControls = [
    {
      label: "موضوع ترم",
      state: "title",
      rules: rules.required,
    },
    {
      label: "نام مدرس",
      state: "teacherName",
      rules: rules.required,
    },
    {
      label: "شماره ترم",
      state: "index",
      rules: rules.required,
      type: "number",
    },
    {
      label: "مدت زمان ترم(دقیقه)",
      state: "time",
      rules: rules.required,
      type: "number",
    },
    {
      label: "توضیحات",
      state: "description",
      rules: rules.required,
    },
  ];
  const [data, setData] = useState({});
  const addTerm = () => {
    const url = "/admins/terms";
    const keys = ["title", "teacherName", "index", "description", "time"];
    const body = objectMultiSelect(keys, data);
    body.status = "enabled";
    body.index = `${body.index - 1}`;
    axios.post(url, body).then(() => {
      const text = "ترم جدید با موفقیت اضافه شد.";
      toast({ text });
      onHide(false);
      afterAddTerm();
    });
  };
  return (
    <Modal show={show} onHide={onHide} title="افزودن ترم جدید">
      <Form onSubmit={addTerm} className="row">
        {formControls.map((item, index) => (
          <Col key={index} xs="12">
            <Input
              value={data[item.state]}
              setValue={(val) => setData((p) => ({ ...p, [item.state]: val }))}
              {...item}
            />
          </Col>
        ))}
        <Button variant="success" type="submit">
          افزودن
        </Button>
      </Form>
    </Modal>
  );
}
