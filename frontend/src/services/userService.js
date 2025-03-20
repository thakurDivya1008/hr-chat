import Request from "@/config/apiConfig";
import apiUrls from "@/config/apiUrls";

const Login = async (payload) =>
  Request({
    method: "POST",
    url: apiUrls.login,
    data: payload,
  });

const Register = async (payload) =>
  Request({
    method: "POST",
    url: apiUrls.register,
    data: payload,
  });
const userService = {
  Login,
  Register,
};

export default userService;
