import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Input, Button } from "../../components";
import { axios } from "../../boot";
import { rules } from "../../methods";
import { useQueryString } from "../../hooks";
import bgDesktopImage from "../../assets/images/bg-login-desktop.svg";
import bgMobileImage from "../../assets/images/bg-login-mobile.svg";
import logoText from "../../assets/logo/logo-text.svg";
import "./index.scss";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryString = useQueryString();
  const [data, setData] = useState({});
  const [showCodeInput, setShowCodeInput] = useState(false);

  const isAdmin = queryString.isAdmin === "true";

  const setIsLogged = (data) => {
    dispatch({ type: "SET_IS_LOGGED", data });
  };
  const setRole = (data = "") => {
    localStorage.setItem("role", data);
    dispatch({ type: "SET_ROLE", data });
  };
  const sendCode = () => {
    const url = "/users/send-sms";
    const body = {
      phone: `+98${data.phone.substring(1)}`,
    };
    axios.post(url, body).then(() => {
      setShowCodeInput(true);
    });
  };
  const login = () => {
    const url = isAdmin ? "/users/login" : "/users/verify";
    const body = isAdmin
      ? {
          username: data.username,
          password: data.password,
        }
      : {
          code: data.code,
          phone: `+98${data.phone.substring(1)}`,
        };
    axios.post(url, body).then(({ data, headers }) => {
      const token = headers["x-auth-token"];
      axios.defaults.headers["x-auth-token"] = token;
      localStorage.setItem("token", token);
      const role = !isAdmin ? "student" : "admin";
      setIsLogged(true);
      setRole(role);
      navigate(`/${role}/terms`);
    });
  };
  const handleShowCode = () => {
    setShowCodeInput(false);
    setData((p) => ({ ...p, code: "" }));
  };
  const handleSubmit = () => {
    if (isAdmin) {
      login();
    } else {
      showCodeInput ? login() : sendCode();
    }
  };
  useEffect(handleShowCode, [data.phone]);
  return (
    <div className="Login position-relative w-100 d-flex flex-center">
      <img
        className="w-100 h-100 object-fit-cover d-none d-lg-block bg-img"
        src={bgDesktopImage}
        alt="bgDesktopImage"
      />
      <img
        className="w-100 h-100 object-fit-cover d-block d-lg-none bg-img"
        src={bgMobileImage}
        alt="bgMobileImage"
      />
      <Row className="flex-center position-relative w-100 overflow-auto">
        <Col xs="12" md="5" lg="3" className="py-2">
          <Form
            onSubmit={handleSubmit}
            className="w-100 d-flex flex-column flex-center bg-white rounded px-3 py-4 row-gap-3"
          >
            <img width="125" src={logoText} alt="logoText" />
            <hr />
            <h5>ورود</h5>
            {isAdmin ? (
              <React.Fragment>
                <Input
                  label="نام کاربری"
                  value={data.username}
                  setValue={(value) =>
                    setData((p) => ({ ...p, username: value }))
                  }
                  rules={rules.required}
                />
                <Input
                  label="کلمه عبور"
                  value={data.password}
                  setValue={(value) =>
                    setData((p) => ({ ...p, password: value }))
                  }
                  rules={rules.required}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Input
                  label="شماره موبایل"
                  value={data.phone}
                  setValue={(value) => setData((p) => ({ ...p, phone: value }))}
                  rules={rules.phoneNumber}
                />

                {showCodeInput && (
                  <Input
                    label="کد ارسال شده"
                    value={data.code}
                    type="number"
                    setValue={(value) =>
                      setData((p) => ({ ...p, code: value }))
                    }
                    rules={rules.required}
                  />
                )}
              </React.Fragment>
            )}
            <Button type="submit" className="w-100">
              {!showCodeInput && !isAdmin && "ارسال کد"}
              {(isAdmin || showCodeInput) && "ورود"}
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
