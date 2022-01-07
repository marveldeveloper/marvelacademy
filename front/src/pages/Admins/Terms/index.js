import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { cloneDeep } from "lodash";
import { axios } from "../../../boot";
import { Button, Modal, Card } from "../../../components";
import { toast } from "../../../methods";
import AddNewTerm from "./AddNewTerm";
import UpdateTerm from "./UpdateTerm";

export default function Terms() {
  const [terms, setTerms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const getTerms = () => {
    const url = "/admins/terms";
    axios.get(url).then(({ data }) => {
      setTerms(
        data.data
          .sort((a, b) => {
            return a.index - b.index;
          })
          .map((item) => ({ ...item, rule: "admin" }))
      );
    });
  };
  const setEditedTerm = (data = {}) => {
    const newTerms = cloneDeep(terms);
    const newTerm = cloneDeep(data);
    const index = newTerms.findIndex((e) => e._id === data._id);
    newTerms[index] = newTerm;
    setTerms(newTerms);
  };
  const deleteTerm = () => {
    const url = "/admins/terms";
    const body = {
      data: {
        _id: deletedId,
      },
    };
    axios.delete(url, body).then(() => {
      const newTerms = cloneDeep(terms);
      const index = newTerms.findIndex((e) => e._id === deletedId);
      newTerms.splice(index, 1);
      setTerms(newTerms);
      const text = "ترم با موفقیت حذف شد.";
      toast({ text });
      setDeletedId(null);
    });
  };
  useEffect(getTerms, []);
  return (
    <div className="Terms">
      <Row>
        {terms.map((item, index) => (
          <Col key={index} xs="12" md="6" lg="4" xl="3">
            <Card
              onEdit={() => setEditData(item)}
              onDelete={() => setDeletedId(item._id)}
              {...item}
            />
          </Col>
        ))}
        <Col xs="12" md="6" lg="4" xl="3">
          <div className="Card rounded-3 shadow bg-white border overflow-hidden d-flex flex-center">
            <Button
              variant="primary"
              className="w-75"
              onClick={() => setShowModal(true)}
            >
              افزودن ترم جدید
            </Button>
          </div>
        </Col>
      </Row>
      <Modal
        title="حذف ترم"
        type="warning"
        show={deletedId !== null}
        onHide={() => setDeletedId(null)}
      >
        <p>آیا از حذف ترم مطمئن هستید؟</p>
        <div className="buttons">
          <Button variant="danger" onClick={() => setDeletedId(null)}>
            خیر
          </Button>
          <Button variant="success" onClick={deleteTerm}>
            بله
          </Button>
        </div>
      </Modal>
      <UpdateTerm
        show={editData !== null}
        onHide={() => setEditData(null)}
        baseData={editData}
        afterEditTerm={setEditedTerm}
      />
      <AddNewTerm
        show={showModal}
        onHide={setShowModal}
        afterAddTerm={getTerms}
      />
    </div>
  );
}
