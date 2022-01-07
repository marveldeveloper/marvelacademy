import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRoutes, useLocation } from "react-router-dom";
import { routes } from "./constants";
import { clearCaches, handleShowCrisp, setPrototypes } from "./methods";
import { Loading } from "./components";

setPrototypes();

export default function App() {
  const location = useLocation();
  const loading = useSelector((s) => s.loading.length !== 0);
  const isLogged = useSelector((s) => s.isLogged);
  const role = useSelector((s) => s.role);
  const elements = useRoutes(routes(isLogged, role));
  useEffect(() => handleShowCrisp(location.pathname), [location.pathname]);
  useEffect(clearCaches, []);
  return (
    <React.Fragment>
      <h1 className="d-none">آکادمی مارول ترید</h1>
      <Toaster position="top-left" reverseOrder={false} />
      {elements}
      {loading && <Loading />}
    </React.Fragment>
  );
}
