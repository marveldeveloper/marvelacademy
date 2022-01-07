import { Container } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import { navItems } from "../../constants";
import logo from "../../assets/logo/logo.png";
import "./index.scss";
import Footer from "./Footer";

export default function Users() {
  return (
    <div className="Users">
      <header className="border-bottom border-light-gray shadow-sm bg-white">
        <Container className="d-flex align-items-center justify-content-between">
          <div className="avatar ms-2">
            <img src={logo} alt="logo" />
          </div>
          <nav className="text-dark d-flex align-items-center w-100 col-gap-3">
            {navItems.user.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => (isActive ? "active fw-bold" : "")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <NavLink
            to={"profile"}
            className="btn btn-info btn-sm py-1 px-4 me-auto"
          >
            پروفایل
          </NavLink>
        </Container>
      </header>
      <Container as="main" className="py-4">
        <Outlet />
      </Container>
      <Footer/>
    </div>
  );
}
