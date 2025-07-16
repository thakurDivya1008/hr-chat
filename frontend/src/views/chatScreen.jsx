import {
  MoreVertical,
  PhoneCall,
  VideoIcon,
  Send,
  Paperclip,
  Smile,
  MessageCircle,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import profileImg from "@/assets/images/profile-img.png";
import groupImg from "@/assets/images/group-img.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/services/socket/socketContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


const ChatScreen = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const messages=useSelector((state)=>state.chat.activeChat?.messages);
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
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setNewMessage(""); // Clear input

    const payload={
      chatId:activeChat?._id,
      message:newMessage,
      sender:user?._id,
    }
    socket.sendMessage(payload)
  };

  // Handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {
        activeChat ? (
          <div className="w-full bg-white border rounded-2xl h-[96vh] flex flex-col">
            {/**header  */}
            <div className="flex items-center justify-between border-b p-4 shadow-sm rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeChat?.isGroupChat ? groupImg : profileImg}
                    alt="Profile"
                    className="rounded-full h-10 w-10 border bg-gray-200 object-cover shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">
                    {activeChat?.isGroupChat ? activeChat?.chatName : activeChat?.users.find((items) => items?._id !== user?._id)?.username}
                  </p>
                  <p className="text-xs text-gray-500">{activeChat?.isGroupChat ? "Group Chat" : "Personal Chat"}</p>
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
                    key={message?._id}
                    className={`flex ${message?.sender?._id === user?._id ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message?.sender?._id === user?._id
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                        }`}
                    >
                      <p>{message?.content}</p>
                      <p
                        className={`text-xs mt-1 ${message?.sender?._id === user?._id
                          ? "text-blue-100"
                          : "text-gray-500"
                          }`}
                      >
                        {message?.createdAt?.toLocaleString()}
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
                  onClick={handleSendMessage}
                  className={`rounded-full p-2 ${newMessage.trim()
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
        ) : (
          <div className="w-full bg-white border rounded-2xl h-[96vh] flex flex-col items-center justify-center">
            <Card className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-12 border-0 shadow-none">
              <CardHeader className="flex flex-col items-center gap-4">
                <span className="bg-blue-100 rounded-full p-4 mb-2">
                  <MessageCircle className="text-blue-500" size={48} />
                </span>
                <CardTitle className="text-2xl font-bold text-center">No Chat Selected</CardTitle>
                <CardDescription className="text-center text-base text-muted-foreground">
                  Select a chat from the sidebar or start a new conversation to begin messaging.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Button variant="default" size="lg" className="mt-6">Start New Chat</Button>
              </CardContent>
            </Card>
          </div>
        )
      }

    </>
  );
};

export default ChatScreen;
