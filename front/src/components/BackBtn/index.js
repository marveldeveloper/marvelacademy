import { useNavigate } from "react-router-dom";
export default function BackBtn() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <button className="btn btn-outline-info btn-sm fs-7 border-0" onClick={goBack}>
      بازگشت
      <i className="bi bi-arrow-90deg-left me-1" />
    </button>
  );
}
