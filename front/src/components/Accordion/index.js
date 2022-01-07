import React, { useState, useRef, useEffect } from "react";
import "./index.scss";

export default function Accordion({
  title = "",
  defaultSetActive = false,
  children = "",
}) {
  const [setActive, setActiveState] = useState(defaultSetActive);
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");

  const contentRef = useRef(null);

  const toggleAccordion = () => {
    setActiveState((prev) => !prev);
  };

  useEffect(() => {
    setHeightState(!setActive ? "0px" : `${contentRef.current.scrollHeight}px`);
    setRotateState(!setActive ? "accordion__icon" : "accordion__icon rotate");
  }, [setActive]);

  return (
    <div className="accordion__section border border-light-gray shadow-sm bg-white">
      <button
        className={`accordion transition py-3 px-2 ${setActive ? "active" : ""}`}
        onClick={toggleAccordion}
      >
        <p className="accordion__title mb-0">{title}</p>
        <Chevron
          className={`${setRotate}`}
          width={10}
          height={10}
          fill={"#777"}
        />
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: `${setHeight}` }}
        className="accordion__content"
      >
        <div className="accordion__text py-2 px-1">{children}</div>
      </div>
    </div>
  );
}

function Chevron({ className = "", height = "", width = "", fill = "" }) {
  return (
    <svg
      className={className}
      height={height}
      width={width}
      viewBox="0 0 266 438"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m258.476 235.971-194.344 194.343c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901l154.021-154.746-154.021-154.745c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0l194.343 194.343c9.373 9.372 9.373 24.568.001 33.941z"
        fill={fill}
      />
    </svg>
  );
}
