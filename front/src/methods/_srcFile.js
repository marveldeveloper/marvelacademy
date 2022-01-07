import { server } from "../constants";
export default function srcFile(fileName = "") {
  return `${server}/${fileName}`;
}
