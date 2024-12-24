import { useState } from "react";
import { useForm } from "react-hook-form";
import AutoGenerate from "./autogenerate";
import toast from "react-hot-toast";
import axios from "axios";

function Addplaylist({ setShowForm,method,playlistid ,setmethod}) {
  const [making, setismaking] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const autoGenerate = watch("autoGenerate");
  const onSubmit = async (data) => {
    setismaking(true);
    if(method==='add'){
    try {
      
      await axios.post("/api/v1/playlist", {
        name: data.name,
        description: data.description,
      });
      toast.success("Playlist Created Successfully");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Playlist Creation failed");
        console.error("Error response:", error.response.data);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    } finally {
      setismaking(false);
      setShowForm(false);
      reset();
    }}
    else if(method==='update'){
      try {
      
        await axios.patch(`/api/v1/playlist/${playlistid}`, {
          name: data.name,
          description: data.description,
        });
        toast.success("Playlist Updated Successfully");
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || "Playlist Updation failed");
          console.error("Error response:", error.response.data);
        } else {
          toast.error("An unexpected error occurred.");
          console.error("Error:", error.message);
        }
      } finally {
        setismaking(false);
        setShowForm(false);
        reset();
        
      }
    }
  };
  return (
    <div className="form-overlay">
      <div className="add-video-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-left">
            <label>Playlist Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}

            <label>Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
            {errors.description && (
              <p className="error">{errors.description.message}</p>
            )}
            <button type="submit">
              {making ?  method==='update'?"Updating Playlist":"Creating Playlist" : method==='update'?"Update Playlist":"Create Playlist"}
            </button>
          </div>
        </form>

        <AutoGenerate />

        <button
          className="close-form"
          onClick={() => {
            setShowForm(false);
            setmethod('')
            reset();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
export default Addplaylist;
