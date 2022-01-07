import { useState, useEffect } from "react";
import { ProfileCard, Button, Modal } from "../../../components";
import { axios } from "../../../boot";
import { logout } from "../../../methods";
import { Col, Row } from "react-bootstrap";

export default function Profile() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profile, setProfile] = useState({});
  const getProfile = () => {
    const url = "/users/me";
    axios.get(url).then(({ data }) => {
      setProfile({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phoneNumber: `0${data.phone.substring(3)}`,
        progress: data.progress,
      });
    });
  };
  useEffect(getProfile, []);
  return (
    <div className="Profile">
      <Row>
        <Col
          xs="12"
          md="8"
          lg="7"
          xl="5"
          className="d-flex flex-column flex-center row-gap-5"
        >
          <ProfileCard {...profile} />
          <Button
            onClick={() => setShowLogoutModal(true)}
            variant="danger"
            className="w-50"
          >
            خروج از حساب
          </Button>
        </Col>
      </Row>
      <Modal
        title="خروج از حساب"
        type="warning"
        show={showLogoutModal}
        onHide={setShowLogoutModal}
      >
        <p>آیا از درخواست مطمئن هستید؟</p>
        <div className="buttons">
          <Button variant="danger" onClick={() => setShowLogoutModal(false)}>
            خیر
          </Button>
          <Button variant="success" onClick={logout}>
            بله
          </Button>
        </div>
      </Modal>
    </div>
  );
}
