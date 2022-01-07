import React, { useState, useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router";
import { cloneDeep } from "lodash";
import { Button, Form, Input, FileUploader } from "../../../../components";
import { Context } from "..";
import { rules, toast, getFileName } from "../../../../methods";
import { axios } from "../../../../boot";
export default function Video() {
  const formControls = [
    {
      tag: Input,
      label: "موضوع ویدیو",
      state: "title",
      rules: rules.required,
    },
    {
      tag: Input,
      label: "توضیح ویدیو",
      state: "description",
      rules: rules.required,
    },
    {
      tag: FileUploader,
      label: "ویدیو",
      state: "video",
      rules: rules.required,
      multiple: false,
      accept: ".mp4, .webm",
    },
    {
      tag: FileUploader,
      label: "فایل‌های ضمیمه",
      state: "attachments",
      rules: rules.attachments,
      accept: ".png, .jpg, .jpeg, .mp4, .pdf, .zip, .rar",
    },
  ];
  const { id, sectionIndex, activityIndex } = useParams();
  const { sections, getTerm, submitChange } = useContext(Context);
  const [data, setData] = useState({});

  const setDefaultData = () => {
    const activity = cloneDeep(sections[sectionIndex][activityIndex]);
    const video = [activity.files.video]
      .filter((e) => e !== undefined)
      .map((path) => ({
        url: path,
        name: getFileName(path),
        getServer: true,
      }));
    const attachments = ((activity.files ?? { paths: [] }).paths ?? []).map(
      (path) => ({
        url: path,
        name: getFileName(path),
        getServer: true,
      })
    );
    setData({ ...activity, video, attachments });
  };

  const submit = () => {
    submitChange(data, submitVideo);
  };
  const submitVideo = () => {
    const url = "/admins/files/video";
    const body = {
      termId: id,
      sectionIndex,
      activityIndex,
    };
    const form = new FormData();
    Object.keys(body).forEach((item) => {
      form.append(item, body[item]);
    });
    if (!(data.video[0].getServer ?? false)) {
      form.append("video", data.video[0]);
    }
    data.attachments.forEach((file) => {
      !(file.getServer ?? false) && form.append("file", file);
    });
    axios.post(url, form).then(() => {
      const text = "فعالیت با موفقیت تغییر کرد.";
      toast({ text });
      getTerm();
    });
  };

  useEffect(setDefaultData, [sections]);
  console.log(data);
  return (
    <div className="Video">
      <h5 className="text-center">{"<< ویدیو آموزشی >>"}</h5>
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
          <Col xs="12" className="d-flex flex-center gap-1">
            <Button variant="success" type="submit">
              ثبت تغییرات
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
