import { useEffect, useState } from "react"
import axios from "axios";


export default function ReadOrder(){
//---------------------------------------------------
//state
//---------------------------------------------------
const [order,setOrder]=useState([]);
const token =localStorage.getItem("token")
const UserID = localStorage.getItem("id")
//---------------------------------------------------
//FetchOrder
//---------------------------------------------------
useEffect (()=>{
const FetchOrder = async ()=>{
try{
    const response = await axios.get(`http://localhost:3000/api/readorder/${UserID}`,{
        headers: {authorization:token}
        });
        setOrder(response.data.result);
        console.log(response.data.result);
    }catch(err){
        console.log(err)
        console.log(err.response.data)
    }
}
FetchOrder()
},[])
//---------------------------------------------------
//UI
//---------------------------------------------------

    return(

<div>
    <p>myOrder</p>
    {/* {order.map((order)=><div key={order.}>{}</div>)} */}
    
</div>


    )
}