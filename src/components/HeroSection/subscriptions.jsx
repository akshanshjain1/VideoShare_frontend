import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "./subscriptions.css";
const Subscriptions = () => {
  const [subscriptions, setsubscriptions] = useState([]);

  const getsubscriptions = async () => {
    try {
      const res = await axios.get("/api/v1/users/current-user");
      
      const userid = res.data.data._id;
      const resSubscriptions = await axios.get(
        `/api/v1/subscriptions/u/${userid}`
      );

      
      
      setsubscriptions(resSubscriptions.data.data);
      //console.log(subscribers)
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "could not get current user or subsribers "
        );
        console.error("Error response:", error.response.data);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    }
  };
  useEffect(() => {
    getsubscriptions();
  }, []);
  if (!subscriptions.length) {
    return <p>Loading subscriptions...</p>;
  }
  return (
    <div id="subscriptions">
      <h2 className="tile-heading">Subscriptions</h2>
      <div className="subscriptions-grid">
        {subscriptions.map((subscription,index) => (
          <div className="subscription-card" key={index}>
            <img
              src={subscription.avatar || "https://via.placeholder.com/60"}
              alt={`${subscription.username}'s avatar`}
              className="avatar"
            />
            <div className="user-details">
              <Link
                to={`/user/${subscription.username}`}
                style={{ textDecoration: "none" }}
              >
                <h3>{subscription.name}</h3>
                <p>@{subscription.username}</p>
              </Link>
              <p>{subscription.email}</p>
              <p>
                Channel Subscribers : {subscription.channelsubscribernumber}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Subscriptions;
