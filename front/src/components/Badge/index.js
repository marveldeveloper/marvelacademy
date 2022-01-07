import BBadge from "react-bootstrap/Badge";
import "./index.scss";
export default function Badge({
  label = "",
  pill = false,
  variant = "primary",
  // color = "light",
}) {
  return (
    <BBadge
      pill={pill}
      className={`bg-${variant} text-${variant} border-${variant} border bg-opacity-10 rounded-1 fs-7 transition`}
    >
      {label ?? ""}
    </BBadge>
  );
}
