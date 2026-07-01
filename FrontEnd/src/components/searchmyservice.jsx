import axios from "axios"
import { useEffect, useState } from "react"
import ServiceCreate from "./servicecreate"
import ServiceOption from "./serviceoption"

export default function SearchMyservice() {
  const token = localStorage.getItem("token")
  const userId = JSON.parse(localStorage.getItem("user")).payload.id  // ✅ ย้ายออกมานอก useEffect

  const [data, setData] = useState([])
  const [showCreate, setShowCreate] = useState(false)   // ✅ modal สร้างงาน
  const [showEdit, setShowEdit] = useState(false)       // ✅ modal แก้ไขงาน
  const [serviceId, setServiceId] = useState(0)

  // -----------------------------------------------------
  // ดึงงานของฉัน
  // -----------------------------------------------------
  const fetchMyServices = async () => {   // ✅ แยกเป็น function ใช้ซ้ำได้
    try {
      const response = await axios.get(`http://localhost:3000/api/searchmyservice/${userId}`, {
        headers: { authorization: token }
      })
      setData(response.data.result)
      console.log(response.data.result)

      console.log("UserId=",userId)
    } catch (err) { console.log(err) }
  }

  useEffect(() => {
    fetchMyServices()
  }, [userId])

  // -----------------------------------------------------
  // ลบงาน
  // -----------------------------------------------------
  const handleRemove = async (Service_Id) => {
  console.log("serviceId =", Service_Id);
  console.log(userId)
    try {
      await axios.delete(`http://localhost:3000/api/removeservice/${Service_Id}`, {
        headers: { authorization: token },
        data: { Service_Id: Number(Service_Id),Users_Id:userId
            

         }  // ✅ ใช้ userId ที่ประกาศด้านบน
      })
      alert("ลบงานสำเร็จ")
      setData(prev => prev.filter(item => item.Service_Id !== Service_Id))
      
    } catch (err) {
      console.log(err)
      alert("เกิดข้อผิดพลาด: " + err.response?.data?.msg)
    }
  }
// -----------------------------------------------------
//เปิดหน้าสร้างงาน
// -----------------------------------------------------
const handleCreateService =()=>{
  setShowCreate(true)

}
// -----------------------------------------------------
//สร้างงาน
// -----------------------------------------------------
const handleEditService =()=>{
  console.log(serviceId)
  setShowEdit(true)
}
  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
<div>
<div>
      <p>งานของฉัน{data.length} </p>
      <button onClick={handleCreateService}>สร้างงาน</button>
</div>
        <div className="allservice">
            {data.map((service)=>
            <div className="service" key={service.Service_Id}>
                {service.Image&&(
                    <img src={`http://localhost:3000/uploads/${service.Image}`} 
                        className="imageLL" 
                        alt={service.Title} />)}
                   <div className="datail">
                    <p>{service.Users_Id}</p>
                     <p className="serviceTitle">บริการ{service.Title}</p>
                    <p>ค่าบริการ:{service.Price} บาท</p>
                    <p>รายละเอียด:{service.Description}</p>
                    <p>ประเภทงาน{service.Category}</p>
                   </div>
                      <div className="ButtonTT">
                        <button className="Update"  onClick={
                          ()=>{setServiceId(service.Service_Id)
                          handleEditService()}
                          }>แก้ไข</button>
                        <button className="Cancle" onClick={()=>{
                          console.log("service =", service)
                          console.log("Service_Id =", service.Service_Id)
                          handleRemove(service.Service_Id)}}>ยกเลิก</button>
                      </div>
            </div>
            )}
        </div>
{/*--------------------------------------------------------------------------------*/}
{console.log(showCreate)}
<div >
  {showCreate &&(
<div className="oo">
  <ServiceCreate onClose={() => setShowCreate(false)}
    onCreated={fetchMyServices}
    />
  </div>

)}
</div>
{/*--------------------------------------------------------------------------------*/}
{showEdit &&(
  <div className="oo">
    <ServiceOption onClose={()=> setShowEdit(false)} serviceId={serviceId} />

  </div>
)}


</div>  
)
}