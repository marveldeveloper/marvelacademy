export default function handleShowCrisp(pathname = "") {
  const condition = pathname !== "/";
  document.body.classList.toggle("active-crisp", condition);
}
