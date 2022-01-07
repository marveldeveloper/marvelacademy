import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
import BDropdown from "react-bootstrap/Dropdown";
import "./index.scss";
export default function Dropdown({
  label = "",
  value = "",
  items = [],
  itemLabel = "name",
  itemValue = "id",
  variant = "primary",
  outline = false,
  filter = false,
  changeLabel = false,
  className = "",
  drop = "down",
  align = "right",
  setValue = () => {},
}) {
  const showVariant = () => {
    if (outline) {
      return `outline-${variant}`;
    }
    return variant;
  };
  const [filterText, setFilterText] = useState("");
  const filterItem = () => {
    if (filter) {
      return items.filter((e) => e[itemLabel].search(filterText) !== -1);
    }
    return items;
  };
  const showTitle = () => {
    if (!changeLabel) return label;
    const defaultTitle = {};
    defaultTitle[itemLabel] = "انتخاب کنید";
    defaultTitle[itemValue] = "";
    const title =
      items.find((e) => String(e[itemValue]) === String(value)) ?? defaultTitle;
    return `${label}: ${title[itemLabel]}`;
  };
  return (
    <BDropdown
      className={`Dropdown w-fit ${className}`}
      onSelect={setValue}
      drop={drop}
    >
      <BDropdown.Toggle variant={showVariant()} className="Button btn-sm">
        {changeLabel ? showTitle() : label}
        <i className="bi bi-caret-down-fill" />
      </BDropdown.Toggle>
      <BDropdown.Menu align={align}>
        {filter && (
          <div className="dropdown-item">
            <FormControl
              autoFocus
              value={filterText}
              onChange={({ target }) => {
                setFilterText(target.value);
              }}
            />
          </div>
        )}
        {filterItem().map((item, index) => (
          <BDropdown.Item
            key={index}
            className="text-center"
            eventKey={item[itemValue]}
          >
            {item[itemLabel]}
          </BDropdown.Item>
        ))}
      </BDropdown.Menu>
    </BDropdown>
  );
}
