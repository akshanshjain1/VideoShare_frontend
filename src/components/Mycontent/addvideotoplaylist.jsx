import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import axios from "axios";
import "./addvideotoplaylist.css";
function AddVideoToPlaylist({ setShowForm, videoId, setVideoId }) {
  const [adding, setisadding] = useState(false);
  const [user, setuser] = useState({});
  const [playlists, setplaylist] = useState([]);
  const getUser = async () => {
    try {
      const res = await axios.get("/api/v1/users/current-user");
      
      setuser(res.data.data);
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
  const onSubmit = async (data) => {
    setisadding(true);
    try {
      await axios.patch(`/api/v1/playlist/add/${videoId}/${data.playlistId}`);
      toast.success("Added To Playlist Successfully");
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Not Able to Add to Playlist"
        );
        console.error("Error response:", error.response.data);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    } finally {
      setisadding(false);

      setVideoId("");
      reset();
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    if (user?._id) getPlaylist();
  }, [user]);
  return (
    <div id="AddMyContentVideoToPlaylist">
    <div className="form-overlay" style={{}}>
      <div className="add-video-form">
        {playlists.map((playlist, index) => (
          <div key={index}>
            <div>
              <span style={{ display: "flex", flexDirection: "row" }}>
                <input
                  type="checkbox"
                  name="Checkbox"
                  onChange={() => {
                    onSubmit({ playlistId: playlist._id });
                  }}
                />
                <p>{playlist.name}</p>
              </span>
            </div>
          </div>
        ))}

        <button
          style={{
            width: "fit-content",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            setShowForm(false);
            reset();
          }}
        >
          {adding ? "Adding Video" : "Close"}
        </button>
      </div>
    </div>
    </div>
  );
}
export default AddVideoToPlaylist;
