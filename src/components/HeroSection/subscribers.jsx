import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "./subscribers.css";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);

  const getSubscribers = async () => {
    try {
      const res = await axios.get("/api/v1/users/current-user");
      const userId = res.data.data._id;

      const resSubscribers = await axios.get(
        `/api/v1/subscriptions/c/${userId}`
      );
      setSubscribers(resSubscribers.data.data);
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Error fetching subscribers."
        );
        console.error("Error response:", error.response.data);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    }
  };

  useEffect(() => {
    getSubscribers();
  }, []);

  if (!subscribers.length) {
    return <p>Loading subscribers...</p>;
  }

  return (
    <div id="subscriber">
      <h2 className="tile-heading">Subscribers</h2>
      <div className="subscribers-grid">
        {subscribers.map((subscriber,index) => (
          <div className="subscriber-card" key={index}>
            <img
              src={subscriber.avatar || "https://via.placeholder.com/60"}
              alt={`${subscriber.username}'s avatar`}
              className="avatar"
            />
            <div className="user-details">
              <Link
                to={`/user/${subscriber.username}`}
                style={{ textDecoration: "none" }}
              >
                <h3>{subscriber.name}</h3>
                <p>@{subscriber.username}</p>
              </Link>
              <p>{subscriber.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscribers;
