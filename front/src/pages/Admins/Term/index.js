import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { Outlet, useParams } from "react-router";
import { axios } from "../../../boot";
import { BackBtn } from "../../../components";
import { objectMultiSelect } from "../../../methods";
import termInfo from "./_termInfo";

export const Context = React.createContext();

export default function Term() {
  const params = useParams();
  const [term, setTerm] = useState(null);
  const getTerm = () => {
    const url = `/admins/terms/${params.id}`;
    axios.get(url).then(({ data }) => {
      setTerm(data);
    });
  };
  const submitChange = (data = {}, callback = () => {}) => {
    const { id, sectionIndex, activityIndex } = params;
    const keys = ["description", "title", "type", "activityIndex"];
    const url = "/admins/terms/activity";
    const body = {
      termId: id,
      sectionIndex,
      activityIndex,
      ...objectMultiSelect(keys, data),
    };
    axios.post(url, body).then(() => {
      callback();
    });
  };
  useEffect(getTerm, []);
  return (
    term !== null && (
      <div className="Term row justify-content-start">
        <Col xs="12" className="text-end">
          <BackBtn />
        </Col>
        {termInfo(term).map((item, index) => (
          <Col
            key={index}
            xs="12"
            md={index === 7 ? "12" : "6"}
            lg={index === 7 ? "12" : "4"}
            xl={index === 7 ? "12" : "3"}
            className="d-flex col-gap-3"
          >
            <span>{item.label}</span>
            <span className="text-secondary overflow-hidden overflow-wrap-break-word">
              {item.value}
            </span>
          </Col>
        ))}
        <Context.Provider value={{ ...term, getTerm, setTerm, submitChange }}>
          <Col xs="12">
            <Outlet />
          </Col>
        </Context.Provider>
      </div>
    )
  );
}
