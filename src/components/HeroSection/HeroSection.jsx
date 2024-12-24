import React, { useEffect, useRef, useState } from "react";
import "./HeroSection.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Subscribers from "./subscribers.jsx";
import Subscriptions from "./subscriptions.jsx";
import PlusMenu from "./plusmenu.jsx";
import HerosectionSidebar from "./herosectionsidebar.jsx";
import AddVideoToPlaylist from "./addvideotoplaylist.jsx";
import {
  formatDuration,
  formatViewCount,
  timeSincePublished,
} from "../../utils/function.js";
import { handleShare } from "../../utils/handleshare.js";
const fetchTrendingVideos = async ({ videos, setVideos }) => {
  const options = {
    method: "GET",
    url: "https://yt-api.p.rapidapi.com/trending",
    params: {
      geo: "IN",
      lang: "en",
    },
    headers: {
      "x-rapidapi-key": import.meta.env.VITE_VIDEO_DETAIL_FETCHIING_API,
      "x-rapidapi-host": "yt-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    const trending = response.data.data;
    const newtrending = trending.filter((video) => video.type === "video");
    setVideos(newtrending);
    
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchVideolocal = async ({ videos, setVideos }) => {
  try {
    {
      const response = await axios.get("/api/v1/videos?");
      setVideos(response.data.data);
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

const HeroSection = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const mode = useSelector((state) => state.toggle.value);
  const [page, setpage] = useState(1);
  const [isloading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [videoId, setVideoId] = useState("");
  const cards = new Array(8).fill(null);
  const isauthenticated = useSelector((state) => state.authentication.value);
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState("");
  
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true); // Set loading to true before fetching
      if (mode) await fetchTrendingVideos({ videos, setVideos });
      else await fetchVideolocal({ videos, setVideos });

      setIsLoading(false); // Stop loading after videos are fetched
    };

    loadVideos();
    return () => {};
  }, [mode]);

  return (
    <div id="mainpage">
    <div
      className="hero-section instagram"
      onClick={(e) => {
        setShowOptions(false);
      }}
    >
      <HerosectionSidebar />
      <div className="hero-section__content">
        <h2 style={{ paddingLeft: "2rem" }}>Videos</h2>
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
                        {formatViewCount(Number(video.viewCount))} views
                      </span>
                      •<span> {video.publishedTimeText}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {!mode &&
            !isloading &&
            Array.isArray(videos) &&
            videos.length > 0 &&
            videos.map((video, index) => (
              <div key={index} className="video-card">
                <div style={{position:'relative'}}>
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
                    <Link
                      to={
                         `/video/${video._id}`
                          
                      }
                    >
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
                                handleShare(video._id,video.title.slice(0,20))
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
                                
                                  setVideoId(
                                    (prev) =>video._id
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

export default HeroSection;
