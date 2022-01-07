import { Badge } from "../components";

const defaultValue = {
  name: "نامشخص",
  id: null,
  color: "dark",
};
export default function setPrototypes() {
  // eslint-disable-next-line
  Array.prototype.findById = function (id = "") {
    return this.find((e) => e.id === id) ?? defaultValue;
  };
  // eslint-disable-next-line
  Array.prototype.badge = function (id = "") {
    const { color, name } = this.find((e) => e.id === id) ?? defaultValue;
    return <Badge label={name} variant={color} />;
  };
}