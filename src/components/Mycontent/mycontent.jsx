import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import "./mycontent.css";
import UploadVideo from "./uploaddiv";
import { Link } from "react-router-dom";
import ChangeThumbnail from "../Playlist/changethumbnailplaylist";
import AddVideoToPlaylist from "./addvideotoplaylist";
import UpdateVideo from "./updatevideo";

function Mycontent() {
  const [user, setUser] = useState({});
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showOptions, setShowOptions] = useState(null);
  const [method, setmethod] = useState("");
  const [videoIdforAdd, setvideoIDforAdd] = useState("");
  const [showThumbnailChangeForm, setshowThumbnailChangeForm] = useState(false);
  const [showFormforplaylist, setshowFormforplaylist] = useState(false);
  const getUser = async () => {
    try {
      const res = await axios.get("/api/v1/users/current-user");
      
      setUser(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
    }
  };

  const getVideos = async () => {
    try {
      const response = await axios.post("/api/v1/videos/current-user-video",{});
      setVideos(response.data.data);
    } catch (error) {
      toast.error("Cannot get videos");
    }
  };
  const handledeletevideo = async (videoId) => {
    try {
      await axios.delete(`/api/v1/videos/${videoId}`);
      setVideos(videos.filter((video) => video._id !== videoId));
      toast.success("Video Deleted SuccessFully");
    } catch (error) {
      toast.error("Cannot Delete Video");
    }
  };

  useEffect(() => {
    getUser();
    getVideos();
  }, []);

  return (
    <div id="content">
      <div className="mycontent-container">
        {/* Profile and Videos Section Combined */}
        <div className="profile-and-videos-container">
          {/* Profile Section */}
          <div className="profile-section">
            <div
              className="cover-image"
              style={{ backgroundImage: `url(${user?.coverimage})` }}
            ></div>
            <div className="profile-details">
              <img src={user?.avatar} alt="Profile" className="profile-photo" />
              <div className="info">
                <h1>{user.username}</h1>
                <p>{user.fullname}</p>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Videos Section */}
          <div className="videos-section">
            <div className="video-header">
              <h2>Uploaded Videos</h2>
              <button
                className="add-video-button"
                onClick={() => setShowForm(true)}
              >
                Add Video
              </button>
            </div>

            <div className="videos-list">
              {videos.map((video, index) => (
                <div
                  className="video-item"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "1rem",
                    }}
                  >
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="video-details">
                      <Link to={`/video/${video._id}`}>
                        <p className="video-title">{video.title}</p>
                      </Link>
                      <p className="video-date">
                        Published on {video.createdAt.slice(0, 10)}
                      </p>
                      <p className="video-views">{video.views} views</p>
                    </div>
                  </div>
                  <div className="video-options">
                    <button
                      className="options-button"
                      onClick={() =>
                        setShowOptions((prev) =>
                          prev === video._id ? null : video._id
                        )
                      }
                    >
                      ⋮
                    </button>
                    {showOptions === video._id && (
                      <div className="options-menu">
                        <button
                          className="delete-option" 
                          onClick={() => {
                            setmethod("update");
                            setshowThumbnailChangeForm(true);
                            setvideoIDforAdd((prev) => video._id);
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
                            Edit Video
                          </div>
                        </button>
                        <button
                          className="delete-option"
                          onClick={() => handledeletevideo(video._id)}
                        >
                          <div
                            style={{
                              width: "fit-content",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            Delete Video
                          </div>
                        </button>
                        <button
                          className="delete-option"
                          onClick={() => {
                            setshowFormforplaylist(true);
                            setmethod("addtoplaylist"),
                              setvideoIDforAdd((prev) => video._id);
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
              ))}
            </div>
          </div>
        </div>

        {/* Add Video Form Overlay */}
        {showForm && <UploadVideo setShowForm={setShowForm} setVideos={setVideos}/>}
        {showFormforplaylist && (
          <AddVideoToPlaylist
            setShowForm={setshowFormforplaylist}
            videoId={videoIdforAdd}
            setVideoId={setvideoIDforAdd}
          />
        )}
        {showThumbnailChangeForm && (
          <UpdateVideo
            setShowForm={setshowThumbnailChangeForm}
            
            videoId={videoIdforAdd}
            setVideoId={setvideoIDforAdd}
            
          />
        )}
      </div>
    </div>
  );
}

export default Mycontent;
