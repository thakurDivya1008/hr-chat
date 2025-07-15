import React, { useEffect, useState } from "react";
import profileImg from "@/assets/images/profile-img.png";
import { Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import chatService from "@/services/chatService";
import userService from "@/services/userService";
import { setChatList } from "@/redux/slices/chatSlice";
import { setUserList } from "@/redux/slices/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import MultiSelect from "./ui/multi-select";
import { Label } from "./ui/label";
import groupImg from "@/assets/images/group-img.jpg";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatList } = useSelector((state) => state.chat);
  const { userList } = useSelector((state) => state.auth);
  const [chatRoomName, setChatRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const handleCreateChat = async () => {
    try {
      setIsLoading(true);
      const payload = {
        users: selectedUsers,
        chatName: chatRoomName,
        isGroupChat: false,
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

  useEffect(() => {
    handleGetChatList();
    handleGetUserList();
  }, []);
  return (
    <div className="rounded-2xl border bg-white h-[96vh] w-full p-2">
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
            <p className="text-sm  poppins-medium">Hibbanur Rahman</p>
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Chat</DialogTitle>
                <div className="flex flex-col items-center gap-[10px]">
                  <div className="">
                    <Label>Chat Room Name</Label>
                    <Input type="text" placeholder="chat room name" value={chatRoomName} onChange={(e) => setChatRoomName(e.target.value)} />
                  </div>
                  <div className="">
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

                  <Button onClick={handleCreateChat}>Create</Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="w-full mt-6">
        <Tabs defaultValue="all" className="w-full ">
          <TabsList className="rounded-full overflow-hidden p-2 w-full flex justify-between border bg-[#fafafa]">
            <TabsTrigger className="rounded-full px-5 " value="all">
              All
            </TabsTrigger>
            <TabsTrigger className="rounded-full px-5 " value="personal">
              Personal
            </TabsTrigger>
            <TabsTrigger className="rounded-full px-5 " value="groups">
              Groups
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {
              Array.isArray(chatList) && chatList.map((chat) => (
                <div className="flex justify-between">
                  <div className="flex items-center gap-[5px]">
                    <div className="flex rounded-full h-[38px] w-[38px]  relative">
                      <img
                        src={chat?.isGroupChat ? groupImg : profileImg}
                        alt=""
                        className="rounded-full h-full w-full border bg-gray-200 object-fit-cover"
                      />
                    </div>
                    <div className="">
                      <p className="text-sm poppins-medium">{chat?.isGroupChat ? chat?.chatName : chat?.users[1]?.username}</p>
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
                <div className="flex justify-center items-center h-full">
                  <p className="text-sm poppins-medium text-gray-500">No chats found</p>
                  <Button onClick={() => setIsOpen(true)}>Create Chat</Button>
                </div>
              )
            }

          </TabsContent>
          <TabsContent value="personal">Change your password here.</TabsContent>
          <TabsContent value="groups">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sidebar;
