import React, { useContext } from "react";
import { VideoPlayer, Button } from "../../../components";
import { downloadFile, getFileName } from "../../../methods";
import { Context } from ".";
export default function Video() {
  const { activity } = useContext(Context);
  return (
    <div className="Video d-flex flex-column row-gap-4">
      <VideoPlayer src={activity.files?.video} />
      <div className="files w-100 d-flex flex-column flex-center shadow bg-light-gray rounded overflow-hidden">
        {/* <label>لیست فایل‌های دانلودی</label> */}
        {activity.files?.paths?.map((item, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <hr className="my-0 w-75 bg-light" />}
            <div className="w-100 d-flex align-items-center justify-content-between col-gap-2 px-3 py-2">
              <span
                className="text-truncate text-secondary"
                style={{ flex: "1" }}
              >
                {getFileName(item)}
              </span>
              <Button onClick={() => downloadFile(item)}>
                <i className="bi bi-download" />
              </Button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
