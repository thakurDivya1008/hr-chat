import Request from "@/config/apiConfig";
import apiUrls from "@/config/apiUrls";

const FetchChatsList=async()=>Request({
    url:apiUrls.chats,
    method:"GET",
    secure:true,
})

const CreateChat=async(payload)=>Request({
    url:apiUrls.chats,
    method:"POST",
    data:payload,
    secure:true,
})
const chatService={
    FetchChatsList,
    CreateChat
}
export default chatService;