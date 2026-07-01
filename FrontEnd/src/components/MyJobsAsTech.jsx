import { useEffect, useState } from "react"
import axios from "axios";
import "./readorder.css"

export default function MyJobsAsTech(){
//---------------------------------------------------
//state
//---------------------------------------------------
const [order,setOrder]=useState([]);
const token =localStorage.getItem("token")
const userId = Number(localStorage.getItem("id"))
const [service,setService]=useState([])
//---------------------------------------------------
//FetchOrder
//---------------------------------------------------
useEffect (()=>{
const FetchOrder = async ()=>{
try{
    const response = await axios.get(`http://localhost:3000/api/readtechorder/${userId}`,{
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
//ข้อมูลบริการ
//---------------------------------------------------
useEffect(()=>{

  const fetchService = async()=>{
    try{
      const response = await axios.get(`http://localhost:3000/api/searchmyservice/${userId}`,{
        headers: {authorization:token}
      });
      setService(response.data.result);
      console.log(response.data.result)
      console.log("UserId=",userId)
    }catch(err){
      console.log(err)
      console.log(err.response.data.message)
    }


  }
fetchService()
},[userId])





//---------------------------------------------------
//UI
//---------------------------------------------------
const ShowStatus=(Order) => {
  if(Order.Status==="ACCEPTED") return"ยืนยันแล้ว"
  if(Order.Status==="IN_PROGRESS") return"กำลังดำเนินการ"
  if(Order.Status==="WAITING_CONFIRM") return"รอการยืนยัน"
  if(Order.Status==="COMPLETED") return"เสร็จสิ้น"
  if(Order.Status==="CANCELLED") return"ยกเลิกแล้ว"
};




  return(
<div>
    <div className="order-page">
  <p className="order-title">บริการที่ต้องส่ง</p>
  <div className="table-order">
    <span>Order ID</span>
    <span>บริการ</span>
    <span>ราคา (บาท)</span>
    <span>วันเริ่มงาน</span>
    <span>วันสิ้นสุด</span>
    <span>สถานะ</span>
  </div>

  {order.map((O) => (
    <div key={O.Order_Id} className="order-card">
      <span>#{O.Order_Id}</span>
      <span>{O.Service_Id? service.find(s => s.Service_Id === O.Service_Id)?.Title : "ไม่พบบริการ" }</span>
      <span>{O.Final_Price.toLocaleString()}</span>
      <span>{new Date(O.Work_Date).toLocaleDateString("th-TH")}</span>
      <span>{new Date(O.Work_Date_End).toLocaleDateString("th-TH")}</span>
      <span>{ShowStatus(O)}</span>
    </div>
  ))}
</div>

</div>


    )
}