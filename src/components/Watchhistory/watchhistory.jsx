import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import "./watchhistory.css";
import { Link } from "react-router-dom";

function WatchHistory() {
  const [user, setUser] = useState({});
  const [videos, setVideos] = useState([]);

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
      const response = await axios.get("/api/v1/users/watch-history");
      setVideos(response.data.data[0].videodetails);
      
    } catch (error) {
      toast.error("Cannot get videos");
    }
  };

  useEffect(() => {
    getUser();
    getVideos();
  }, []);

  return (
    <div id="watchhistory">
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
              <h2>Watch History</h2>
            </div>

            <div className="videos-list">
              {Array.isArray(videos) &&
                videos.map((video) => (
                  <div className="video-item" key={video._id}>
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
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchHistory;
