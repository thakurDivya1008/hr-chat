import React from "react";
import profileImg from "@/assets/images/profile-img.png";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
const Sidebar = () => {
  return (
    <div className="rounded-2xl border bg-white h-[96vh] w-full p-2">
      <div className="flex items-center justify-between m-0 p-0">
        <div className="flex items-center gap-[10px]">
          <div className="flex rounded-full h-[45px] w-[45px]  relative">
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
          <Search className="text-gray-600" size={20} />
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
            <div className="flex justify-between">
              <div className="flex items-center gap-[5px]">
                <div className="flex rounded-full h-[38px] w-[38px]  relative">
                  <img
                    src={profileImg}
                    alt=""
                    className="rounded-full h-full w-full border bg-gray-200 object-fit-cover"
                  />
                </div>
                <div className="">
                  <p className="text-sm poppins-medium">Harry Maguire</p>
                  <p className="text-xs poppins-regular text-gray-500">
                    You need to improve now
                  </p>
                </div>
              </div>
              <div className="">
                <p className="text-xs poppins-regular text-gray-400">
                  11:34 AM
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="personal">Change your password here.</TabsContent>
          <TabsContent value="groups">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sidebar;
