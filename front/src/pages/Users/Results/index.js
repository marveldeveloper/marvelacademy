import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../../components";
import Exams from "./Exams";
import Homeworks from "./Homeworks";

export default function Results() {
  const tabs = [
    {
      index: 0,
      component: Exams,
      label: "آزمون‌ها",
    },
    {
      index: 1,
      component: Homeworks,
      label: "تمرین‌ها",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[1]);
  return (
    <div className="Results d-flex flex-column row-gap-5">
      <Row className="w-100">
        <Col xs="12" md="8" lg="6">
          <div className="w-100 buttons">
            {tabs.map((item, index) => (
              <Button
                key={index}
                label={item.label}
                outline={activeTab.index !== index}
                onClick={() => setActiveTab(item)}
              />
            ))}
          </div>
        </Col>
      </Row>
      <Row className="w-100">
        <Col xs="12" md="8" lg="6">
          {React.createElement(activeTab.component)}
        </Col>
      </Row>
    </div>
  );
}
