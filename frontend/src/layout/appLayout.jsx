import ChatScreen from "@/views/chatScreen";
import Sidebar from "@/components/sidebar";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/authSlice";

import { setMobileView } from "@/redux/slices/sidebarSlice";
import SocketProvider from "@/services/socket/socketContext";

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isOpen } = useSelector((state) => state?.sidebar);
  const { activeMacro } = useSelector((state) => state.macro);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (accessToken && userData) {
      dispatch(login(JSON.parse(userData)));
    } else {
      navigate("/");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      dispatch(setMobileView(isMobile));
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);
  return (
    <SocketProvider>

      <div className="bg-gray-100">
        <div
          className="w-full flex gap-[15px]  h-[100vh] overflow-hidden pt-5"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            className={`transition-all duration-500 md:w-[390px] w-[250px] absolute md:relative md:px-2 md:pe-0  z-10 ${isOpen ? "left-0" : "left-[-350px]"
              } `}
          >
            <Sidebar role={user?.role} />
          </div>
          <div
            className="w-full h-full overflow-y-scroll pe-5"
            style={{ scrollbarWidth: "none" }}
          >
            <Routes>
              <Route path="/" element={<ChatScreen />} />
            </Routes>
          </div>
          {activeMacro && <div className="w-[300px]"></div>}
        </div>
      </div>
    </SocketProvider>
  );
};

export default AppLayout;
