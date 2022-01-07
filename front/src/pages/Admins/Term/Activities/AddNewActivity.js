import React, { useContext, useState } from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router";
import { Modal, Form, Dropdown, Input, Button } from "../../../../components";
import { rules, toast } from "../../../../methods";
import { activityTypes } from "../../../../constants";
import { Context } from "..";

export default function AddNewActivity({ show = true, onHide = () => {} }) {
  const formControls = [
    {
      tag: Dropdown,
      label: "نوع فعالیت",
      state: "type",
      changeLabel: true,
      items: activityTypes,
    },
    {
      tag: Input,
      label: "موضوع",
      state: "title",
      rules: rules.required,
    },
    {
      tag: Input,
      label: "توضیحات",
      state: "description",
      rules: rules.required,
    },
  ];
  const params = useParams();
  const { sections, getTerm, submitChange } = useContext(Context);
  const [data, setData] = useState({
    type: "video",
  });
  const addActivity = () => {
    const { sectionIndex } = params;
    const activityIndex = `${sections[sectionIndex].length}`;
    submitChange({ ...data, activityIndex }, () => {
      const text = "فعالیت جدید با موفقیت اضافه شد.";
      toast({ text });
      onHide(false);
      getTerm()
    });
  };
  return (
    <Modal show={show} onHide={onHide} title="افزودن فعالیت جدید">
      <Form onSubmit={addActivity} className="row">
        {formControls.map((item, index) => (
          <Col key={index} xs="12">
            {React.createElement(item.tag, {
              value: data[item.state],
              setValue: (val) => setData((p) => ({ ...p, [item.state]: val })),
              ...item,
            })}
          </Col>
        ))}
        <Col xs="12">
          <Button variant="success" type="submit" className="w-100">
            افزودن
          </Button>
        </Col>
      </Form>
    </Modal>
  );
}
