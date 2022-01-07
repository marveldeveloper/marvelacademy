import { axios } from "../boot";
import { server } from "../constants";
export default function downloadFile(fileName = "") {
  const isInternal = fileName.search("http") === -1;
  const url = isInternal ? `${server}/${fileName}` : `${fileName}`;
  axios.get(url, { responseType: "blob" }).then(({ data }) => {
    const href = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement("a");
    a.href = href;
    a.download = fileName;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}
