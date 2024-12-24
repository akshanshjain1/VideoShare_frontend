import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import "./playlist.css";

import { Link } from "react-router-dom";

import Addplaylist from "./addPlaylist";
import ChangeThumbnail from "./changethumbnailplaylist";

function Playlist() {
  const [user, setUser] = useState({});
  const [playlists, setplaylist] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showOptions, setShowOptions] = useState(null);
  const [method, setmethod] = useState(null);
  const [playlistIDforAddorUpdate, setplaylistIDforAddorUpdate] = useState("");
  const [showThumbnailChangeForm, setshowThumbnailChangeForm] = useState(false);
  const getUser = async () => {
    try {
      const res = await axios.get("/api/v1/users/current-user");

      setUser(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
    }
  };

  const getPlaylist = async () => {
    try {
      const response = await axios.get(`/api/v1/playlist/user/${user._id}`);
      setplaylist(response.data.data);
    } catch (error) {
      toast.error("Cannot get Playlist");
    }
  };
  const handledeleteplaylist = async (playlistID) => {
    try {
      await axios.delete(`/api/v1/playlist/${playlistID}`);
      setplaylist(playlists.filter((playlist) => playlist._id !== playlistID));
      toast.success("Playlist Deleted");
    } catch (error) {
      toast.error("Could NOT delete Playlist");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user?._id) {
      getPlaylist();
    }
  }, [user]);

  return (
    <div id="playlist">
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
              <h2>Playlists</h2>
              <button
                className="add-video-button"
                onClick={() => {
                  setShowForm(true);
                  setmethod("add");
                }}
              >
                Add Playlist
              </button>
            </div>

            <div className="videos-list">
              {playlists.map((playlist, index) => (
                <div className="video-item"  key={index}>
                  <img src={playlist.thumbnail} alt={playlist.title} />
                  <div
                    className="video-details"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      
                    }}
                  >
                    <div>
                      <Link to={`/user/playlist/${playlist._id}`}>
                        <p className="video-title">{playlist.name}</p>
                      </Link>
                      <p className="video-date">
                        Published on {playlist.createdAt.slice(0, 10)}
                      </p>
                      <p className="video-views">{playlist.size} Videos</p>
                    </div>
                    <div className="video-options">
                      <button
                        className="options-button"
                        onClick={() =>
                          setShowOptions((prev) =>
                            prev === playlist._id ? null : playlist._id
                          )
                        }
                      >
                        ⋮
                      </button>
                      {showOptions === playlist._id && (
                        <div className="options-menu">
                          <button
                            className="delete-option"
                            onClick={() => {
                              setmethod("update");
                              setshowThumbnailChangeForm(true);
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
                              Change Thumbnail
                            </div>
                          </button>
                          <button
                            className="delete-option"
                            onClick={() => {
                              setShowForm(true);
                              setmethod("update"),
                                setplaylistIDforAddorUpdate(
                                  (prev) => playlist._id
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
                              Edit Playlist
                            </div>
                          </button>
                          <button
                            className="delete-option"
                            onClick={() => handledeleteplaylist(playlist._id)}
                          >
                            <div
                              style={{
                                width: "fit-content",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              Delete Playlist
                            </div>
                          </button>
                          
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Video Form Overlay */}
        {showForm && (
          <Addplaylist
            setShowForm={setShowForm}
            method={method}
            playlistid={playlistIDforAddorUpdate}
            setmethod={setmethod}
          />
        )}
        {showThumbnailChangeForm && (
          <ChangeThumbnail
            setShowForm={setshowThumbnailChangeForm}
            method={method}
            playlistid={playlistIDforAddorUpdate}
            setmethod={setmethod}
          />
        )}
      </div>
    </div>
  );
}

export default Playlist;
