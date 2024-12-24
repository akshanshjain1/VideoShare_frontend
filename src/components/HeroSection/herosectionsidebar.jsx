import "./HeroSection.css";
import {
  FaHome,
  FaHeart,
  FaHistory,
  FaUpload,
  FaList,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function HerosectionSidebar() {
  const navigate = useNavigate();
  const isauthenticated = useSelector((state) => state.authentication.value);
  return (
    <div id="mainpage">
    <div className="hero-section__sidebar">
      <button onClick={() => navigate("/")}>
        <FaHome />
      </button>
      <button
        onClick={() =>
          navigate(isauthenticated ? "/user/likedVideo" : `/login?returnurl=/user/likedVideo`)
        }
      >
        <FaHeart />
      </button>
      <button
        onClick={() =>
          navigate(isauthenticated ? "/user/watch-history" : `/login?returnurl=/user/watch-history`)
        }
      >
        <FaHistory />
      </button>
      <button
        onClick={() => navigate(isauthenticated ? "/user/mycontent" : `/login?returnurl=/user/mycontent`)}
      >
        <FaUpload />
      </button>
      <button
        onClick={() => navigate(isauthenticated ? "/user/playlist" : "/login?returnurl=/user/playlist")}
      >
        <FaList />
      </button>
      <button
        onClick={() =>
          navigate(isauthenticated ? "/user/subscribers" : `/login?returnurl=/user/subscribers`)
        }
      >
        <FaUserFriends />
      </button>
      <button
        onClick={() =>
          navigate(isauthenticated ? "/user/subscriptions" : `/login?returnurl=/user/subscriptions`)
        }
      >
        <FaUsers />
      </button>
    </div>
    </div>
  );
}
export default HerosectionSidebar;
