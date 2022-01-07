import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { Button, Form, Input, Modal } from "../../../components";
import { rules, objectMultiSelect, toast } from "../../../methods";
import { axios } from "../../../boot";

export default function UpdateTerm({
  show = true,
  baseData = {},
  onHide = () => {},
  afterEditTerm = () => {},
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
    const keys = [
      "_id",
      "title",
      "teacherName",
      "index",
      "description",
      "time",
    ];
    const body = objectMultiSelect(keys, data);
    body.status = "enabled";
    body.time = `${body.time}`;
    body.index = `${+body.index - 1}`;
    axios.put(url, body).then(() => {
      const text = "ترم با موفقیت ویرایش شد.";
      toast({ text });
      onHide();
      afterEditTerm(body);
    });
  };
  useEffect(
    () =>
      baseData !== null &&
      setData({
        ...baseData,
        index: Number(baseData.index) + 1,
      }),
    [show]
  );
  return (
    <Modal show={show} onHide={onHide} title="ویرایش ترم">
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
          ویرایش
        </Button>
      </Form>
    </Modal>
  );
}
