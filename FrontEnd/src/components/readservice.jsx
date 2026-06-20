import axios from "axios";
import { useEffect, useState } from "react";

export default function Readservice(){
const [data,setData]=useState([])

useEffect(()=>{
    const token = localStorage.getItem("token")
    const id = JSON.parse(localStorage.getItem("user")).payload.id
    console.log(id)
const handleAll=async()=>{
    try{
        const response = await axios.get(`http://localhost:3000/api/readservice/${id}`,{
            headers:{
                authorization:token
            }
        })
        setData(response.data.result)
        console.log(response.data)
    }catch(err){
        if(err.response.status===404){
        alert("ไม่มีข้อมูล")
        }
        console.log(err)
    }
}
handleAll()
},[])
    return(
        <>
        {data.map((service)=>
        <div key={service.Service_Id}>
            <p>{service.Title}</p>
            <p>{service.Description}</p>
            <p>{service.Price} บาท</p>
            {service.Image && (
            <img src={`http://localhost:3000/uploads/${service.Image}`} width={150} alt={service.Title} />
            )}
        </div>
        )}
        </>
    )
}