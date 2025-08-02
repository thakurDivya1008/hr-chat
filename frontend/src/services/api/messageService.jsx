import Request from "@/config/apiConfig"
const UploadFileMessage=async(payload)=>Request({
    url:"message/upload",
    method:"POST",
    data:payload,
    secure:true,
    files:true,
})

const MessageService={
    UploadFileMessage,
}

export default MessageService;