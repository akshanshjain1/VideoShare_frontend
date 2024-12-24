import { useMemo } from 'react'
import {io} from 'socket.io-client'

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    autoConnect: false, 
    transports: ["websocket"], 
  });
  
  
  socket.on("connect", () => {
    
    
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