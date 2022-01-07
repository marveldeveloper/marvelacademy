import { useState } from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "../../constants";
import { Modal, Button } from "../../components";
import { logout } from "../../methods";

export default function Menu({ show = false, setShow = () => {} }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  return (
    <div className="Menu position-fixed overflow-hidden h-100 transition">
      <button
        onClick={() => setShow(!show)}
        className="hide-btn position-absolute w-100 h-100"
      />
      <nav className="position-relative d-flex flex-column row-gap-3 text-light h-100 bg-dark px-3 py-5 overflow-auto transition">
        {navItems.admin.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "active text-info fw-bold" : ""
            }
          >
            <i className={`fs-5 ms-3 bi bi-${item.icon}`} />
            {item.label}
          </NavLink>
        ))}
        <div
          onClick={() => setShowLogoutModal(true)}
          className="mt-auto text-danger cursor-pointer"
        >
          <i className="fs-5 ms-3 bi bi-box-arrow-right" />
          خروج از حساب
        </div>
      </nav>
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
