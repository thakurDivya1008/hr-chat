import React, { useEffect, useState } from "react";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { CiLock } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SignupImg from "../assets/images/register-bg.png";
import toast from "react-hot-toast";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import { FiUser } from "react-icons/fi";
import { Oval } from "react-loader-spinner";
import userService from "@/services/api/userService";

import { Phone } from "lucide-react";
const Register = () => {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [loader, setLoader] = useState(false);
  const [role, setRole] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const payload = {
        email: email,
        password: password,
        username: username,
        role: "user",
      };
      const response = await userService.Register(payload);
      if (response.status === 201) {
        toast.success("Register Successfully!");
        navigate("/login");
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log("error in login:", error);
      toast.error(
        error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          "Failed to login"
      );
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div
      className="w-full h-[100vh] overflow-x-hidden overflow-y-scroll bg-[#f7f7f9] flex  justify-center items-center"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="relative z-[10] md:w-3/12 w-11/12 rounded-2xl bg-white shadow-lg  flex flex-col justify-center items-center  p-5">
        <h1 className="text-3xl font-semibold w-full text-[#424242] block ">
          Adventure starts here 🚀
        </h1>
        <p className="w-full text-gray-500">
          Make your event management easy and fun!
        </p>
        <form
          className="flex flex-col justify-center items-center w-full  mt-8"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex flex-col w-full relative mb-5">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="name"
              type="name"
              className="rounded-xl shadow-sm border-[1px] border-gray-200 focus:border-blue-800 py-3 w-full bg-transparent focus:outline-none outline-none ps-[50px] text-[#616161] placeholder:text-[#9E9E9E]"
              placeholder="Enter your name"
              required
            />
            <FiUser className="absolute text-2xl bottom-[13px] left-[20px] text-[#757575]" />
          </div>
          <div className="flex flex-col w-full relative mb-5">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              className="rounded-xl shadow-sm border-[1px] border-gray-200 focus:border-blue-800 py-3 w-full bg-transparent focus:outline-none outline-none ps-[50px] text-[#616161] placeholder:text-[#9E9E9E]"
              placeholder="Enter your email"
              required
            />
            <HiOutlineEnvelope className="absolute text-2xl bottom-[13px] left-[20px] text-[#757575]" />
          </div>
          <div className="flex flex-col w-full relative mb-5">
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              id="mobile"
              type="tel"
              className="rounded-xl shadow-sm border-[1px] border-gray-200 focus:border-blue-800 py-3 w-full bg-transparent focus:outline-none outline-none ps-[50px] text-[#616161] placeholder:text-[#9E9E9E]"
              placeholder="Enter your mobile"
              required
            />
            <Phone className="absolute text-2xl bottom-[13px] left-[20px] text-[#757575]" />
          </div>

          <div className="flex flex-col w-full relative mb-5">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type={isShowPassword ? "text" : "password"}
              className="rounded-xl shadow-sm border-[1px] border-gray-200 focus:border-blue-800 py-3 w-full bg-transparent focus:outline-none outline-none ps-[50px] text-[#616161] placeholder:text-[#9E9E9E]"
              placeholder="Enter your password"
              required
            />
            <CiLock className="absolute text-2xl bottom-[13px] left-[20px] text-[#757575]" />
            {isShowPassword ? (
              <FiEyeOff
                className="absolute right-[18px] cursor-pointer text-[#757575] text-xl bottom-[15px]"
                onClick={() => setIsShowPassword(!isShowPassword)}
              />
            ) : (
              <FiEye
                className="absolute right-[18px] cursor-pointer text-[#757575] text-xl bottom-[15px]"
                onClick={() => setIsShowPassword(!isShowPassword)}
              />
            )}
          </div>

          <div className="flex gap-[10px] items-center w-full">
            <input type="checkbox" name="" id="" />
            <p>
              I agree to{" "}
              <span className="text-blue-800 cursor-pointer hover:text-blue-400">
                privacy policy & terms
              </span>
            </p>
          </div>
          {loader ? (
            <button
              disabled
              className="mt-8 bg-[#666cff] text-white flex items-center justify-center font-semibold w-full rounded-xl py-3 text-xl cursor-not-allowed border-[2px] hover:border-[2px] border-[#666cff]:text-[#666cff] transition-all duration-300"
            >
              <Oval
                visible={true}
                height={24}
                width={24}
                color="#fff"
                ariaLabel="Loading"
              />
            </button>
          ) : (
            <button
              type="submit"
              onClick={(e) => handleSubmit(e)}
              className="mt-8 bg-[#666cff] text-white font-semibold w-full rounded-xl py-3 text-xl hover:bg-transparent border-[2px] hover:border-[2px] border-[#666cff] hover:text-[#666cff] transition-all duration-300"
            >
              Create Account
            </button>
          )}

          <p className="text-[#616161] mt-4">
            Already have an account ?
            <span
              className="text-[#666cff] font-semibold cursor-pointer ps-1 hover:text-[#ef954b]"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
      <img
        src={SignupImg}
        alt=""
        className="absolute bottom-[80px] md:flex hidden"
      />
    </div>
  );
};

export default Register;
