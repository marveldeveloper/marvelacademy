import BForm from "react-bootstrap/Form";
export default function Form({
  onSubmit = () => {},
  className = "",
  children = "",
}) {
  const submit = (e) => {
    e.preventDefault();
    const fields = e.target.getElementsByClassName("check-valid");
    const values = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const checkValid = field.oncheckvalid ?? (() => true);
      values.push(checkValid());
    }
    if (values.every((e) => e === true)) {
      onSubmit(true);
    }
  };
  return (
    <BForm className={className} onSubmit={submit}>
      {children}
    </BForm>
  );
}
