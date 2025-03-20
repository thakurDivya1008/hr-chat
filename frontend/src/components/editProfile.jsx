import React, { useRef, useState } from "react";
import profileDummyImg from "@/assets/images/dummy-profile-img-2.jpg";
import { BsCamera } from "react-icons/bs";
const EditProfile = () => {
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [phone, setPhone] = useState(null);
  const [role, setRole] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState(null);
  const handleInputFileChange = (e) => {
    setProfileImg(e.target?.files[0]);
    setProfileImgPreview(URL.createObjectURL(e.target.files[0]));
  };
  const handleFileInputOpen = () => {
    fileInputRef.current.click();
  };
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-lg">Profile Image</h1>
      <div className=" my-4 relative rounded-full shadow-lg h-[150px] w-[150px] border-[2px]  border-blue-400">
        <img
          src={profileImgPreview || profileDummyImg}
          alt="profile image"
          className="rounded-full w-full h-full"
        />
        <div
          onClick={handleFileInputOpen}
          className="absolute right-[10px] cursor-pointer hover:bg-gray-200 hover:scale-125 scale-100 transition-all duration-500 bottom-[1px] rounded-full p-2 bg-gray-200 border-[1px] border-blue-400"
        >
          <BsCamera className="text-blue-800 text-xl" />
        </div>
        <input
          type="file"
          name="profileImage"
          className="hidden"
          onChange={handleInputFileChange}
          ref={fileInputRef}
        />
      </div>
      <div className="w-full">
        <div className="w-full flex gap-[20px] my-3">
          <div className="w-6/12">
            <label htmlFor="fullName" className="block font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border w-full rounded-xl mt-3 p-2 px-4 focus:outline-none focus:border-1 focus:border-blue-600 placeholder:text-gray-800 "
              placeholder="Enter Full Name"
              required
            />
          </div>
          <div className="w-6/12">
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border w-full rounded-xl mt-3 p-2 px-4 focus:outline-none focus:border-1 focus:border-blue-600 placeholder:text-gray-800 "
              placeholder="Enter Email"
              required
            />
          </div>
        </div>
        <div className="w-full flex gap-[20px] my-3">
          <div className="w-6/12">
            <label htmlFor="mobile" className="block font-medium">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border w-full rounded-xl mt-3 p-2 px-4 focus:outline-none focus:border-1 focus:border-blue-600 placeholder:text-gray-800 "
              placeholder="Enter Phone"
              required
            />
          </div>
          <div className="w-6/12">
            <label htmlFor="role" className="block font-medium">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border w-full rounded-xl mt-3 p-2 px-4 focus:outline-none focus:border-1 focus:border-blue-600 placeholder:text-gray-800 "
              placeholder="Enter Role"
              required
            />
          </div>
        </div>
        <div className="w-full flex gap-[20px] my-3">
          <div className="w-6/12">
            <label htmlFor="languages" className="block font-medium">
              Languages
            </label>
            <input
              type="text"
              name="languages"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              className="border w-full rounded-xl mt-3 p-2 px-4 focus:outline-none focus:border-1 focus:border-blue-600 placeholder:text-gray-800 "
              placeholder="Enter languages"
              required
            />
          </div>
          <div className="w-6/12">
            <label htmlFor="location" className="block font-medium">
              location
            </label>
            <input
              type="text"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border w-full rounded-xl mt-3 p-2 px-4 focus:outline-none focus:border-1 focus:border-blue-600 placeholder:text-gray-800 "
              placeholder="Enter Location"
              required
            />
          </div>
        </div>
        <div className="w-full  my-3">
          <label htmlFor="description" className="block font-medium">
            description
          </label>
          <textarea
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border h-[100px] resize-none w-full rounded-xl mt-3 p-2 px-4 focus:outline-none focus:border-1 focus:border-blue-600 placeholder:text-gray-800 "
            placeholder="Write description..."
            required
          />
        </div>
        <div className="w-full flex justify-center gap-[20px] my-5">
          <button className="border-[2px] border-[#fe1212a3] hover:bg-[#fe1212a3] hover:text-white duration-500 transition-all text-[#fe1212a3] w-[150px] p-2 rounded-xl">
            {" "}
            Cancel
          </button>
          <button className="border-[2px] border-blue-800 text-white bg-blue-800 hover:bg-transparent hover:text-blue-800 transition-all duration-500 w-[150px] p-2 rounded-xl">
            {" "}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
