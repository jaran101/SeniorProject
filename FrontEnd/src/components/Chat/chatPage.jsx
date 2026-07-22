import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MessageItem from "./MessageItem"
import RoomList from "./RoomList"

export default function ChatPage() {

    const [listRoom,setListRoom]=useState([])
    const user = localStorage.getItem("user")
    const userData = JSON.parse(user)
    const id = userData.payload.id
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

useEffect(()=>{    
    const getRoom = async()=>{
        try{
             const responce = await axios.get(`http://localhost:3000/api/listmyrooms/${id}`,{
               headers: { authorization: token}
             })
            setListRoom(responce.data.result)
            console.log(responce.data.result)    
        }catch(err){
            console.error(err.response.data.message)
        }
    }
getRoom();
},[])





    return (
        <>
        <h1>Chat Page</h1>
        <RoomList listRoom={listRoom} myId={id} />
        </>
    )
}