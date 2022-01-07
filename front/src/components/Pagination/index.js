import "./index.scss";
export default function Pagination({
  totalPage = 1,
  activePage = 1,
  totalData = 1,
  totalPageData = 1,
  perPage = 1,
  setActivePage = () => {},
}) {
  return (
    <div className="Pagination w-100 d-flex align-items-center justify-content-between">
      <div className="pagination-box d-flex flex-center gap-2">
        <button className="btn btn-outline-primary">
          <i className="bi bi-chevron-right" />
        </button>
        <button className="btn btn-primary">1</button>
        <button className="btn btn-outline-primary">
          <i className="bi bi-chevron-left" />
        </button>
      </div>
      <p className="mb-0">{`نمایش 1 تا 5 از 10 رکورد`}</p>
    </div>
  );
}
