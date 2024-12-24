import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css'
function Profile(){
    const[user,setuser]=useState({})
   
    const getcurrentuser=async()=>{
        try {
            const response=await axios.get('/api/v1/users/current-user')
            setuser(response.data.data);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message||'could not get current user ' );
                console.error("Error response:", error.response.data);
            } else {
                toast.error("An unexpected error occurred.");
                console.error("Error:", error.message);
            }
            
        }

    }
     useEffect(()=>{getcurrentuser()},[])
    // getcurrentuser()
    
    return (
        <div className="profile-page">
        
        <div className="cover-image" style={{ backgroundImage: `url(${user?.coverimage})` }}>
        </div>
  
        {/* Profile Details */}
        <div className="profile-details">
          <img src={user.avatar} alt="Avatar" className="avatar" />
          <div className="user-info">
            <h2 className="full-name">{user.fullname}</h2>
            <p className="username">@{user.username}</p>
          </div>
        </div>
      </div>
    )
}
export default Profile;