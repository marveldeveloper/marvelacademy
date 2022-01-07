import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Dropdown,
  Button,
  Modal,
  BackBtn,
} from "../../../components";
import { termStatus } from "../../../constants";
import { axios } from "../../../boot";
import { objectMultiSelect, rules, toast } from "../../../methods";
export default function MainVideo() {
  const params = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
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
    // {
    //   tag: Input,
    //   label: "لینک پیش‌نمایش",
    //   state: "thumbnail",
    // },
    // {
    //   tag: Input,
    //   label: "لینک ویدیو",
    //   state: "path",
    // },
    {
      tag: Dropdown,
      label: "وضعیت",
      state: "status",
      items: termStatus,
      changeLabel: true,
    },
    {
      tag: Dropdown,
      label: "دسته بندی",
      state: "category",
      items: categories,
      changeLabel: true,
    },
  ];
  const getVideo = () => {
    const url = `/admins/pub/videos/${params.id}`;
    axios.get(url).then(({ data }) => {
      setData(data);
    });
  };
  const getCategories = () => {
    const url = "/admins/pub/categories";
    axios.get(url).then(({ data }) => {
      const categories = data.data.map((e) => ({
        name: e.title_fa,
        id: e.title,
      }));
      setCategories(categories);
    });
  };
  const deleteVideo = () => {
    const url = "/admins/pub/videos";
    const body = {
      _id: params.id,
    };
    axios.delete(url, { data: body }).then(() => {
      const text = "ویدیو با موفقیت حذف شد.";
      navigate("/admin/main-videos", { replace: true });
      toast({ text });
    });
  };
  const submit = () => {
    const url = "/admins/pub/videos";
    const keys = ["_id", "title", "description", "status", "category"];
    const body = objectMultiSelect(keys, data);
    console.log(body);
    axios.put(url, body).then(() => {
      const text = "داده جدید با موفقیت ذخیره شد.";
      toast({ text });
    });
  };
  useEffect(getVideo, []);
  useEffect(getCategories, []);
  return (
    <React.Fragment>
      <Form onSubmit={submit}>
        <Row>
          {formControls.map((item, index) => (
            <Col key={index} xs="12" md="6" lg="4">
              {React.createElement(item.tag, {
                value: data[item.state],
                setValue: (val) =>
                  setData((p) => ({ ...p, [item.state]: val })),
                rules: rules.required,
                ...item,
              })}
            </Col>
          ))}
          <Col xs="12">
            <div className="buttons">
              <Button variant="success" type="submit">
                ثبت تغییرات
              </Button>
              <Button variant="danger" onClick={() => setShowModal(true)}>
                حذف ویدیو
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
      <div className="my-3 d-flex justify-content-end">
        <BackBtn />
      </div>
      <Modal
        title="هشدار"
        type="warning"
        show={showModal}
        onHide={setShowModal}
      >
        <p>آیا از حذف ویدیو مطمئن هستید؟</p>
        <div className="buttons">
          <Button variant="success" onClick={deleteVideo}>
            بله
          </Button>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            خیر
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
}
