import { useState ,useEffect } from "react";
import axios from "axios"
import Tech from "./tech";
import User from "./user";
import OrderMap from "../map/OrderMap.jsx";
import OrderCalendar from "../OrderCalendar.jsx"
import "./tau.css";
export default function Tau() {
  const [page, setPage] = useState("tech");
  const [locations, setLocations] = useState(null)

  const [techorder, setTechorder] = useState([])
  const [userorder, setUserorder] = useState([])

  const [id,setId] = useState()


  
useEffect(() => {
  const token = localStorage.getItem("token")
  const localid = JSON.parse(localStorage.getItem("user"))?.payload?.id;
  setId(localid) // เก็บไว้เผื่อใช้ที่อื่น แต่ไม่ใช้เป็นตัวกระตุ้น fetch แล้ว

  if (!localid) return // กัน edge case กรณียังไม่ login

  const fetchTechorder = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/readtechorder/${localid}`, {
        headers: { authorization: token }
      })
      setTechorder(res.data.result)
    } catch (err) {
      console.log(err.response?.data?.message)
    }
  }
  fetchTechorder()

}, []) // ทำงานครั้งเดียวตอน mount พอ

  useEffect(() => {

    const fetchUserorder = async () => {
      const token = localStorage.getItem("token")
      const localid = JSON.parse(localStorage.getItem("user"))?.payload?.id;
      setId(localid)

      if (!localid) return

      try {
        const res = await axios.get(`http://localhost:3000/api/readorderbyuserid/${localid}`, {
          headers: { authorization: token }
        })
        setUserorder(res.data.result)
        console.log("user",res.data.result)
      } catch (err) {
        console.log(err.response?.data?.message)
      }
    }
    fetchUserorder()

  }, [id])


const handleViewPosition = async (usersId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/readmyaddresses/${usersId}`)
    const addresses = response.data.result
    const defaultAddress = addresses.find(a => a.Is_Default) || addresses[0]

    if (!defaultAddress) {
      console.error("ลูกค้าคนนี้ยังไม่มีที่อยู่บันทึกไว้")
      alert("ลูกค้าคนนี้ยังไม่มีที่อยู่บันทึกไว้")
      return
    }

    setLocations([defaultAddress.Latitude, defaultAddress.Longitude])
  } catch (err) {
    console.error(err.response?.data?.message || err.message)
  }
};






  return (
    <div className="tau-wrap">
      <OrderCalendar/>
<div>
{/* ---------------------------------------------------------------------------------------------------------- */}
      <div className="tau-card">
        <div className="tau-tab-row">
          <button
            className={`tau-tab ${page === "tech" ? "active" : ""}`}
            onClick={() => setPage("tech")}
          >
            ช่าง
          </button>
          <button
            className={`tau-tab ${page === "user" ? "active" : ""}`}
            onClick={() => setPage("user")}
          >
            ผู้ใช้
          </button>
        </div>

        <div key={page} className="tau-panel">
          {page === "tech" && <Tech techorder={techorder} onViewPosition={handleViewPosition} />}
          {page === "user" && <User userorder={userorder} />}
        </div>
        
      </div>
{/* ---------------------------------------------------------------------------------------------------------- */}
<div className="order-map-wrap"> <OrderMap selectedPosition={locations} /> </div></div>
    </div>
  );
}