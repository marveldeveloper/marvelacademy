import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router";
import { Accordion } from "../../../components";
import { axios } from "../../../boot";
import Video from "./Video";
import Exam from "./Exam";
import Homework from "./Homework";

export const Context = React.createContext();

export default function Term() {
  const params = useParams();
  const [term, setTerm] = useState(null);
  const [activeActivity, setActiveActivity] = useState(null);
  const getTerm = () => {
    const url = `/terms/${params.id}`;
    axios.get(url).then(({ data }) => {
      setTerm(data);
      setActiveActivity({
        ...data.sections[0][0],
        sectionIndex: 0,
        activityIndex: 0,
      });
    });
  };
  const types = [
    {
      component: Video,
      name: "video",
    },
    {
      component: Exam,
      name: "exam",
    },
    {
      component: Homework,
      name: "homework",
    },
  ];
  const activeType =
    activeActivity !== null &&
    types.find((e) => e.name === activeActivity.type);
  const showActiveButton = (sectionIndex, activityIndex) => {
    if (activeActivity === null) return "-outline";
    const condition =
      activeActivity.sectionIndex === sectionIndex &&
      activeActivity.activityIndex === activityIndex;
    if (condition) return "";
    return "-outline";
  };
  useEffect(getTerm, []);
  return (
    <div className="Term">
      {term !== null && (
        <Row className="flex-md-row-reverse align-items-start">
          <Col xs="12" lg="5" xl="4">
            <div className="d-flex flex-column">
              <label className="mb-2">{`<< جلسات ${term.title} >>`}</label>
              <div className="sections">
                {term.sections.map((section, sectionIndex) => (
                  <Accordion
                    key={sectionIndex}
                    title={`جلسه ${sectionIndex + 1}`}
                    defaultSetActive={sectionIndex === 0}
                  >
                    <div className="d-flex flex-column flex-center">
                      {section.map((activity, activityIndex) => (
                        <button
                          key={activityIndex}
                          className={`d-flex align-items-center justify-content-between w-100 border-0 rounded-0 btn btn${showActiveButton(
                            sectionIndex,
                            activityIndex
                          )}-dark-gray text-start`}
                          disabled={!activity.unlocked}
                          onClick={() =>
                            setActiveActivity({
                              ...activity,
                              sectionIndex,
                              activityIndex,
                            })
                          }
                        >
                          <span className="text-truncate" style={{ flex: "1" }}>
                            {activity.title}
                          </span>
                          {!activity.unlocked && <i className="bi bi-lock" />}
                        </button>
                      ))}
                    </div>
                  </Accordion>
                ))}
              </div>
            </div>
          </Col>
          <Context.Provider value={{ activity: activeActivity }}>
            <Col xs="12" lg="7" xl="8" className="d-flex flex-column">
              {activeType && (
                <React.Fragment>
                  <label className="mb-2 text-truncate">{`<< جلسه ${
                    activeActivity.sectionIndex + 1
                  }: ${activeActivity.title} >>`}</label>
                  <p className="overflow-wrap-break-word text-secondary">
                    {activeActivity.description}
                  </p>
                  {React.createElement(activeType.component)}
                </React.Fragment>
              )}
            </Col>
          </Context.Provider>
        </Row>
      )}
    </div>
  );
}
