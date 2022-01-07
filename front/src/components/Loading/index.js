import "./index.scss";
export default function Loading() {
  return (
    <div className="Loading position-fixed d-flex flex-center w-100 h-100">
      <div className="lds-ring">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border-indigo"></div>
        ))}
      </div>
    </div>
  );
}
