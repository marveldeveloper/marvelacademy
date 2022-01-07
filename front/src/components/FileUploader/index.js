import { useRef, useEffect } from "react";
import "./index.scss";
export default function FileUploader({
  label = "",
  value = [],
  setValue = () => {},
  multiple = true,
  accept = "*",
  rules = [],
}) {
  const input = useRef();
  const message = useRef();

  const createCustomEvent = () => {
    new CustomEvent("oncheckvalid", {
      bubbles: true,
      cancelable: true,
      composed: false,
    });
    input.current.oncheckvalid = () => {
      return rules.every((rule) => {
        const isValid = rule(value ?? []);
        if (isValid !== true) {
          message.current.innerText = isValid;
        } else {
          rules.length !== 0 && (message.current.innerText = "");
        }
        return isValid === true;
      });
    };
  };
  useEffect(createCustomEvent, [value]);
  return (
    <div className="FileUploader bg-white rounded p-4 rounded shadow-sm w-100 border border-info">
      <header className="text-center h5 text-info">{label}</header>
      <div
        onClick={() => input.current.click()}
        className="form d-flex flex-center flex-column row-gap-3 rounded border-info text-info cursor-pointer my-3"
      >
        <i className="bi bi-file-earmark-plus display-4" />
        <p className="m-0 text-center">آپلود فایل</p>
        <input
          ref={input}
          multiple={multiple}
          className="d-none check-valid"
          type="file"
          accept={accept}
          onInput={({ target }) => {
            const val = [];
            for (let i = 0; i < target.files.length; i++) {
              val.push(target.files[i]);
            }
            setValue(val);
          }}
        />
        {rules.length !== 0 && (
          <p
            ref={message}
            className="message text-center w-100 d-block text-danger px-2 mb-0"
          ></p>
        )}
      </div>
      <section className="files w-100 d-flex flex-column row-gap-2 text-info">
        {(value ?? []).map((item, index) => (
          <div
            key={index}
            className="file w-100 bg-info bg-opacity-10 d-flex flex-center rounded shadow-sm px-2 py-1"
          >
            <div className="content text-truncate">
              <span className="text-truncate">{item.name}</span>
            </div>
            <i className="bi bi-file-earmark fs-3" />
          </div>
        ))}
      </section>
    </div>
  );
}
