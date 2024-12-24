import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AutoGenerate from "./autogenerate";
import toast from "react-hot-toast";
import axios from "axios";
import {sendNotification, socket} from '../../utils/socket.js'
function UploadVideo({setShowForm ,setVideos}){
    const [posting,setisposting]=useState(false)
    const [isvideouploaded,setisvideouploaded]=useState(false)
    const [videodetails,setvideodetails]=useState(null)
    const [canclose,setcanclose]=useState(true)
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
      setcanclose(false)
      const formdata=new FormData();
      formdata.append('title',data.title)
      formdata.append('description',data.description)
      formdata.append('videofile',data.videofile[0])
      formdata.append('thumbnail',data.thumbnail[0])
      
      try {
       const response= await axios.post('/api/v1/videos/',formdata)
       setVideos((prev)=>[response.data.data,...prev])
       setvideodetails(response.data.data)
       setisvideouploaded(true);
      toast.success('Video Uploaded Successfully')
        
      } catch (error) {
        setcanclose(true)
        if (error.response) {
          toast.error(error.response.data.message||'Video Uploading failed' );
          console.error("Error response:", error.response.data);
      } else {
          toast.error("An unexpected error occurred.");
          console.error("Error:", error.message);
      } 
      }
      finally{
        setisposting(false)
        
      }

      
      
      };
      const callsendnotification=async()=>{
        
        try {
          socket.connect()
         const response= await sendNotification(videodetails)
          toast.success(response)
          
        } catch (error) {
          
          toast.error('Notification not Send')
        }
        finally{
          setcanclose(true)
          setShowForm(false)
          reset()
        }
      }
      useEffect(()=>{
       if(isvideouploaded && videodetails)
            callsendnotification()
      },[isvideouploaded])
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
              <label>Video File</label>
              <input
                type="file"
                {...register("videofile", {
                  required: "Please upload a video file",
                })}
              />
              {errors.videofile && (
                <p className="error">{errors.videofile.message}</p>
              )}

              <button type="submit">{posting?('Posting Video'):('Post Video')}</button>
            </div>
          </form>

          {/* Add AutoGenerate Component Here */}
          <AutoGenerate /> 

          <button disabled={!canclose}
            className="close-form"
            onClick={() => {
              setShowForm(false);
              reset();
            }}
          >
            Close
          </button>
        </div>
      </div>
    )
    
}
export default UploadVideo