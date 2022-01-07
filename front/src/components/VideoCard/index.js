import { useNavigate } from "react-router-dom";
import { Button } from "..";
import { srcFile } from "../../methods";
import "./index.scss";
export default function VideoCard({
  _id = "",
  thumbnail = "",
  title = "",
  description = "",
  status = "",
  ...props
}) {
  const navigate = useNavigate();
  const goToVideo = () => {
    navigate(_id);
  };
  return (
    <div className="VideoCard position-relative bg-white d-flex flex-column text-center w-100 border border-light-gray shadow-sm rounded overflow-hidden">
      <div className="status position-absolute d-flex flex-center overflow-hidden">
        {status === "disabled" && (
          <span className="position-absolute fw-bold bg-danger text-white shadow d-flex flex-center text-center">
            غیر فعال
          </span>
        )}
      </div>
      <img
        className="w-100 object-fit-cover"
        height="150"
        src={srcFile(thumbnail)}
        alt={title}
      />
      <div className="body d-flex flex-column flex-center p-2 pt-3">
        <label className="w-100 text-info mb-1 text-truncate">{title}</label>
        <p className="description w-100 text-secondary">{description}</p>
        <Button
          onClick={goToVideo}
          outline
          variant="indigo"
          className="mt-auto w-75"
        >
          مشاهده جزئیات
        </Button>
      </div>
    </div>
  );
}
