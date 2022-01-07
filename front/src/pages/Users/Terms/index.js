import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { TermCard } from "../../../components";
import { axios } from "../../../boot";
export default function Terms() {
  const [terms, setTerms] = useState([]);
  const getTerms = () => {
    const url = "/terms";
    axios.get(url).then(({ data }) => {
      setTerms(data.data.map((item) => ({ ...item, rule: "student" })));
    });
  };
  useEffect(getTerms, []);
  return (
    <div className="Terms">
      <Row>
        {terms.map((item, index) => (
          <Col key={index} xs="12" md="6" lg="4" xl="3">
            <TermCard {...item} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
