import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { socket } from "../../utils/socket";
import { setUser } from "../../utils/socket";
// Extend dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

function Notification() {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [userId, setUserId] = useState(Cookies.get("userid") || "");
  const [user, setUserDetails] = useState({});
  const notificationIds = new Set();
  const [isNotificationAvailable, setIsNotificationAvailable] = useState(false);
  let notificationSound;

  // Dynamically load and play the notification sound
  const playNotificationSound = async () => {
    if (!notificationSound) {
      const { Howl } = await import("howler");
      notificationSound = new Howl({ src: ['./notification-sound.mp3'] });
    }
    notificationSound.play();
  };

  // Fetch user details
  const getUser = async () => {
    try {
      const response = await fetch("/api/v1/users/current-user");
      const data = await response.json();
      setUserDetails(data.data);
    } catch (error) {
      const showToast = async (message) => {
        const toast = (await import("react-hot-toast")).default;
        toast.error(message);
      };
      showToast("Cannot fetch current user");
    }
  };

  // Fetch unread notifications
  const getUnreadNotifications = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/v1/notifications/unread/${userId}`);
      const data = await response.json();
      const newNotifications = data.data.filter(
        (notif) => !notificationIds.has(notif._id)
      );
      newNotifications.forEach((notif) => notificationIds.add(notif._id));
      setUnreadNotifications((prev) => [...newNotifications, ...prev]);
    } catch (error) {
      console.error("Cannot get unseen notifications");
    }
  };

  // Fetch read notifications
  const getReadNotifications = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/v1/notifications/read/${userId}`);
      const data = await response.json();
      setReadNotifications(data.data);
    } catch (error) {
      console.error("Cannot get seen notifications");
    }
  };

  // Group notifications by relative date
  const groupNotificationsByDate = (notifications) => {
    return notifications.reduce((grouped, notification) => {
      const date = dayjs(notification.createdAt)
        .tz("Asia/Kolkata")
        .startOf("day")
        .fromNow(); // e.g., "Today", "Yesterday"
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(notification);
      return grouped;
    }, {});
  };

  // Initialize data on component mount
  useEffect(() => {
    if (userId) {
      getUser();
      getReadNotifications();
      getUnreadNotifications();
    }
  }, [userId]);

  // Handle real-time notifications
  useEffect(() => {
    if (userId) {
      socket.connect();
      setUser(userId);
      socket.on("newNotification", (notification) => {
        if (!notificationIds.has(notification._id)) {
          notificationIds.add(notification._id);
          setUnreadNotifications((prev) => [notification, ...prev]);
          socket.emit("notificationreaded", notification._id);
        }
      });
      socket.on("NotificationAvail", () => {
        setIsNotificationAvailable((prev) => !prev);
        playNotificationSound();
      });

      return () => {
        socket.off("newNotification");
      };
    }
  }, [userId]);

  const groupedUnread = groupNotificationsByDate(unreadNotifications);
  const groupedRead = groupNotificationsByDate(readNotifications);

  return (
    <div style={{ display: "flex", flexDirection: "row", overflowY: "scroll", width: "100%", height: "100%" }}>
      {/* User Info Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "dodgerblue",
          color: "black",
          width: "33%",
          marginRight: "0.4rem",
          borderRadius: "2.5rem",
          justifyContent: "start",
          alignItems: "center",
          margin: "0.2rem",
        }}
      >
        <div
          style={{
            width: "99%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "2rem",
            overflow: "hidden",
          }}
        >
          <img
            src={`${user?.avatar}`}
            alt="User Avatar"
            style={{ width: "80%", paddingTop: "2rem" }}
          />
        </div>
        <div>
          <h2>{user?.fullname}</h2>
          <p>@{user?.username}</p>
        </div>
      </div>

      {/* Notifications Section */}
      <div
        style={{
          paddingLeft: "1.5rem",
          display: "flex",
          flexDirection: "column",
          overflowY: "scroll",
          width: "66%",
          borderLeft: "1px solid #333",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Notifications</h2>

        {/* Unread Notifications */}
        <div style={{ borderTop: "1px solid #333" }}>
          <h3>Unseen Notifications</h3>
          {Object.keys(groupedUnread).map((date, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h4 style={{ color: "#FF6347" }}>{date}</h4>
              {groupedUnread[date].map((notif) => (
                <div
                  key={notif._id}
                  style={{
                    backgroundColor: "#FFE4E1",
                    padding: "10px",
                    margin: "5px 0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(notif.content),
                    }}
                  ></p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Read Notifications */}
        <div>
          <h3>Seen Notifications</h3>
          {Object.keys(groupedRead).map((date, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h4 style={{ color: "#4682B4" }}>{date}</h4>
              {groupedRead[date].map((notif) => (
                <div
                  key={notif._id}
                  style={{
                    backgroundColor: "#F0F8FF",
                    padding: "10px",
                    margin: "5px 0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(notif.content),
                    }}
                  ></p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notification;
