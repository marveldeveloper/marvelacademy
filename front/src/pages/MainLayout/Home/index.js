import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { cloneDeep } from "lodash";
import { axios, moment } from "../../../boot";
import { VideoPlayer, Badge, SearchBox } from "../../../components";
import "./index.scss";
import { srcFile } from "../../../methods";
export default function Home() {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useState({
    search: "",
    category: "all",
  });
  const getActiveVideo = (id = "", autoPlay = false) => {
    const url = `/pub/videos/${id}`;
    axios.get(url).then(({ data }) => {
      setActiveVideo({ ...data, autoPlay });
    });
  };
  const getVideos = () => {
    const url = "/pub/videos";
    const params = cloneDeep(searchParams);
    params.category === "all" && delete params.category;
    params.search.length < 3 && delete params.search;
    axios.get(url, { params }).then(({ data }) => {
      const videos = data.data;
      if (videos.length !== 0) {
        setVideos(videos);
        getActiveVideo(videos[0]._id);
      } else {
        setVideos([]);
        setActiveVideo(null);
      }
    });
  };
  const getCategories = () => {
    const url = "/pub/categories";
    axios.get(url).then(({ data }) => {
      setCategories(data.data.map((e) => ({ name: e.title_fa, id: e.title })));
    });
  };
  useEffect(getVideos, [searchParams.category]);
  useEffect(getCategories, []);
  return (
    <div className="Home d-flex flex-column row-gap-3">
      <div className="search-section d-flex flex-column row-gap-3">
        <div className="w-100 row">
          <Col xs="12" md="8" lg="6">
            <SearchBox
              value={searchParams.search}
              setValue={(val) =>
                setSearchParams((p) => ({ ...p, search: val }))
              }
              onSubmit={getVideos}
            />
          </Col>
        </div>
        <div className="d-flex flex-center flex-wrap w-100 gap-1">
          <button
            onClick={() => setSearchParams((p) => ({ ...p, category: "all" }))}
            style={{ all: "unset" }}
            className="cursor-pointer"
          >
            <Badge
              label="همه"
              variant={"all" === searchParams.category ? "success" : "dark"}
            />
          </button>
          {categories.map((item, index) => (
            <button
              onClick={() =>
                setSearchParams((p) => ({ ...p, category: item.id }))
              }
              key={index}
              style={{ all: "unset" }}
              className="cursor-pointer"
            >
              <Badge
                label={item.name}
                variant={item.id === searchParams.category ? "success" : "dark"}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="active-video row w-100">
        <Col xs="12" md="8">
          {activeVideo && (
            <VideoPlayer
              autoPlay={activeVideo.autoPlay}
              src={activeVideo.path}
            />
          )}
        </Col>
      </div>
      <div className="video-section">
        <Row>
          {videos.map((item, index) => (
            <Col key={index} xs="12" md="6" xl="4">
              <div
                onClick={() => getActiveVideo(item._id, true)}
                className="video-card cursor-pointer bg-white w-100 border border-light-gray rounded overflow-hidden d-flex shadow-sm transition"
              >
                <div className="img position-relative">
                  <img
                    className="w-100 h-100 object-fit-cover position-absolute"
                    src={srcFile(item.thumbnail)}
                    alt={item.title}
                  />
                  <div className="w-100 h-100 text-center bg-dark bg-opacity-50 d-flex flex-center position-relative fw-bold">
                    {activeVideo?._id === item._id ? (
                      <i className="bi bi-pause-fill text-light display-1" />
                    ) : (
                      <i className="bi bi-play-fill text-light display-1" />
                    )}
                  </div>
                </div>
                <div className="body d-flex flex-column py-1 px-2">
                  <label className="fw-bold text-truncate">{item.title}</label>
                  <p className="description text-secondary w-100 overflow-wrap-break-word">
                    {item.description}
                  </p>
                  <div className="text-info d-flex justify-content-between mt-auto text-end w-100 font-en fs-7">
                    <span>{categories.findById(item.category).name}</span>
                    <span>{moment.miladiToShamsi(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
