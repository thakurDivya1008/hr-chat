import React, { useEffect, useState } from "react";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { CiLock } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import LoginImg from "../assets/images/login-bg.png";
import toast from "react-hot-toast";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import { login } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { Oval } from "react-loader-spinner";
import userService from "@/services/api/userService";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const payload = {
        email: email,
        password: password,
      };
      const response = await userService.Login(payload);
      if (response.status === 200) {
        toast.success("Successfully logged in!");
       
        dispatch(login(response?.data));
        localStorage.setItem("user", JSON.stringify(response?.data?.data?.User));
        localStorage.setItem("access_token", response?.data?.data?.token);
        navigate("/dashboard");
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
          Welcome to HR ChatApp! 👋🏻
        </h1>
        <p className="w-full text-gray-500">
          Please sign-in to your account and start the adventure
        </p>
        <form
          className="flex flex-col justify-center items-center w-full  mt-8"
          onSubmit={(e) => handleLogin(e)}
        >
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
          <p className="w-full text-right font-semibold cursor-pointer text-[#616161] hover:text-[#92613A]">
            Forgot Password?
          </p>
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
              onClick={(e) => handleLogin(e)}
              className="mt-8 bg-[#666cff] text-white font-semibold w-full rounded-xl py-3 text-xl hover:bg-transparent border-[2px] hover:border-[2px] border-[#666cff] hover:text-[#666cff] transition-all duration-300"
            >
              Login
            </button>
          )}

          <p className="text-[#616161] mt-4">
            New on our platform ?
            <span
              className="text-[#666cff] font-semibold cursor-pointer ps-1 hover:text-[#ef954b]"
              onClick={() => navigate("/register")}
            >
              Create an account
            </span>
          </p>
        </form>
      </div>
      <img
        src={LoginImg}
        alt=""
        className="absolute bottom-[80px] md:flex hidden"
      />
    </div>
  );
};

export default Login;
