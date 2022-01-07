import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import Menu from "./Menu";
import "./index.scss";

export default function Admins() {
  const admin = useRef();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    admin.current.classList.toggle("active", showMenu);
  }, [showMenu]);
  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);
  return (
    <div ref={admin} className="Admins position-relative transition">
      <Menu show={showMenu} setShow={setShowMenu} />
      <header className="border-bottom border-light-gray shadow-sm bg-white">
        <Container className="d-flex align-items-center justify-content-between">
          <i
            className="fs-2 cursor-pointer bi bi-list"
            onClick={() => setShowMenu((p) => !p)}
          />
          <div className="avatar">
            <img src={logo} alt="logo" />
          </div>
        </Container>
      </header>
      <Container as="main" className="py-4">
        <Outlet />
      </Container>
    </div>
  );
}
