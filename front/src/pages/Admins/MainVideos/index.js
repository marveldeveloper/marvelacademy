import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { VideoCard, Button } from "../../../components";
import { axios } from "../../../boot";
import AddVideo from "./AddVideo";
export default function MainVideos() {
  const [showModal, setShowModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const getVideos = () => {
    const url = "/admins/pub/videos";
    axios.get(url).then(({ data }) => {
      setVideos(data.data);
    });
  };
  useEffect(getVideos, []);
  return (
    <React.Fragment>
      <Row>
        {videos.map((item, index) => (
          <Col key={index} xs="12" md="6" lg="4" xl="3">
            <VideoCard {...item} />
          </Col>
        ))}
        <Col xs="12" md="6" lg="4" xl="3">
          <div className="VideoCard bg-white d-flex flex-center w-100 border border-light-gray shadow-sm rounded">
            <Button onClick={() => setShowModal(true)}>
              اضافه کردن ویدیو جدید
            </Button>
          </div>
        </Col>
      </Row>
      <AddVideo show={showModal} onHide={setShowModal} afterSubmit={getVideos} />
    </React.Fragment>
  );
}
