import BTable from "react-bootstrap/Table";
import "./index.scss";
export default function Table({
  striped = false,
  bordered = false,
  hover = true,
  className = "",
  children,
}) {
  return (
    <div className="Table overflow-auto white-space-nowrap shadow bg-white rounded p-1">
      <BTable
        striped={striped}
        bordered={bordered}
        hover={hover}
        className={`${className}`}
      >
        {children}
      </BTable>
    </div>
  );
}
