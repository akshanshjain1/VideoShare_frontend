import { useMemo } from 'react'
import {io} from 'socket.io-client'

const socket = io("https://videoshare-zq3u.onrender.com", {
    autoConnect: false, 
    transports: ["websocket"], 
  });
  
  
  socket.on("connect", () => {
    console.log('socket connected')
    
  });
  const setUser = (userId) => {
    socket.emit("setUser", userId);
  };
  const sendNotification=(videodetails)=>{
    return new Promise((resolve, reject) => {
      socket.emit("sendnotification", videodetails);
      socket.on("notificationStatus", ({ status, message }) => {
        if (status === "success") resolve(message);
        else reject(message);
      });
    });
  }
  
export  {socket,setUser,sendNotification}