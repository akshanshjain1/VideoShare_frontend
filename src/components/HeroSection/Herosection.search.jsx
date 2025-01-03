import React, { useEffect, useState } from "react";
import "./HeroSection.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import Subscribers from "./subscribers.jsx";
import Subscriptions from "./subscriptions.jsx";
import {
  FaHome,
  FaHeart,
  FaHistory,
  FaUpload,
  FaList,
  FaUserFriends,
  FaUsers,
  FaEye,
} from "react-icons/fa";
import PlusMenu from "./plusmenu.jsx";
import { useSelector } from "react-redux";
import HerosectionSidebar from "./herosectionsidebar.jsx";
import {
  formatDuration,
  formatViewCount,
  timeSincePublished,
} from "../../utils/function.js";
import { handleShare } from "../../utils/handleshare.js";
import AddVideoToPlaylist from "./addvideotoplaylist.jsx";
const fetchTrendingVideos = async ({ query, videos, setVideos }) => {
  const options = {
    method: "GET",
    url: "https://yt-api.p.rapidapi.com/search",
    params: {
      query,
      geo: "IN",
    },
    headers: {
      "x-rapidapi-key": "86bd841dbfmsheb65cfbd893a32dp1cef31jsn52d4e5f6440f",
      "x-rapidapi-host": "yt-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    const trending = response.data.data;
    const newtrending = trending.filter((video) => video.type === "video");
    if (!newtrending || newtrending.length === 0) setVideos([]);
    else setVideos(newtrending);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchVideolocal = async ({ query, videos, setVideos, page, sortBy }) => {
  try {
    const response = await axios.get(
      `/api/v1/videos?query=${query}&page=${page}&sortBy=${sortBy}`
    );
    if (!response.data.data) setVideos([]);
    else setVideos(response.data.data);
  } catch (error) {
    console.log(error);
    return [];
  }
};

const HeroSectionSearch = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const mode = useSelector((state) => state.toggle.value);
  const [page, setpage] = useState(1);
  const [isloading, setIsLoading] = useState(true);
  const isauthenticated = useSelector((state) => state.authentication.value);
  const [sortBy, setsortBy] = useState("views");
  const cards = new Array(8).fill(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [showForm, setShowForm] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [showOptions, setShowOptions] = useState("");
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true); // Set loading to true before fetching
      if (mode) await fetchTrendingVideos({ query, videos, setVideos });
      else await fetchVideolocal({ query, videos, setVideos, page, sortBy });

      setIsLoading(false); // Stop loading after videos are fetched
    };

    loadVideos();
  }, [query, mode, searchParams, sortBy]);

  return (
    <div id="mainpage">
      <div className="hero-section instagram">
        <HerosectionSidebar />

        <div className="hero-section__content">
          {!mode &&
            !isloading &&
            Array.isArray(videos) &&
            videos.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "20%",
                  gap: "0.3rem",
                  marginLeft: "2rem",
                  height: "fit-content",
                  padding: "0.1rem",
                }}
              >
                <button
                  style={{
                    height: "fit-content",
                    padding: "0.5rem",
                    backgroundColor: sortBy === "views" ? "#333" : "#f9f9f9",
                    color: sortBy === "views" ? "#fff" : "#000",

                    cursor: "pointer",
                    outline: "none",

                    transition: "background-color 0.3s, color 0.3s",
                  }}
                  onClick={() => setsortBy("views")}
                >
                  Views
                </button>
                <button
                  style={{
                    height: "fit-content",
                    padding: "0.5rem",
                    backgroundColor:
                      sortBy === "createdAt" ? "#333" : "#f9f9f9",
                    color: sortBy === "createdAt" ? "#fff" : "#000",

                    cursor: "pointer",
                    outline: "none",
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                  onClick={() => setsortBy("createdAt")}
                >
                  Upload Date
                </button>
              </div>
            )}
          <div className="trending-videos">
            {isloading &&
              cards.map((_, index) => (
                <div key={index} className="loading-card">
                  <div className="loading-thumbnail">
                    <div className="skeleton-img"></div>
                    <div className="skeleton-duration"></div>
                  </div>
                  <div className="loading-card-content">
                    <div className="skeleton-channel-thumbnail"></div>
                    <div className="loading-card-details">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-channel-name"></div>
                      <div className="skeleton-metadata">
                        <div className="skeleton-view-count"></div>
                        <div className="skeleton-published-time"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {mode &&
              !isloading &&
              Array.isArray(videos) &&
              videos.length > 0 &&
              videos.map((video, index) => (
                <div key={index} className="video-card">
                  <div style={{ position: "relative" }}>
                    <img
                      src={
                        Array.isArray(video.thumbnail).toString() &&
                        video.thumbnail[0]?.url
                      }
                      alt={video.title}
                    />
                    <span className="duration">
                      {video.lengthText ||
                        formatDuration(parseInt(video.duration))}
                    </span>
                  </div>
                  <div className="video-card-content">
                    <img
                      src={
                        Array.isArray(video.channelThumbnail) &&
                        video.channelThumbnail[0]?.url
                      }
                      alt={video.channelTitle}
                      className="channel-thumbnail"
                    />
                    <div
                      className="video-card-details"
                      style={{ paddingLeft: "0.2rem" }}
                    >
                      <Link to={`/youtubevideo/${video.videoId}`}>
                        <h3>
                          {video.title?.length > 40
                            ? `${video.title.slice(0, 50)}...`
                            : video.title}
                        </h3>
                      </Link>
                      <Link
                        to={`https://www.youtube.com/results?search_query=${video.channelTitle}`}
                      >
                        <p>{video.channelTitle}</p>
                      </Link>

                      <div className="metadata">
                        <span>
                          {formatViewCount(
                            Number(video.viewCount || video.views)
                          )}{" "}
                          views
                        </span>{" "}
                        •
                        <span>
                          {video.publishedTimeText ||
                            timeSincePublished(video.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {!mode &&
              !isloading &&
              Array.isArray(videos) &&
              videos.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "top",
                    height: "100vh",
                    overflow: "hidden",
                    fontSize: "2rem",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    fontSmooth: "always",
                    width: "100%",
                  }}
                >
                  {" "}
                  No Videos Available{" "}
                </div>
              )}

            {!mode &&
              !isloading &&
              Array.isArray(videos) &&
              videos.length > 0 &&
              videos.map((video, index) => (
                <div key={index} className="video-card">
                  <div style={{ position: "relative" }}>
                    <img src={video.thumbnail} alt={video.title} />
                    <span className="duration">
                      {formatDuration(parseInt(video.duration))}
                    </span>
                  </div>
                  <div
                    className="video-card-content"
                    style={{ paddingLeft: "0.2rem" }}
                  >
                    <Link
                      to={
                        isauthenticated
                          ? `/video/${video._id}`
                          : `/login?returnurl=/video/${video._id}`
                      }
                    >
                      <img
                        src={video.owneravatar}
                        alt={video.ownername}
                        className="channel-thumbnail"
                      />
                    </Link>
                    <div className="video-card-details">
                      <Link to={`/video/${video._id}`}>
                        <h3>
                          {video.title.length > 40
                            ? `${video.title.slice(0, 50)}...`
                            : video.title}
                        </h3>
                      </Link>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Link
                            to={
                              isauthenticated
                                ? `/user/${video.ownerusername}`
                                : `/login?returnurl=/user/${video.ownerusername}`
                            }
                          >
                            <p>{video.ownername}</p>
                          </Link>
                          <div className="metadata">
                            <span>
                              {formatViewCount(Number(video.views))} views
                            </span>{" "}
                            •<span> {timeSincePublished(video.createdAt)}</span>
                          </div>
                        </div>

                        <div className="video-options">
                          <button
                            className="options-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowOptions((prev) =>
                                prev === video._id ? null : video._id
                              );
                            }}
                          >
                            ⋮
                          </button>
                          {showOptions === video._id && (
                            <div className="options-menu">
                              <button
                                className="delete-option"
                                onClick={() => {
                                  handleShare(
                                    video._id,
                                    video.title.slice(0, 20)
                                  );
                                }}
                              >
                                <div
                                  style={{
                                    width: "fit-content",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  Share
                                </div>
                              </button>
                              <button
                                className="delete-option"
                                onClick={() => {
                                  setShowForm(true);

                                  setVideoId((prev) => video._id);
                                }}
                              >
                                <div
                                  style={{
                                    width: "fit-content",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  Add to Playlist
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {showForm && (
            <AddVideoToPlaylist
              setShowForm={setShowForm}
              videoId={videoId}
              setVideoId={setVideoId}
            />
          )}
        </div>
        <PlusMenu />
      </div>
    </div>
  );
};

export default HeroSectionSearch;
