import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import { Button } from "../../components";
import { navItems } from "../../constants";

export default function MainLayout() {
  const navigate = useNavigate();
  // const role = useSelector((s) => s.role);
  const isLogged = useSelector((s) => s.isLogged);
  const login = () => {
    if (isLogged) {
      navigate(`/student/terms`);
    } else {
      navigate(`/login`);
    }
  };
  return (
    <div className="MainLayout">
      <header className="border-bottom border-light-gray shadow-sm bg-white">
        <Container className="d-flex align-items-center">
          <div className="d-flex flex-center col-gap-1">
            <div className="avatar">
              <img src={logo} alt="logo" />
            </div>
            <h1 className="h6 lh-normal m-0">آکادمی مارول ترید</h1>
          </div>
          {isLogged ? (
            <nav className="me-2 text-dark d-flex align-items-center col-gap-3">
              {navItems.user.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "active fw-bold" : ""
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          ) : (
            <Button onClick={login} className="px-4 me-auto">
              ورود
            </Button>
          )}
        </Container>
      </header>
      <main className="container py-3">
        <Outlet />
      </main>
    </div>
  );
}
