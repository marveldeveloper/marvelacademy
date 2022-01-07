import { useEffect, useRef } from "react";
import "./index.scss";
export default function Modal({
  show = true,
  onHide = () => {},
  type = "primary",
  title = "",
  children = null,
}) {
  const modal = useRef();
  const handleShow = () => {
    modal.current.classList.toggle("show", show);
  };
  useEffect(handleShow, [show]);
  return (
    <div
      ref={modal}
      className="Modal text-center position-fixed d-flex flex-center overflow-hidden p-2 transition"
    >
      <button className="hide-btn" onClick={() => onHide(false)} />
      <div className="dialog w-100 modal-dialog border border-light-gray bg-white rounded shadow-sm position-relative transition overflow-auto">
        <div className="header w-100 d-flex flex-center text-center">
          <div
            className={`title w-100 border-bottom border-light-gray p-2 fs-6 text-${type}`}
          >
            {title}
          </div>
        </div>
        <div className="body p-3">{children}</div>
      </div>
    </div>
  );
}
