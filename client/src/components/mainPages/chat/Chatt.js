import "./chatt.css";
import { useState, useContext, useEffect, useRef } from "react";
import { GlobalState } from "../../../globalState";
import { userChat } from "../../../api/ChatReq";
import Conversations from "../utils/conversations/Conversations";
import ChatBox from "../utils/chatBox/ChatBox";
import {io} from "socket.io-client"

const Chatt = () => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
//   console.log(user);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const socket = useRef()

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("sendMessage", sendMessage);
      // setSendMessage(null);
    }
  }, [sendMessage])

  
  useEffect(() => {
    socket.current = io("/");
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
        setOnlineUsers(users);
        // console.log(users)
        // console.log(onlineUsers)
    })
  }, [user])

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChat(user._id);
        setChats(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user]);
  
  useEffect(() => {
    socket.current.on("receiveMessage", (data) => {
      setReceiveMessage(data);
    })
  }, [])
  
  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div onClick={()=> setCurrentChat(chat)}>
                <Conversations data={chat} currentUser={user._id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <ChatBox chat={currentChat} currentUser={user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage}/>
      </div>
    </div>
  );
};
export default Chatt;
