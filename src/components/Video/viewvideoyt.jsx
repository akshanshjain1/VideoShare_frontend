import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { FaFileCode } from "react-icons/fa";
import "./viewvideo.css";
import Navbar from "../Navbar/Navbar";
import HerosectionSidebar from "../HeroSection/herosectionsidebar";

function Videoyoutube() {
  const { videoId } = useParams();
  const [video, setVideo] = useState({});
  const [like, setLike] = useState(0);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [allVideos, setAllVideos] = useState([]);
  const [views, setViews] = useState(0);
  const [addcomment, setAddComment] = useState("");
  
  // Format numbers to YouTube style (1.7k, 2.3M, etc.)
  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return num;
    }
  };

  const getVideodetail = async () => {
    const options = {
      method: "GET",
      url: "https://yt-api.p.rapidapi.com/video/info",
      params: {
        id: `${videoId}`,
        extend: "1",
      },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_VIDEO_DETAIL_FETCHIING_API,
        "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      
      if(response.data)
        setVideo(response.data);
      
      
    } catch (error) {
      console.error(error);
    }
  };

  const getComments = async () => {
    const options = {
      method: "GET",
      url: "https://yt-api.p.rapidapi.com/comments",
      params: { id: `${videoId}` },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_VIDEO_DETAIL_FETCHIING_API,
        "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setComments(response.data.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  

  

  

  useEffect(() => {
    getVideodetail();
    getComments();
    
  }, [videoId]);

  

  return (
    <div>
      <div style={{ marginTop: "65px" }}>
        <Navbar />
      </div>
      <div id="Videolayout">
        {/* Left Section */}
        <div style={{ paddingLeft: "0.5rem" }}>
          <HerosectionSidebar />
        </div>
        <div className="left-section">
          <div className="video-section">
            <iframe
              width={`640px`}
              height={`360px`}
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              
              borderRadius="25px"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <h1 className="video-title">{  video?.title}</h1>
          </div>

          <div className="owner-details">
            <img
              className="owner-avatar"
              src={video?.channelThumbnail && Array.isArray(video?.channelThumbnail) && video?.channelThumbnail[0]?.url}
              
            />
            <div className="owner-info">
              <h2 className="owner-name">{video?.channelTitle}</h2>
              <p className="owner-subscribers">
                {formatNumber(video?.subscriberCountText)}
              </p>
            </div>
            <button
              className={`subscribe-button ${
                isSubscribed ? "subscribed" : "not-subscribed"
              }`}
              
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          <div className="video-actions">
            <div className="like-section">
              <Button
                variant="contained"
                color="primary"
                startIcon={<ThumbUpIcon />}
              >
                {formatNumber(video?.likeCount)}
              </Button>
              <div>Views: {formatNumber(video?.viewCount)}</div>
            </div>

            <div className="description-section">
              <button
                className="toggle-description"
                onClick={() =>
                  setVideo({
                    ...video,
                    showDescription: !video.showDescription,
                  })
                }
              >
                {video?.showDescription
                  ? "Hide Description"
                  : "Show Description"}
              </button>
            </div>
          </div>

          {video?.showDescription && (
            <p className="video-description">
              {video?.description === ""
                ? "No Description Added"
                : video?.description}
            </p>
          )}

          <div className="comments-section">
            <h3 className="comments-title">Comments</h3>
            <textarea
              className="add-comment"
              placeholder="Add a comment..."
              onChange={(e) => setAddComment(e.target.value)}
              value={addcomment}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.stopPropagation();
                 
                }
              }}
            ></textarea>
            <button >Post</button>

            {comments && Array.isArray(comments) && comments.length>0 && comments.map((comment, index) => (
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
                      src={comment?.authorThumbnail[0].url}
                      alt={comment?.authorText}
                    />
                    <Link
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      to={`/user/${comment?.authorText}`}
                    >
                      <div className="owner__name">{comment?.authorText}</div>
                    </Link>
                  </div>
                  <p>{comment?.textDisplay}</p>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ThumbUpIcon />}
                >
                  {formatNumber(comment?.likesCount)}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {video?.relatedVideos?.data && Array.isArray(video?.relatedVideos?.data) && video?.relatedVideos?.data.length>0 && video?.relatedVideos?.data.map((vid, index) => (
            <div className="video-item" key={index}>
              <Link
                style={{ display: "flex", direction: "row" }}
                to={`/youtubevideo/${vid?.videoId}`}
              >
                <img
                  className="video-thumbnail"
                  src={vid?.thumbnail && vid?.thumbnail .length>0 && vid?.thumbnail[1]?.url}
                  alt={vid?.title}
                />
                <div className="video-details">
                  <h4 className="video-title-small">{vid?.title}</h4>
                  <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'0.3rem'}}>
                  <img src={vid?.channelThumbnail && vid?.channelThumbnail.length>0 && vid?.channelThumbnail[0]?.url } alt={vid?.channelTitle} style={{width:'1.7rem',height:'1.7rem',borderRadius:'50%'
                  
                  }}/>
                  <p className="video-owner-small">{vid?.channelTitle}</p></div>
                  <p className="video-time-small ">
                    {formatNumber(vid?.viewCount)} Views. {vid?.publishedTimeText}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Videoyoutube;
