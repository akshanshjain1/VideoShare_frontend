import { useState } from "react";
import { useForm } from "react-hook-form";
import AutoGenerate from "./autogenerate";
import toast from "react-hot-toast";
import axios from "axios";

function UpdateVideo({setShowForm, videoId,setVideoId}){
    const [posting,setisposting]=useState(false)

    const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: { errors },
    } = useForm();
  
    const autoGenerate = watch("autoGenerate");
    const onSubmit = async (data) => {
      setisposting(true)
      const formdata=new FormData();
      formdata.append('title',data.title)
      formdata.append('description',data.description)
     
      formdata.append('thumbnail',data.thumbnail[0])
      console.log('form data is',formdata,'upto here')
      try {
        await axios.patch(`/api/v1/videos/${videoId}`,formdata)
        toast.success('Video Updated Successfully')
        
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message||'Video Updating failed' );
          console.error("Error response:", error.response.data);
      } else {
          toast.error("An unexpected error occurred.");
          console.error("Error:", error.message);
      } 
      }
      finally{
        setisposting(false)
        
        reset();
      }

      
      
      };
    return (
        <div className="form-overlay">
        <div className="add-video-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-left">
              <label>Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="error">{errors.title.message}</p>}

              <label>Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
              ></textarea>
              {errors.description && (
                <p className="error">{errors.description.message}</p>
              )}
                <label>Thumbnail</label>
              <input
                type="file"
                {...register("thumbnail", {
                  required: "Please upload a thumbnail",
                })}
              />
              {errors.thumbnail && (
                <p className="error">{errors.thumbnail.message}</p>
              )}

                
              

              <button type="submit">{posting?('Updating Video'):('Update Video')}</button>
            </div>
          </form>

          {/* Add AutoGenerate Component Here */}
          <AutoGenerate /> 

          <button
            className="close-form"
            onClick={() => {
              setShowForm(false);
              setVideoId('')
              reset();
            }}
          >
            Close
          </button>
        </div>
      </div>
    )
    
}
export default UpdateVideo