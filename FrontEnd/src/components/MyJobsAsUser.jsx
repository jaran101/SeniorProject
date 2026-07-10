import { useEffect, useState } from "react"
import axios from "axios";
import "./readorder.css"

export default function MyJobsAsUser(){
//---------------------------------------------------
//state
//---------------------------------------------------
const [order,setOrder]=useState([]);
const token =localStorage.getItem("token")
const userId = Number(localStorage.getItem("id"))
const [service,setService]=useState([])
const [serviceMap, setServiceMap] = useState({}) // { 2: "ซ่อมแอร์", 3: "ประปา" }

//---------------------------------------------------
//FetchOrder
//---------------------------------------------------
useEffect (()=>{
const FetchOrder = async ()=>{
try{
    const response = await axios.get(`http://localhost:3000/api/readorderbyuserid/${userId}`,{
        headers: {authorization:token}
        });
        setOrder(response.data.result);
        console.log(response.data.result);
      }catch(error){
        console.log(error)
        console.log("เกิดข้อผิดพลาด:",error.response.data.message)
    }
}
FetchOrder()
},[])



//---------------------------------------------------
//ข้อมูลบริการ
//---------------------------------------------------
useEffect(()=>{
if(order.length === 0) return; // ถ้า order ยังว่างอยู่ ให้ return ออกไป
  const fetchService = async()=>{
const map={}
await Promise.all(
  order.map(async (o) => {
    try{
      const response = await axios.get(`http://localhost:3000/api/readservice/${o.Service_Id}`,{
        headers: {authorization:token}
      });
      map[o.Service_Id] = response.data.result.Title;
    }catch(err){
      console.log(err)
      map[o.Service_Id] = "ไม่พบบริการ"
      console.log(err.response.data.message)
    }
  })
);
setServiceMap(map);
  }
fetchService()
},[order])





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
  <p className="order-title">รายการงานของฉัน</p>
  <div className="table-order">
    <span>Order ID</span>
    <span>บริการ</span>
    <span>ราคา (บาท)</span>
    <span>วันเริ่มงาน</span>
    <span>วันสิ้นสุด</span>
    <span>สถานะ</span>
  </div>

  {order.map((O) => 
     (
    <div key={O.Order_Id} className="order-card">
      <span>#{O.Order_Id}</span>
      <span>{serviceMap[O.Service_Id] || "กำลังโหลด..."}</span>

      <span>{O.Final_Price.toLocaleString()}</span>
      <span>{new Date(O.Work_Date).toLocaleDateString("th-TH")}</span>
      <span>{new Date(O.Work_Date_End).toLocaleDateString("th-TH")}</span>
      <span>{ShowStatus(O)}</span>
    </div>)
  )}
</div>

</div>


    )
}