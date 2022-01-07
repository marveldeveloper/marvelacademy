import { useEffect, useRef } from "react";
import { srcFile } from "../../methods";
import "./index.scss";
export default function VideoPlayer({ src = "", autoPlay = false }) {
  const video = useRef();
  useEffect(() => {
    video.current.load();
  }, [src]);
  return (
    <div className="VideoPlayer bg-dark d-flex flex-center w-100 rounded overflow-hidden shadow">
      <video
        ref={video}
        autoPlay={autoPlay}
        className="w-100 h-100 object-fit-contain bg-dark"
        controls
        controlsList="nodownload"
      >
        <source src={srcFile(src)} />
      </video>
    </div>
  );
}
