import React, { useEffect, useState } from "react";
import profileImg from "@/assets/images/profile-img.png";
import { ChevronDown, MessageCircle, PhoneCall, Plus, Search, Settings2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import chatService from "@/services/api/chatService";
import userService from "@/services/api/userService";
import { setActiveChat, setChatList } from "@/redux/slices/chatSlice";
import { setUserList } from "@/redux/slices/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import MultiSelect from "./ui/multi-select";
import { Label } from "./ui/label";
import groupImg from "@/assets/images/group-img.jpg";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useSocket } from "@/services/socket/socketContext";


const Sidebar = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { chatList, activeChat } = useSelector((state) => state.chat);
  const { userList } = useSelector((state) => state.auth);
  const [chatRoomName, setChatRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isGroupChat, setIsGroupChat] = useState("personal");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login")
  }

  const handleGetChatList = async () => {
    try {
      const response = await chatService.FetchChatsList();
      if (response?.status === 200) {
        dispatch(setChatList(response?.data?.data));
      }
    } catch (error) {
      console.log("error while fetching chat list", error);
    }
  }

  const handleGetUserList = async () => {
    try {
      const response = await userService.FetchUserList();
      if (response?.status === 200) {
        dispatch(setUserList(response?.data?.data));
      }
    } catch (error) {
      console.log("error while fetching user list", error);
    }
  }

  //create chat
  const handleCreateChat = async () => {
    try {
      setIsLoading(true);
      let payload = {};
      if (isGroupChat === "group") {
        payload = {
          users: selectedUsers,
          chatName: chatRoomName,
          isGroupChat: true,
        }
      } else {
        payload = {
          users: [selectedUser],
          chatName: chatRoomName,
          isGroupChat: false,
        }
      }

      const response = await chatService.CreateChat(payload);
      if (response?.status === 200) {
        handleGetChatList();
        setIsOpen(false);
      }
    } catch (error) {
      console.log("error while creating chat", error);
    } finally {
      setChatRoomName("");
      setSelectedUsers([]);
      setIsLoading(false);
    }
  }

  //handle select chat
  const handleSelectChat = (chat) => {
    dispatch(setActiveChat(chat));
    socket.joinChatRoom(chat?._id);
  }
  useEffect(() => {
    handleGetChatList();
    handleGetUserList();
  }, []);
  return (
    <>


      <div className="rounded-2xl border bg-white h-[96vh] w-full p-2 md:flex md:flex-col hidden">
        <div className="flex items-center justify-between m-0 p-0">
          <div className="flex items-center gap-[10px]">
            <div className="flex rounded-full h-[45px] w-[45px]  relative" onClick={() => handleLogout()}>
              <img
                src={profileImg}
                alt=""
                className="rounded-full h-full w-full border bg-gray-200 object-fit-cover shadow-xl"
              />
              <div className="w-[10px] h-[10px] bg-green-600 absolute z-[50] rounded-full bottom-[5px] right-[0px] shadow-sm"></div>
            </div>
            <div className="w-max">
              <p className="text-sm  poppins-medium">{user?.username || "User"}</p>
              <p className="text-xs text-gray-500 poppins-regular">
                Info account
              </p>
            </div>
          </div>
          <div className="">
            {/* <Search className="text-gray-600" size={20} /> */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger>
                <Plus className="text-gray-600" size={20} />
              </DialogTrigger>
              <DialogContent className="max-w-[400px]">

                <DialogTitle>Create Chat</DialogTitle>
                <div className="flex flex-col items-center gap-[10px] w-full">
                  <div className="w-full">
                    <Label>Select Chat Type</Label>
                    <RadioGroup
                      onValueChange={(e) => setIsGroupChat(e)}
                      value={isGroupChat}
                      className="w-full flex  gap-[10px] mt-3"
                    >
                      <div className="flex items-center gap-[10px]">
                        <RadioGroupItem value="group" className="text-black" id="group">Group</RadioGroupItem>
                        <Label htmlFor="group">Group</Label>
                      </div>
                      <div className="flex items-center gap-[10px]">
                        <RadioGroupItem value="personal" className="text-black" id="personal">Personal</RadioGroupItem>
                        <Label htmlFor="personal">Personal</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {
                    isGroupChat === "group" && (
                      <div className="w-full">
                        <Label>Chat Room Name</Label>
                        <Input type="text" placeholder="chat room name" value={chatRoomName} onChange={(e) => setChatRoomName(e.target.value)} />
                      </div>
                    )
                  }
                  {
                    isGroupChat === "group" ? (
                      <div className="w-full">
                        <Label>Select Users</Label>
                        <MultiSelect
                          options={(userList || []).map((user) => ({
                            label: user?.username,
                            value: user?._id,
                          }))}
                          onValueChange={(e) => setSelectedUsers(e)}
                          value={selectedUsers}
                          placeholder="Select users"
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        <Label>Select User</Label>
                        <Select value={selectedUser} onValueChange={(e) => setSelectedUser(e)}>
                          <SelectTrigger className="w-full mt-3 !text-black">
                            <SelectValue placeholder="Select user" className="!text-black" />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              (userList || []).map((user) => (
                                <SelectItem key={user?._id} value={user?._id}>{user?.username}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  }


                  <Button onClick={handleCreateChat}>Create</Button>
                </div>

              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="w-full mt-6">
          <Tabs defaultValue="all" className="w-full ">
            <TabsList className="rounded-full overflow-hidden p-2 w-full flex justify-between border bg-[#fafafa]">
              <TabsTrigger className="rounded-full px-5 cursor-pointer" value="all">
                All
              </TabsTrigger>
              <TabsTrigger className="rounded-full px-5 cursor-pointer" value="personal">
                Personal
              </TabsTrigger>
              <TabsTrigger className="rounded-full px-5 cursor-pointer" value="groups">
                Groups
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {
                Array.isArray(chatList) && chatList.map((chat) => (
                  <div className={`flex justify-between my-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md ${chat?._id === activeChat?._id ? "bg-gray-100" : ""}`} onClick={() => handleSelectChat(chat)}>
                    <div className="flex items-center gap-[5px]">
                      <div className="flex rounded-full h-[38px] w-[38px]  relative">
                        <img
                          src={chat?.isGroupChat ? groupImg : profileImg}
                          alt=""
                          className="rounded-full h-full w-full border bg-gray-200 object-fit-cover"
                        />
                      </div>
                      <div className="">
                        <p className="text-sm poppins-medium">{chat?.isGroupChat ? chat?.chatName : chat?.users.find((items) => items?._id !== user?._id)?.username}</p>
                        <p className="text-xs poppins-regular text-gray-500">
                          {chat?.isGroupChat ? "Group Chat" : "Personal Chat"}
                        </p>
                      </div>
                    </div>
                    <div className="">
                      <p className="text-xs poppins-regular text-gray-400">
                        11:34 AM
                      </p>
                    </div>
                  </div>
                ))
              }

              {
                chatList?.length === 0 && (
                  <div className="flex flex-col justify-center items-center h-full">
                    <p className="text-sm poppins-medium text-gray-500">No chats found</p>
                    <Button className="mt-4 w-full " onClick={() => setIsOpen(true)}>Create Personal Chat</Button>
                  </div>
                )
              }

            </TabsContent>
            <TabsContent value="personal">  {
              Array.isArray(chatList) && chatList.map((chat) => (
                !chat?.isGroupChat && (
                  <div className={`flex justify-between my-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md ${chat?._id === activeChat?._id ? "bg-gray-100" : ""}`} onClick={() => handleSelectChat(chat)}>
                    <div className="flex items-center gap-[5px]">
                      <div className="flex rounded-full h-[38px] w-[38px]  relative">
                        <img
                          src={chat?.isGroupChat ? groupImg : profileImg}
                          alt=""
                          className="rounded-full h-full w-full border bg-gray-200 object-fit-cover"
                        />
                      </div>
                      <div className="">
                        <p className="text-sm poppins-medium">{chat?.isGroupChat ? chat?.chatName : chat?.users.find((items) => items?._id !== user?._id)?.username}</p>
                        <p className="text-xs poppins-regular text-gray-500">
                          {chat?.isGroupChat ? "Group Chat" : "Personal Chat"}
                        </p>
                      </div>
                    </div>
                    <div className="">
                      <p className="text-xs poppins-regular text-gray-400">
                        11:34 AM
                      </p>
                    </div>
                  </div>
                )
              ))
            }

              {
                chatList?.filter((chat) => !chat?.isGroupChat)?.length === 0 && (
                  <div className="flex flex-col justify-center items-center h-full">
                    <p className="text-sm poppins-medium text-gray-500">No chats found</p>
                    <Button className="mt-4 w-full " onClick={() => { setIsOpen(true); setIsGroupChat("personal") }}>Create Personal Chat</Button>
                  </div>
                )
              }</TabsContent>
            <TabsContent value="groups">  {
              Array.isArray(chatList) && chatList.map((chat) => (
                chat?.isGroupChat && (
                  <div className={`flex justify-between my-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md ${chat?._id === activeChat?._id ? "bg-gray-100" : ""}`} onClick={() => handleSelectChat(chat)}>
                    <div className="flex items-center gap-[5px]">
                      <div className="flex rounded-full h-[38px] w-[38px]  relative">
                        <img
                          src={chat?.isGroupChat ? groupImg : profileImg}
                          alt=""
                          className="rounded-full h-full w-full border bg-gray-200 object-fit-cover"
                        />
                      </div>
                      <div className="">
                        <p className="text-sm poppins-medium">{chat?.isGroupChat ? chat?.chatName : chat?.users.find((items) => items?._id !== user?._id)?.username}</p>
                        <p className="text-xs poppins-regular text-gray-500">
                          {chat?.isGroupChat ? "Group Chat" : "Personal Chat"}
                        </p>
                      </div>
                    </div>
                    <div className="">
                      <p className="text-xs poppins-regular text-gray-400">
                        11:34 AM
                      </p>
                    </div>
                  </div>
                )
              ))
            }

              {
                chatList?.filter((chat) => chat?.isGroupChat)?.length === 0 && (
                  <div className="flex flex-col justify-center items-center h-full">
                    <p className="text-sm poppins-medium text-gray-500">No chats found</p>
                    <Button className="mt-4 w-full " onClick={() => { setIsOpen(true); setIsGroupChat("group") }}>Create group Chat</Button>
                  </div>
                )
              }</TabsContent>
          </Tabs>
        </div>
      </div>

      {/* mobile view */}
      <div className="md:hidden w-full flex justify-between bg-white p-2 px-6 bg-white border rounded-2xl">
        <div className="flex flex-col items-center gap-[5px]">
          <MessageCircle />
          <p>Chats</p>
        </div>
        <div className="flex flex-col items-center gap-[5px]">
          <PhoneCall />
          <p>Calls</p>
        </div>
        <div className="flex flex-col items-center gap-[5px]">
          <Settings2 />
          <p>Settings</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
