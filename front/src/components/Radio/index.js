import "./index.scss";
export default function Radio({
  label = "",
  name = "",
  option = "",
  value = "",
  setValue = () => {},
}) {
  return (
    <div className="Radio w-100">
      <label className="position-relative w-fit mw-100 text-start my-1 cursor-pointer d-flex fs-6">
        <input
          type="radio"
          name={name}
          value={option}
          checked={value === option}
          onChange={({ target }) => {
            setValue(target.value);
          }}
        />
        <div className="checkbox d-block position-relative ms-2 transition"></div>
        <p className="mb-0 overflow-wrap-break-word">{label}</p>
      </label>
    </div>
  );
}
