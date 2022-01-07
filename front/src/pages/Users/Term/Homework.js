import React, { useContext, useState } from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router";
import { Button, FileUploader } from "../../../components";
import { downloadFile, toast } from "../../../methods";
import { axios } from "../../../boot";
import { Context } from ".";
export default function Homework() {
  const params = useParams();
  const { activity } = useContext(Context);
  const [files, setFiles] = useState([]);
  const submit = () => {
    const url = "/homeworks";
    const body = new FormData();
    body.append("file", files[0]);
    body.append("termId", params.id);
    body.append("activityIndex", activity.activityIndex);
    body.append("sectionIndex", activity.sectionIndex);
    axios.post(url, body).then(() => {
      const text1 = "فایل با موفقیت ارسال شد.";
      const text2 = "نتیجه پس از بررسی برای شما ارسال میشود.";
      const text = `${text1}\n${text2}`;
      toast({ text, duration: 5000 });
    });
  };
  return (
    <div className="Homework row w-100 justify-content-start">
      <Col
        xs="12"
        lg="8"
        xl="6"
        className="d-flex flex-column flex-center row-gap-4"
      >
        <div className="FileUploader bg-white rounded p-4 rounded shadow-sm w-100 border border-info">
          <header className="text-center h5 text-info">
            دانلود فایل تمرین
          </header>
          <div
            className="form d-flex flex-center flex-column row-gap-3 rounded border-info text-info cursor-pointer my-3"
            onClick={() => downloadFile(activity.files.paths[0])}
          >
            <i className="bi bi-download display-4" />
            <p className="m-0 text-center">دانلود</p>
          </div>
        </div>
        <FileUploader
          accept=".png, .jpeg, .jpg, .rar, .zip, .pdf"
          value={files}
          multiple={false}
          setValue={(files) => {
            setFiles(files);
          }}
        />
        <Button
          disabled={files.length === 0}
          onClick={submit}
          variant="success"
          className="w-100"
        >
          ارسال فایل
        </Button>
      </Col>
    </div>
  );
}
