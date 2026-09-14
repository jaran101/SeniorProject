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
  const token = localStorage.getItem("token")
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


const handleStartOrder = async (orderId) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/startorders/${orderId}`,
      {Status: "IN_PROGRESS"},
      { headers: { authorization: token } }
    )
    setTechorder(prev =>
      prev.map(t => t.Order_Id === orderId ? { ...t, Status: "IN_PROGRESS" } : t)
    )
    alert("เริ่มดำเนินการแล้ว")
  } catch (err) {
    console.log(err.response?.data?.message)
  }
}


const handleFinishOrder = async (orderId) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/finishorders/${orderId}`,
      {Status: "WAITING_CONFIRM"},
      { headers: { authorization: token } }
    )
    setTechorder(prev =>
      prev.map(t => t.Order_Id === orderId ? { ...t, Status: "WAITING_CONFIRM" } : t)
    )
    alert("เสร็จสิ้นงานแล้ว")
  } catch (err) {
    console.log(err.response?.data?.message)
  }
}

const handleconfirmorders = async (orderId) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/confirmorders/${orderId}`,
      {Status: "COMPLETED"},
      { headers: { authorization: token } }
    )
    setUserorder(prev =>
      prev.map(t => t.Order_Id === orderId ? { ...t, Status: "COMPLETED" } : t)
    )
    alert("เสร็จสิ้นงานแล้ว")
  } catch (err) {
    console.log(err.response?.data?.message)
  }
}

const handlerejectorders = async (orderId) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/rejectorders/${orderId}`,
      {Status: "CANCELLED"},
      { headers: { authorization: token } }
    )
    setUserorder(prev =>
      prev.map(t => t.Order_Id === orderId ? { ...t, Status: "CANCELLED" } : t)
    )
    alert("ยกเลิกงานแล้ว")
  } catch (err) {
    console.log(err.response?.data?.message)
  }
}



return (
  <div className="tau-wrap">

    <div className="tau-calendar">
      <OrderCalendar />
    </div>

    <div className="tau-content">

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

          {page === "tech" && (
            <Tech
              techorder={techorder}
              onStartOrder={handleStartOrder}
              onFinishOrder={handleFinishOrder}
            />
          )}

          {page === "user" && (
            <User userorder={userorder}
            handleconfirmorders={handleconfirmorders}
            handlerejectorders={handlerejectorders}
            />
          )}

        </div>

      </div>

   

    </div>

  </div>
);

}