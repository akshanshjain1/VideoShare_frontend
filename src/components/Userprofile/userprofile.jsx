import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./userprofile.css";
import {
  timeSincePublished,
  formatViewCount,
  formatDuration,
} from "../../utils/function";
import { AiFillLike } from "react-icons/ai";

function Userprofile() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [issubslocal, setSubslocal] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [videos, setVideos] = useState([]);
  const [tab, settab] = useState("video");
  const [playlists, setplaylist] = useState([]);
  const [tweets, settweet] = useState([]);
  const [render,setrender]=useState(false)
  const getVideos = async () => {
    try {
      if (user?._id) {
        const response = await axios.get(`/api/v1/videos?userId=${user._id}`);
        
        setVideos(response.data.data);
      } else {
        toast.error("User data is not loaded yet");
      }
    } catch (error) {
      toast.error("Cannot get videos");
    }
  };

  const getUser = async () => {
    try {
      const res = await axios.get(`/api/v1/users/c/${username}`);

    
      setUser(res.data.data);
      setSubslocal(res.data.data.issubscribed);
      setSubscribers(res.data.data.subscriberscount);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to load user data");
        console.error("Error response:", error.response.data);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    }
  };
  const getPlaylist = async () => {
    try {
      const response = await axios.get(`/api/v1/playlist/user/${user._id}`);
      setplaylist(response.data.data);
    } catch (error) {
      toast.error("Cannot Show Playlist");
    }
  };
  const getTweets = async () => {
    try {
      const response = await axios.get(`/api/v1/tweets/user/${user._id}`);
      settweet(response.data.data);
    } catch (error) {
      toast.error("Cannot Show Community");
    }
  };
  const handletweetlike=async({tweetID})=>{
      try {
          const response=await axios.post(`/api/v1/likes/toggle/t/${tweetID}`)
          toast.success(response.data.message)
      } catch (error) {
        toast.error('Cannot Like Post')
      }
  }
  useEffect(() => {
    getUser();
  }, [username]);

  useEffect(() => {
    if (user?._id) {
      getVideos();
      getPlaylist();
      getTweets();
    }
  }, [user]);

  const toggleSubscription = async () => {
    try {
      const response = await axios.post(`/api/v1/subscriptions/c/${user?._id}`);
      toast.success(response.data.message);
      setSubslocal(!issubslocal);
      setSubscribers((prev) => (issubslocal ? prev - 1 : prev + 1));
    } catch (error) {
      toast.error(
        error.response?.data.message || "Could not toggle subscription"
      );
      console.error("Error response:", error.response?.data);
    }
  };

  return (
    <div className="profile-page">
      {/* Cover Image */}
      <div
        className="cover-image"
        style={{
          backgroundImage: `url(${user?.coverimage})`,
        }}
      ></div>

      {/* Profile Details */}
      <div className="profile-details">
        <img src={user?.avatar} alt="Profile" className="profile-photo" />
        <div className="info">
          <h1>{user.username}</h1>
          <p>{user.fullname}</p>
          <p>{user.email}</p>
          <p>
            <strong>{subscribers}</strong> Subscribers |{" "}
            <strong>{user.channelsubscribedtocount}</strong> Subscribed To
          </p>
        </div>

        {/* Subscribe Button */}
        <button
          className={`subscribe-button ${
            issubslocal ? "subscribed" : "not-subscribed"
          }`}
          onClick={toggleSubscription}
        >
          {issubslocal ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Videos Section */}
      <div className="videos-section" id="userprofile">
        <h3>
          <button
            onClick={() => {
              settab("video");
            }}
            style={{
              border: "none",
              background: "none",
              position: "relative",
              outline: "none",

              borderBottom: tab === "video" ? "3px solid blue" : "none", // Show border when active
            }}
          >
            Videos
          </button>
          <button
            onClick={() => {
              settab("playlist");
            }}
            style={{
              border: "none",
              background: "none",
              position: "relative",
              outline: "none",

              borderBottom: tab === "playlist" ? "3px solid blue" : "none", // Show border when active
            }}
          >
            Playlist
          </button>
          <button
            onClick={() => {
              settab("community");
            }}
            style={{
              border: "none",
              background: "none",
              position: "relative",
              outline: "none",

              borderBottom: tab === "community" ? "3px solid blue" : "none", // Show border when active
            }}
          >
            Community
          </button>
          <button
            onClick={() => {
              settab("about");
            }}
            style={{
              border: "none",
              background: "none",
              position: "relative",
              outline: "none",

              borderBottom: tab === "about" ? "3px solid blue" : "none", // Show border when active
            }}
          >
            About
          </button>
        </h3>
        {tab === "video" && (
          <div className="videos-grid">
            {Array.isArray(videos) && videos.length > 0 ? (
              videos.map((video) => (
                <div className="video-card" key={video._id}>
                  <Link to={`/video/${video._id}`}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                        position: "relative",
                      }}
                    >
                      <img src={video.thumbnail} alt={video.title} />
                      <span
                        style={{
                          position: "absolute",
                          bottom: "0.5rem",
                          right: "0.5rem",
                          backgroundColor: "black",
                          fontSize: "smaller",
                          color: "whitesmoke",
                          fontWeight: "lighter",
                          borderRadius: "0.25rem",
                          padding: "0.2rem 0.5rem",
                        }}
                      >
                        {formatDuration(parseInt(video.duration))}
                      </span>
                    </div>
                  </Link>
                  <Link to={`/video/${video._id}`}>
                    <p>{video.title}</p>{" "}
                  </Link>
                  <p>
                    {formatViewCount(video.views)} Views •{" "}
                    {timeSincePublished(video.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {`No Video Uploaded`}
              </div>
            )}
          </div>
        )}
        {tab === "playlist" && (
          <div className="videos-grid">
            {Array.isArray(playlists) && playlists.length > 0 ? (
              playlists.map((playlist, index) => (
                <div className="video-card" key={index}>
                  <Link to={`/playlist/${playlist._id}`}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                        position: "relative",
                      }}
                    >
                      <img src={playlist.thumbnail} alt={playlist.name} />
                      <span
                        style={{
                          position: "absolute",
                          bottom: "0.5rem",
                          right: "0.5rem",
                          backgroundColor: "black",
                          fontSize: "smaller",
                          color: "whitesmoke",
                          fontWeight: "lighter",
                          borderRadius: "0.25rem",
                          padding: "0.2rem 0.5rem",
                        }}
                      >
                        {playlist.size} Videos
                      </span>
                    </div>
                  </Link>
                  <Link to={`/playlist/${playlist._id}`}>
                    <p>{playlist.name}</p>
                  </Link>
                </div>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {`No Playlist Uploaded`}
              </div>
            )}
          </div>
        )}
        {tab === "community" && (
          <div style={{display:'flex',flexDirection:'column'}}>
            {Array.isArray(tweets) && tweets.length > 0 ? (
              tweets.map((tweet, index) => (
                <div className="comment-item" key={index}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0",
                    }}
                  >
                    {" "}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.3rem",
                      }}
                    >
                      {" "}
                      <img
                        style={{
                          width: "2.3rem",
                          height: "2.3rem",
                          borderRadius: "50%",
                        }}
                        src={user.avatar}
                        alt={user.username}
                      />
                      <Link
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        to={`/user/${user.username}`}
                      >
                        <div className="owner__name">
                          {user.fullname}
                        </div>
                      </Link>
                    </div>
                    <p>{tweet?.content}</p>
                  </div>

                  <button
                    className={`like-button ${tweet.islikedbyuser ? "liked" : ""}`}
                    onClick={() => {
                      handletweetlike({ tweetID: tweet._id });
                      const islikedprev =tweet.islikedbyuser;
                      if (islikedprev) tweet.likes -= 1;
                      else tweet.likes += 1;
                     tweet.islikedbyuser = !tweet.islikedbyuser;
                      setrender((prev) => !prev);
                    }}
                  >
                    <span className="like-icon">
                      <AiFillLike
                        borderRadius="3px"
                        color={tweet.islikedbyuser ? `red` : `grey`}
                      />
                    </span>
                    <span className="like-count">{tweet.likes}</span>
                  </button>
                </div>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {`No Posts`}
              </div>
            )}
          </div>
        )}
        {tab === "about" && (
          <div style={{display:'flex',flexDirection:'column'}}>
            { user?.about?<div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {`${user?.about}`}
              </div>: (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {`No About`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Userprofile;
