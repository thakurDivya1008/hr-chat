import io from 'socket.io-client';
import apiUrls from '@/config/apiUrls';
import { setMessages } from '@/redux/slices/chatSlice';

class SocketService{
    socket =null;
    dispatch=null;

    //Initialize the socket connection
    initSocket(headers,dispatch){
        console.log("initSocket",headers,dispatch);
        this.socket=io(apiUrls.base_url,{
            auth:{
                headers:headers,
            }
        });

        this.dispatch=dispatch;
        this.setupListeners();
    }

    //Listeners
    setupListeners(){
        if(!this.socket) return;
        this.socket.on("connect",this.onConnect);
        this.socket.on("disconnect",this.onDisconnect);
        this.socket.on("connectionError",this.onConnectionError);
        this.socket.on("message received",this.onMessageReceived);
    }

    //Emitters
    onConnect=()=>{
        console.log("connected to the server");
    }
    onDisconnect=()=>{
        console.log("disconnect from server");
    }
    onConnectionError=()=>{
        console.log("there is connection error");
    }
    onMessageReceived=(message)=>{
        console.log("message received",message);
        this.dispatch(setMessages(message));
    }

    //Join a chat room
    joinChatRoom=(chatId)=>{
        const userId=JSON.parse(localStorage.getItem("user"))?._id;
        console.log("join chat room",chatId);
        const payload={
            chatId,
            userId,
        }
        console.log("payload",payload);
        this.socket.emit("join chat",payload);
    }

    sendMessage(data){
        this.socket.emit("new message",data);
    }

    disconnect(){
        if(this.socket){
            this.socket.disconnect();
        }
    }
}

//singleton instance
const socketService=new SocketService();
export default socketService;