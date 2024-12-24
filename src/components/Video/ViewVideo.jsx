import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import "./viewvideo.css";
import VideoPlayer from "./Videoplayer";
import HerosectionSidebar from "../HeroSection/herosectionsidebar";
import Navbar from "../Navbar/Navbar";
import { AiFillHeart, AiFillLike, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { formatDuration, formatNumber, timeSincePublished } from "../../utils/function";
function Video() {
  const { videoId } = useParams();
  const [video, setVideo] = useState({});
  const [like, setLike] = useState(0);
  const [isliked, setisliked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showDescription, setshowDescription] = useState(false);
  const [user, setUser] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [allVideos, setAllVideos] = useState([]);
  const [views, setviews] = useState(0);
  const [addcomment, setaddcomment] = useState("");
  const [render, setrender] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 950);
  const isauthenticated = useSelector((state) => state.authentication.value);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 950);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  
  const updateView = async () => {
    await axios.get(`/api/v1/videos/updateviews/${videoId}`);
  };

  const getVideo = async () => {
    const res = await axios.get(`/api/v1/videos/${videoId}`);
    setVideo(res.data.data);
    setviews(res.data.data.views);
  };

  const getLike = async () => {
    const res = await axios.get(`/api/v1/likes/getvideolike/${videoId}`);
    setLike(res.data.data);
  };

  const getComments = async () => {
    const res = await axios.get(`/api/v1/comments/${videoId}`);
    setComments(res.data.data);
  };

  const getAllVideos = async () => {
    const res = await axios.get("/api/v1/videos");
    setAllVideos(res.data.data);
  };

  const getUser = async () => {
    try {
      const res = await axios.get(`/api/v1/users/c/byuserid/${video.owner}`);
      setUser(res.data.data);
      setIsSubscribed(res.data.data.issubscribed);
      setSubscribers(res.data.data.subscriberscount);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
    }
  };
  const handleaddcomment = async () => {
    try {
      await axios.post(`/api/v1/comments/${videoId}`, { content: addcomment });
      toast.success("Comment Added Successfully");
    } catch (error) {
      toast.error("Comment not Added");
    }
  };
  const handleliketoggle = async () => {
    try {
      await axios.post(`/api/v1/likes/toggle/v/${videoId}`);
    } catch (error) {
      toast.error("Liking fail");
    }
  };
  const handlecommentlike = async ({ commentID }) => {
    try {
      await axios.post(`/api/v1/likes/toggle/c/${commentID}`);
    } catch (error) {
      toast.error("Liking fail");
    }
  };
  const handlesubscribe = async () => {
    try {
      const response = await axios.post(`/api/v1/subscriptions/c/${user?._id}`);
      toast.success(response.data.message);
      setIsSubscribed(!isSubscribed);
      setSubscribers((prev) => (isSubscribed ? prev - 1 : prev + 1));
    } catch (error) {
      toast.error(
        error.response?.data.message || "Could not toggle subscription"
      );
      console.error("Error response:", error.response?.data);
    }
  };
  const updatewatchhistory = async () => {
    try {
      await axios.post(
        `/api/v1/users/current-user/update-watch-history/${videoId}`
      );
    } catch (error) {
      toast.error("Cannot Update Watch History");
    }
  };
  const isvideoliked = async () => {
    try {
      const res = await axios.get(`/api/v1/likes/isvideoliked/${videoId}`);
      setisliked(res.data.data);
    } catch (error) {
      toast.error("Cannot Update Watch History");
    }
  };
  useEffect(() => {
    updateView();
    getVideo();
    getLike();
    getComments();
    getAllVideos();
    if (isauthenticated) {
      updatewatchhistory();
      isvideoliked();
    }
  }, [isauthenticated]);

  useEffect(() => {
    if (video?.owner) getUser();
  }, [video]);

  return (
    <div style={{ overflowX: "-moz-hidden-unscrollable", flexShrink: 1 }}>
      <div style={{ marginTop: "5.5rem" }}>
        <Navbar />
      </div>
      <div id="Videolayout">
        {/* Left Section */}
        <div style={{ paddingLeft: "0.5rem" }}>
          <HerosectionSidebar />
        </div>
        <div className="left-section">
          <div className="video-section">
            {/* <video width={`640px`} height={`360px`} autoPlay muted loop controls src={video?.videofile}></video> */}
            <div className="video-player">
            <VideoPlayer src={video?.videofile} />
            </div>
            <h1 className="video-title">{video?.title}</h1>
          </div>
          <div
            style={{
              marginTop: `0.5rem`,
              marginBottom: `0.3rem`,
              fontWeight: "bold",
            }}
          >
            Views: {views}
          </div>
          <div className="owner-details">
            <img
              className="owner-avatar"
              src={user?.avatar}
              alt={user?.username}
            />
            <div className="owner-info">
              <Link to={`/user/${user?.username}`}>
                <h2 className="owner-name">{user?.username}</h2>
              </Link>
              <p className="owner-subscribers">{subscribers} Subscribers</p>
            </div>
            <button
              className={`subscribe-button ${
                isSubscribed ? "subscribed" : "not-subscribed"
              }`}
              onClick={() => {
                if (isauthenticated) handlesubscribe();
                else {
                  navigate(`/login?returnurl=/video/${videoId}`);
                }
              }}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
          <div className="video-actions">
            <div style={{ gap: "1rem" }} className="like-section">
              <button
                className={`like-button ${isliked ? "liked" : ""}`}
                onClick={() => {
                  if (isauthenticated) {
                    handleliketoggle();
                    const islikedlocal = isliked;
                    setisliked(!islikedlocal);
                    if (!islikedlocal) setLike((prev) => prev + 1);
                    else setLike((prev) => prev - 1);
                  } else {
                    alert("Login to like");
                  }
                }}
              >
                <span className="like-icon">
                  <AiFillLike
                    
                    color={isliked ? `red` : `grey`}
                  />
                </span>
                <span className="like-count">{like}</span>
              </button>
            </div>
            <div className="description-section">
              <button
                className="toggle-description"
                onClick={() => setshowDescription((prev) => !prev)}
              >
                {showDescription ? "Hide Description" : "Show Description"}
              </button>
            </div>
          </div>
          <div width={`100%`}>
            {showDescription && (
              <p className="video-description">{video?.description}</p>
            )}
          </div>
          <div className="comments-section">
            <h3 className="comments-title">Comments</h3>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <textarea
                className="add-comment"
                placeholder="Add a comment..."
                onChange={(e) => setaddcomment(e.target.value)}
                value={addcomment}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.stopPropagation();
                    handleaddcomment();
                  }
                }}
              ></textarea>
              <button
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "end",
                  height: "30%",
                }}
                onClick={() => {
                  if (isauthenticated) handleaddcomment();
                  else {
                    navigate(`/login?returnurl=/video/${videoId}`);
                  }
                }}
              >
                Post
              </button>
            </div>
            {comments.map((comment, index) => (
              <div className="comment-item" key={index}>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "0" }}
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
                      src={comment?.owner_avatar}
                      alt={comment?.owner_username}
                    />
                    <Link
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      to={
                        isauthenticated
                          ? `/user/${comment?.owner_username}`
                          : `/login?returnurl=/video/${videoId}`
                      }
                    >
                      <div className="owner__name">
                        @{comment?.owner_username}
                      </div>
                    </Link>
                  </div>
                  <p>{comment?.content}</p>
                </div>

                <button
                  className={`like-button ${isliked ? "liked" : ""}`}
                  onClick={() => {
                    if (isauthenticated) {
                      handlecommentlike({ commentID: comment._id });
                      const islikedprev = comment.islikedbyuser;
                      if (islikedprev) comment.likes -= 1;
                      else comment.likes += 1;
                      comment.islikedbyuser = !comment.islikedbyuser;
                      setrender((prev) => !prev);
                    } else {
                      alert("Login to like");
                    }
                  }}
                >
                  <span className="like-icon">
                    <AiFillLike
                      
                      color={comment.islikedbyuser ? `red` : `grey`}
                    />
                  </span>
                  <span className="like-count">{comment.likes}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {isWideScreen &&
            allVideos.map((vid, index) => (
              <div className="video-item" key={index}>
                <a
                  href={`/video/${vid._id}`}
                  style={{ display: "flex", direction: "row" }}
                >
                  <img
                    className="video-thumbnail"
                    src={vid.thumbnail}
                    alt={vid.title}
                  ></img>

                  <div className="video-details">
                    <h4 className="video-title-small">{vid.title}</h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <img
                        style={{
                          width: "1.8rem",
                          height: "1.8rem",
                          borderRadius: "50%",
                        }}
                        src={vid.owneravatar}
                        alt={vid.username}
                      />

                      <p className="video-owner-small">{vid.ownername}</p>
                    </div>
                    <p className="video-time-small ">
                      {formatNumber(vid.views)} Views •{" "}
                      {timeSincePublished(vid.createdAt)}
                    </p>
                    <p className="video-time-small ">
                      Duration:{formatDuration(parseInt(vid.duration))}
                    </p>
                  </div>
                </a>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Video;
