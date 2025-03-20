import {
  MoreVertical,
  PhoneCall,
  VideoIcon,
  Send,
  Paperclip,
  Smile,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import profileImg from "@/assets/images/profile-img.png";
import { socket } from "@/services/socketHandler";
import { useDispatch, useSelector } from "react-redux";

const ChatScreen = () => {
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  // Sample data - in a real app, you would fetch this from your backend
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input change
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  // Send message function
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    // Create new message object
    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "self",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add to messages
    setMessages([...messages, message]);
    setNewMessage(""); // Clear input
  };

  // Handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="w-full bg-white border rounded-2xl h-[96vh] flex flex-col">
      {/**header  */}
      <div className="flex items-center justify-between border-b p-4 shadow-sm rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={profileImg}
              alt="Profile"
              className="rounded-full h-10 w-10 border bg-gray-200 object-cover shadow-sm"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          </div>
          <div>
            <p className="text-base font-medium text-gray-900">
              Hibbanur Rahman
            </p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <VideoIcon
            className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
            size={20}
          />
          <PhoneCall
            className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
            size={20}
          />
          <MoreVertical
            className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
            size={20}
          />
        </div>
      </div>

      {/** message list */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "self" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === "self"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-200 text-gray-800 rounded-tl-none"
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "self"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/**input box */}
      <div className="border-t p-3">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <Paperclip className="text-gray-500 cursor-pointer mr-2" size={20} />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Smile className="text-gray-500 cursor-pointer mx-2" size={20} />
          <button
            onClick={sendMessage}
            className={`rounded-full p-2 ${
              newMessage.trim()
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
