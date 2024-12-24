import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import DOMPurify from "dompurify";
import "./dashboard.css";
import { formatViewCount, timeSincePublished } from "../../utils/function";

function Dashboard() {
  const [userId, setUserId] = useState(Cookies.get("userid") || "");
  const [user, setUserDetails] = useState({});
  const [stats, setStats] = useState({});
  const [videos, setVideos] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [post,setpost]=useState('')
  const [about,setabout]=useState('')
  const getUser = async () => {
    try {
      const response = await axios.get("/api/v1/users/current-user");
      setUserDetails(response.data.data);
    } catch (error) {
      toast.error("Cannot fetch current user");
    }
  };

  const getStats = async () => {
    try {
      const response = await axios.get(`/api/v1/dashboard/stats`);
      setStats(response.data.data);
    } catch (error) {
      toast.error("Cannot fetch stats");
    }
  };

  const getVideos = async () => {
    try {
      const response = await axios.get(`/api/v1/videos?userId=${userId}`);
      setVideos(response.data.data);
    } catch (error) {
      toast.error("Cannot fetch videos");
    }
  };

  const getCommunityPosts = async () => {
    try {
      const response = await axios.get(`/api/v1/tweets/user/${userId}`);
      setCommunityPosts(response.data.data);
    } catch (error) {
      toast.error("Cannot fetch community posts");
    }
  };
const handleaddpost=async()=>{
  try {
   const response= await axios.post(`/api/v1/tweets`,{content:post})
   setCommunityPosts((prev)=>[response.data.data,...prev])
    toast.success('Post Added Successfully')
    setpost('')
  } catch (error) {
    toast.error('Cannot Add post')
  }
}
const handleaddabout=async()=>{
  try {
   const response= await axios.post(`/api/v1/users/addabout`,{about:about})
   
    toast.success('About Added Successfully')
    setabout('')
  } catch (error) {
    toast.error('Cannot Add About')
  }
}
  useEffect(() => {
    if (userId) {
      getUser();
      getStats();
      getVideos();
      getCommunityPosts();
    }
  }, [userId]);

  return (
    <div id="dashboard-wrapper">
      {/* Left Section */}
      <div className={"left-section"}>
        <div className={"left-section-content"}>
          <img
            src={`${user?.avatar}`}
            alt="User Avatar"
            className={"user-avatar"}
          />
        </div>
        <div>
          <h2>{user?.fullname}</h2>
          <p>@{user?.username}</p>
          <p>{user?.about?user?.about:''}</p>
        </div>
      </div>

     
      <div className={"right-section"}>
        
        <h2 style={{textAlign:'center'}}> DashBoard</h2>
        <div className={"stats-section"}>
          <div className={"stat-item"}>
            <h3>Total Likes</h3>
            <p>{stats?.totallikes}</p>
          </div>
          <div className={"stat-item"}>
            <h3>Total Views</h3>
            <p>{stats.totalviews}</p>
          </div>
          <div className={"stat-item"}>
            <h3>Total Videos</h3>
            <p>{stats.totalvideo}</p>
          </div>
          <div className={"stat-item"}>
            <h3>Total Subscribers</h3>
            <p>{stats.totalsubscribers}</p>
          </div>
        </div>

        
        <div className={"videos-section"}>
          <h3>Channel Videos</h3>
          <div className={"videos-container"}>
            {videos &&
              Array.isArray(videos) &&
              videos.length > 0 &&
              videos.map((video) => (
                <div className={"video-card"} key={video._id}>
                  <img src={video.thumbnail} alt={video.title} />
                  <a href={`/video/${video._id}`}>
                    <h4 style={{ fontSize: "1rem", margin: "0", padding: "0" }}>
                      {video.title}
                    </h4>
                  </a>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      margin: "0.1rem",
                      padding: "0",
                    }}
                  >
                    {formatViewCount(Number(video.views))} views•
                    {timeSincePublished(video.createdAt)}
                  </p>
                </div>
              ))}
          </div>
        </div>

       
        <div className={"community-section"}>
          <h3>Community</h3>
          <div className="add-post">
            <div className="post-input">
              <textarea
                name="Post"
                placeholder="Write Post..."
                style={{ width: "100%", height: "100%" }}
                value={post}
                onChange={(e)=>setpost(e.target.value)}
              ></textarea>
            </div>
            <div className={"edit-about"}>
              <button onClick={ handleaddpost}>
                Add Post
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent:'start',
              marginTop:'2rem'

            }}
          >
            {communityPosts &&
              Array.isArray(communityPosts) &&
              communityPosts.length > 0 &&
              communityPosts.map((post) => (
                <div className={"community-post"} key={post._id}>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.content),
                    }}
                  ></p>
                  <p>Likes:{` ${post.likes?post.likes:0}`}</p>
                </div>
              ))}
          </div>
        </div>

        <div className={"community-section"}>
          <h3>About</h3>
          <div className="add-post">
            <div className="post-input">
              <textarea
                name="Post"
                placeholder="Write About..."
                style={{ width: "100%", height: "100%" }}
                value={about}
                onChange={(e)=>setabout(e.target.value)}
              ></textarea>
            </div>
            <div className={"edit-about"}>
              <button onClick={ handleaddabout}>
                Add about
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent:'start',
              marginTop:'2rem'

            }}
          > <div className={"community-post"}>{user?.about?user?.about:''}</div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
