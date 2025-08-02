import {
  MoreVertical,
  PhoneCall,
  VideoIcon,
  Send,
  Paperclip,
  Smile,
  MessageCircle,
  Image,
  Video,
  File,
  VoteIcon,
  FileAudio,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import profileImg from "@/assets/images/profile-img.png";
import groupImg from "@/assets/images/group-img.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/services/socket/socketContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatTime, getDayLabel } from "@/utils/dateFormater";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MessageService from "@/services/api/messageService";

const ChatScreen = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state) => state.chat);
  const { user, userList } = useSelector((state) => state.auth);
  const messages = useSelector((state) => state.chat.activeChat?.messages);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  let typingTimeout = useRef();
  const [typingDots, setTypingDots] = useState(1);
  const [openAttachmentPopover, setOpenAttachmentPopover] = useState(false);
  const [attachmentType, setAttachmentType] = useState(null);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const attachmentRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  useEffect(() => {
    function handleTyping(data) {
      if (data.user !== user?._id) setTypingUser(data.user);
    }
    function handleStopTyping(data) {
      if (data.user !== user?._id) setTypingUser(null);
    }
    socket.socket?.on("typing", handleTyping);
    socket.socket?.on("stop typing", handleStopTyping);

    return () => {
      socket.socket?.off("typing", handleTyping);
      socket.socket?.off("stop typing", handleStopTyping);
    };
  }, [socket, user]);

  useEffect(() => {
    if (typingUser) {
      const interval = setInterval(() => {
        setTypingDots((prev) => (prev % 3) + 1);
      }, 400);
      return () => clearInterval(interval);
    } else {
      setTypingDots(1);
    }
  }, [typingUser]);

  // Handle input change
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    socket.typing(activeChat?._id, user?._id);

    // Debounce stop typing
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.stopTyping(activeChat?._id, user?._id);
    }, 1500);
  };

  // Send message function
  const handleSendMessage = async () => {
    try {
      if (attachmentFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", attachmentFile);
        formData.append("chatId", activeChat?._id);

        const response = await MessageService.UploadFileMessage(formData);
        if (response?.status === 200) {
          setAttachmentFile(null);
          setAttachmentPreview(null);
          return;
        }
      }
      if (newMessage.trim() === "") return;
      socket.stopTyping(activeChat?._id, user?._id);
      setNewMessage(""); // Clear input
      const payload = {
        chatId: activeChat?._id,
        message: newMessage,
        sender: user?._id,
      };
      socket.sendMessage(payload);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setUploading(false);
      setAttachmentFile(null);
      setAttachmentPreview(null);
    }
  };

  // Handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  //handle pick attachment
  const handlePickAttachment = () => {
    attachmentRef.current?.click();
    setOpenAttachmentPopover(false);
  };
  const handleAttachmentChange = (e) => {
    setAttachmentFile(e.target.files[0]);
    setAttachmentPreview(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      {activeChat ? (
        <div className="relative w-full bg-white border rounded-2xl h-[96vh] flex flex-col">
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
                  {activeChat?.isGroupChat
                    ? activeChat?.chatName
                    : activeChat?.users.find(
                        (items) => items?._id !== user?._id
                      )?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {activeChat?.isGroupChat ? "Group Chat" : "Personal Chat"}
                </p>

                {typingUser && (
                  <div className="text-xs text-black mb-2">typing...</div>
                )}
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
              {Array.isArray(messages) &&
                messages.length > 0 &&
                (() => {
                  let lastMessageDate = null;
                  return messages.map((message, idx) => {
                    const messageDate = new Date(message.createdAt);
                    const messageDay = messageDate.toDateString();
                    let showDayLabel = false;

                    if (lastMessageDate !== messageDay) {
                      showDayLabel = true;
                      lastMessageDate = messageDay;
                    }

                    return (
                      <React.Fragment key={message?._id}>
                        {showDayLabel && (
                          <div className="flex justify-center my-2">
                            <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                              {getDayLabel(message.createdAt)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            message?.sender?._id === user?._id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              message?.sender?._id === user?._id
                                ? "bg-blue-500 text-white rounded-tr-none"
                                : "bg-gray-200 text-gray-800 rounded-tl-none"
                            } ${
                              message?.file
                                ? "!bg-white border border-gray-200"
                                : ""
                            }`}
                          >
                            {message?.file &&
                              message?.file?.type.startsWith("image") && (
                                <div className="mb-2 max-h-[300px] overflow-hidden  rounded-3xl border border-gray-200">
                                  <img
                                    src={message?.file?.url}
                                    alt={message?.file?.name}
                                    className="max-w-xs object-cover h-full"
                                  />
                                </div>
                              )}
                            {!message?.file && <p>{message?.content}</p>}
                            <p
                              className={`text-xs mt-1 ${
                                message?.sender?._id === user?._id
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              } ${message?.file ? "!text-blue-600" : ""}`}
                            >
                              {formatTime(message?.createdAt)}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  });
                })()}
              {typingUser && (
                <div className="text-xs text-black mb-2 flex items-center gap-1">
                  {userList.find((item) => item?._id === typingUser)
                    ?.username || "Someone"}{" "}
                  is typing
                  <span>{".".repeat(typingDots)}</span>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>
          </div>

          {/** attachment preview */}
          {attachmentPreview && (
            <div className=" h-[200px] w-[200px]  overflow-hidden border border-gray-200  bg-gray-50 absolute bottom-[60px] left-0 m-4 rounded-3xl shadow-xl">
              <img
                src={attachmentPreview}
                alt="Attachment Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {/**input box */}
          <div className="border-t p-3">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Popover
                open={openAttachmentPopover}
                onOpenChange={setOpenAttachmentPopover}
              >
                <PopoverTrigger>
                  <Paperclip
                    onClick={() =>
                      setOpenAttachmentPopover(!openAttachmentPopover)
                    }
                    className={`text-gray-500 cursor-pointer mr-2 ${
                      openAttachmentPopover ? "rotate-90" : ""
                    } transition-all duration-300`}
                    size={20}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 rounded-3xl shadow-xl border border-gray-200 bg-white/95 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      onClick={() => {
                        handlePickAttachment();
                        setAttachmentType("image");
                      }}
                      className="flex flex-col items-center gap-2 cursor-pointer hover:bg-blue-50 rounded-xl p-3 transition-all duration-200 group"
                    >
                      <div className="bg-blue-100 rounded-full p-3 group-hover:bg-blue-200 transition-colors">
                        <Image className="text-blue-600" size={20} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">Image</p>
                    </div>
                    <div
                      onClick={() => setAttachmentType("video")}
                      className="flex flex-col items-center gap-2 cursor-pointer hover:bg-purple-50 rounded-xl p-3 transition-all duration-200 group"
                    >
                      <div className="bg-purple-100 rounded-full p-3 group-hover:bg-purple-200 transition-colors">
                        <Video className="text-purple-600" size={20} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">Video</p>
                    </div>
                    <div
                      onClick={() => setAttachmentType("document")}
                      className="flex flex-col items-center gap-2 cursor-pointer hover:bg-green-50 rounded-xl p-3 transition-all duration-200 group"
                    >
                      <div className="bg-green-100 rounded-full p-3 group-hover:bg-green-200 transition-colors">
                        <File className="text-green-600" size={20} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        Document
                      </p>
                    </div>
                    <div
                      onClick={() => setAttachmentType("audio")}
                      className="flex flex-col items-center gap-2 cursor-pointer hover:bg-orange-50 rounded-xl p-3 transition-all duration-200 group"
                    >
                      <div className="bg-orange-100 rounded-full p-3 group-hover:bg-orange-200 transition-colors">
                        <FileAudio className="text-orange-600" size={20} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">Audio</p>
                    </div>
                    <div
                      onClick={() => setAttachmentType("poll")}
                      className="flex flex-col items-center gap-2 cursor-pointer hover:bg-red-50 rounded-xl p-3 transition-all duration-200 group col-span-2"
                    >
                      <div className="bg-red-100 rounded-full p-3 group-hover:bg-red-200 transition-colors">
                        <VoteIcon className="text-red-600" size={20} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">Poll</p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <input
                type={
                  attachmentType === "image"
                    ? "file"
                    : attachmentType === "video"
                    ? "file"
                    : attachmentType === "document"
                    ? "file"
                    : attachmentType === "audio"
                    ? "file"
                    : "file"
                }
                ref={attachmentRef}
                className="hidden"
                onChange={handleAttachmentChange}
              />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <Smile className="text-gray-500 cursor-pointer mx-2" size={20} />
              {uploading ? (
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              ) : (
                <button
                  onClick={handleSendMessage}
                  className={`rounded-full p-2 ${
                    newMessage.trim() || attachmentPreview
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                  disabled={!newMessage.trim() && !attachmentPreview}
                >
                  <Send size={18} />
                </button>
              )}
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
              <CardTitle className="text-2xl font-bold text-center">
                No Chat Selected
              </CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground">
                Select a chat from the sidebar or start a new conversation to
                begin messaging.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Button variant="default" size="lg" className="mt-6">
                Start New Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatScreen;
