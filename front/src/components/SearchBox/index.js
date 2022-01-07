import "./index.scss";
export default function SearchBox({
  value = "",
  setValue = () => {},
  onSubmit = () => {},
  label = "جستجو...",
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="SearchBox d-flex flex-center w-100 rounded-pill bg-white border border-dark"
    >
      <input
        type="text"
        value={value ?? ""}
        className="px-3"
        onChange={({ target }) => {
          setValue(target.value);
        }}
        placeholder={label}
      />
      <button type="submit">
        <i className="fs-5 bi bi-search" />
      </button>
    </form>
  );
}
