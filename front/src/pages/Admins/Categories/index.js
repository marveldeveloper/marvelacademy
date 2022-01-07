import React, { useEffect, useState } from "react";
import { ButtonGroup, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import { cloneDeep } from "lodash";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Dropdown,
} from "../../../components";
import { termStatus } from "../../../constants";
import { axios } from "../../../boot";
import { rules, toast } from "../../../methods";

export default function Categories() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    status: "enabled",
  });
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const getCategories = () => {
    const url = "/admins/pub/categories";
    axios.get(url).then(({ data }) => {
      setCategories(data.data);
    });
  };

  const addNewCategory = () => {
    const url = "/admins/pub/categories";
    const body = data;
    axios.post(url, body).then(() => {
      const text = "دسته بندی با موفقیت اضافه شد.";
      toast({ text });
      setShowAddCategory(false);
      getCategories();
    });
  };

  const deleteCategory = (_id = "") => {
    const url = "/admins/pub/categories";
    const body = {
      data: { _id },
    };
    axios.delete(url, body).then(() => {
      const newCategories = cloneDeep(categories);
      const index = newCategories.findIndex((e) => e._id === _id);
      newCategories.splice(index, 1);
      setCategories(newCategories);
      const text = "دسته بندی با موفقیت حذف شد.";
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

  useEffect(getCategories, []);
  return (
    <div className="Categories">
      <Table>
        <thead>
          <tr>
            <td>ردیف</td>
            <td>موضوع</td>
            <td>کلمه کلیدی</td>
            <td>توضیحات</td>
            <td>وضعیت</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.title_fa}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{termStatus.badge(item.status)}</td>
              <td>
                <ButtonGroup dir="ltr">
                  <Button variant="primary" onClick={() => navigate(item._id)}>
                    جزئیات
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteCategory(item._id)}
                  >
                    حذف
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
          <tr>
            <td className="text-center" colSpan="6">
              <Button
                variant="primary"
                onClick={() => setShowAddCategory(true)}
              >
                اضافه کردن دسته بندی
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        title="اضافه کردن دسته بندی"
        show={showAddCategory}
        onHide={setShowAddCategory}
      >
        <Form className="row" onSubmit={addNewCategory}>
          {formControls.map((item, index) => (
            <Col key={index} xs="12">
              {React.createElement(item.tag, {
                value: data[item.state],
                setValue: (val) =>
                  setData((p) => ({ ...p, [item.state]: val })),
                rules: rules.required,
                ...item,
              })}
            </Col>
          ))}
          <Col xs="12" className="d-flex flex-center">
            <Button type="submit" variant="success" label="ثبت" />
          </Col>
        </Form>
      </Modal>
    </div>
  );
}
