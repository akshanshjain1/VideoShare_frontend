import { useState } from "react";
import { useForm } from "react-hook-form";
import AutoGenerate from "./autogenerate";
import toast from "react-hot-toast";
import axios from "axios";

function ChangeThumbnail({ setShowForm,method,playlistid ,setmethod}) {
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
    const formdata=new FormData()
    formdata.append('thumbnail',data.thumbnail[0])
   
      try {
      
        await axios.patch(`/api/v1/playlist/addthumbnail/${playlistid}`, formdata);
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
  
  return (
    <div className="form-overlay">
      <div className="add-video-form" style={{justifyContent:'center' ,alignItems:'center',width:'fit-content',height:'max-content',overflow:'hidden',paddingRight:'1rem'}} >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-left" >
            <label>Select Thumbnail</label>
            
            <input type="file" accept="image/*" {...register('thumbnail')} 
            required
            style={{width:'90%'}} />
            <button type="submit">
              {making ?  method==='update'?"Updating Playlist":"Creating Playlist" : method==='update'?"Update Playlist":"Create Playlist"}
            </button>
          </div>
        </form>

        

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
export default ChangeThumbnail;
