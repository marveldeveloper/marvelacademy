export default function getFileName(value = "") {
  const array = value.split("/");
  return array[array.length - 1];
}
