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

const FetchUserList=async()=>Request({
  url:`${apiUrls.users}/all`,
  method:"GET",
  secure:true,
})
const userService = {
  Login,
  Register,
  FetchUserList,
};

export default userService;
