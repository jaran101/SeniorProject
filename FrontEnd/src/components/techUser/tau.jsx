import { useState ,useEffect } from "react";
import axios from "axios"
import Tech from "./tech";
import User from "./user";
import Map from "../map/CustomerMap.jsx";
import OrderCalendar from "../OrderCalendar.jsx"
import "./tau.css";
export default function Tau() {
  const [page, setPage] = useState("tech");


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

  return (
    <div className="tau-wrap">
      <OrderCalendar/>
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
          {page === "tech" && <Tech techorder={techorder} />}
          {page === "user" && <User userorder={userorder} />}
        </div>
      </div>
    </div>
  );
}