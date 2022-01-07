import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
export default function Input({
  label = "",
  value = "",
  setValue = () => {},
  rules = [],
  type = "text",
  append = "",
  prepend = "",
  as = "input",
}) {
  const input = useRef();
  const message = useRef();
  const [focused, setFocused] = useState(false);

  const createCustomEvent = () => {
    new CustomEvent("oncheckvalid", {
      bubbles: true,
      cancelable: true,
      composed: false,
    });
    input.current.oncheckvalid = () => {
      return rules.every((rule) => {
        const isValid = rule(value ?? "");
        if (isValid !== true) {
          message.current.innerText = isValid;
        } else {
          rules.length !== 0 && (message.current.innerText = "");
        }
        return isValid === true;
      });
    };
  };

  useEffect(() => {
    input.current.classList.toggle("focused", focused);
  }, [focused]);
  useEffect(createCustomEvent, [value]);

  return (
    <div ref={input} className="Input position-relative w-100 check-valid">
      <span className="text-start d-block w-100 fs-7">{label}</span>
      <div className="input-box d-flex flex-center w-100 position-relative border-bottom border-dark">
        {prepend}
        {React.createElement(as, {
          className: "px-3 border-0 text-center mw-100",
          type: type,
          value: value ?? "",
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          onInput: ({ target }) => {
            setValue(target.value);
          },
        })}
        {append}
      </div>
      {rules.length !== 0 && (
        <p
          ref={message}
          className="message w-100 d-block text-danger text-start px-2 mb-0"
        ></p>
      )}
    </div>
  );
}
