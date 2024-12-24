import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./otheruserplaylistVideo.css";
import {
  formatDuration,
  formatViewCount,
  timeSincePublished,
} from "../../utils/function";
import AddVideoToPlaylist from "../Mycontent/addvideotoplaylist";

function OtherUserPlaylistVideo() {
  const { playlistID } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const [showForm,setShowForm]=useState(false);
  const [videoId,setVideoId]=useState('')
  const getPlaylist = async () => {
    try {
      const res = await axios.get(`/api/v1/playlist/video/${playlistID}`);
      setPlaylist(res.data.data[0]);
      setVideos(res.data.data[0].videodetails);
    } catch (error) {
      toast.error("Could not fetch videos");
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.patch(`/api/v1/playlist/remove/${videoId}/${playlistID}`);
      setVideos(videos.filter((video) => video._id !== videoId));
      toast.success("Video deleted from playlist");
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  useEffect(() => {
    getPlaylist();
  }, [playlistID]);

  return (
    <div id="PlaylistVideoOtherUser" className="playlist-video-container">
      {playlist ? (
        <>
          {/* Left Part: Playlist Info */}
          <div className="left-part">
            <div className="playlist-info">
              <img
                className="playlist-thumbnail"
                src={
                  videos.length > 0
                    ? videos[0].thumbnail
                    : playlist.owner_avatar
                }
                alt={playlist.name}
              />
              <h1 className="playlist-title">{playlist.name}</h1>
              <p className="playlist-owner">
                Created by <strong>{playlist.owner_fullname}</strong>
              </p>
              <p className="playlist-description">{playlist.description}</p>
            </div>
          </div>

          {/* Right Part: Video List */}
          <div className="video-part">
            <ul className="video-list">
              {videos.map((video, index) => (
                <li key={video.id} className="video-item">
                  {/* Video Thumbnail with Duration Overlay */}
                  <div className="video-thumbnail-container">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingRight: "1.5rem",
                      }}
                    >
                      <div style={{ paddingRight: "1rem" }}>{index + 1}</div>
                      <img
                        className="video-thumbnail"
                        src={video.thumbnail}
                        alt={video.title}
                      />
                    </div>
                    <span className="video-duration-overlay">
                      {formatDuration(parseInt(video.duration))}
                    </span>
                  </div>

                  {/* Video Details */}
                  <div className="video-details">
                    <Link to={`/video/${video._id}`}>
                    <h3 className="video-title">{video.title}</h3>
                    </Link>
                    <p className="video-meta">
                      
                      {formatViewCount(Number(video.views))} views •{" "}
                      {timeSincePublished(video.createdAt)}
                    </p>
                  </div>

                  {/* Options Menu */}
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
                          onClick={() =>{
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
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
      {showForm && (
          <AddVideoToPlaylist
            setShowForm={setShowForm}
            videoId={videoId}
            setVideoId={setVideoId}
          />
        )}
    </div>
  );
}

export default OtherUserPlaylistVideo;
