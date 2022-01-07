import React, { useState, useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router";
import { cloneDeep } from "lodash";
import { Button, Form, Input, FileUploader } from "../../../../components";
import { Context } from "..";
import { rules, toast, getFileName } from "../../../../methods";
import { axios } from "../../../../boot";
export default function Homework() {
  const formControls = [
    {
      tag: Input,
      label: "نام تمرین",
      state: "title",
      rules: rules.required,
    },
    {
      tag: Input,
      label: "توضیح تمرین",
      state: "description",
      rules: rules.required,
    },
    {
      tag: FileUploader,
      label: "افزودن فایل تمرین",
      state: "attachment",
      rules: rules.required,
      multiple: false,
      accept: ".pdf, .zip, .rar",
    },
  ];
  const { id, sectionIndex, activityIndex } = useParams();
  const { sections, submitChange, getTerm } = useContext(Context);

  const [data, setData] = useState({});

  const setDefaultData = () => {
    const activity = cloneDeep(sections[sectionIndex][activityIndex]);
    const attachment = ((activity.files ?? { paths: [] }).paths ?? []).map(
      (path) => ({
        url: path,
        name: getFileName(path),
      })
    );
    setData({ ...activity, attachment });
  };

  const submit = () => {
    submitChange(data, submitFile);
  };
  const submitFile = () => {
    const url = "/admins/files";
    const body = {
      termId: id,
      sectionIndex,
      activityIndex,
      file: data.attachment[0],
    };
    const form = new FormData();
    Object.keys(body).forEach((item) => {
      form.append(item, body[item]);
    });
    axios.post(url, form).then(() => {
      const text = "فعالیت با موفقیت تغییر کرد.";
      toast({ text });
      getTerm();
    });
  };

  useEffect(setDefaultData, [sections]);
  return (
    <div className="Homework">
      <h5 className="text-center">{"<< تمرین >>"}</h5>
      <Form onSubmit={submit}>
        <Row>
          {formControls.map((item, index) => (
            <Col key={index} xs="12" md="6" lg="4">
              {React.createElement(item.tag, {
                value: data[item.state],
                setValue: (val) =>
                  setData((p) => ({ ...p, [item.state]: val })),
                ...item,
              })}
            </Col>
          ))}
          <Col xs="12" className="d-flex flex-center">
            <Button variant="success" type="submit">
              ثبت تغییرات
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
