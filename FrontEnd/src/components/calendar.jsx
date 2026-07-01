import { useEffect, useState } from "react"
import axios from "axios"
import "./calendar.css"

export default function Calendar() {
  const [order, setOrder] = useState([]);
  const token = localStorage.getItem("token")
  const userId = Number(localStorage.getItem("id"))
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const firstDayOfMonth = new Date(year, month, 1)
  const startWeekday = firstDayOfMonth.getDay()
  const [selectedDateKey, setSelectedDateKey] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const [techRes, userRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/readtechorder/${userId}`, {
            headers: { authorization: token }
          }),
          axios.get(`http://localhost:3000/api/readorderbyuserid/${userId}`, {
            headers: { authorization: token }
          }),
        ])
        const techOrders = techRes.data.result.map(o => ({ ...o, type: 'tech' }));
        const userOrders = userRes.data.result.map(o => ({ ...o, type: 'user' }));
        setOrder([...techOrders, ...userOrders]);
      } catch (err) {
        console.log(err.response?.data?.message)
      }
    }
    fetchOrder()
  }, [userId])  // ✅ ลบ console.log(cells.length) ออกจากตรงนี้

  // ✅ log แยกข้างนอก ดูค่าได้ทุกครั้งที่ component render
  console.log("mount", month+1)
  console.log(daysInMonth)
  console.log(startWeekday)
  console.log("firstDayOfMonth",firstDayOfMonth.getDay())

  const cells = []
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d))
  }

  console.log(cells.length)  // ✅ ย้ายมา log ตรงนี้แทน (cells มีค่าแล้ว)

  const toDateKey = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  const eventsByDate = {}
  order.forEach((o) => {  // ✅ แก้ orders → order
    if (o.Work_Date) {
      const key = toDateKey(new Date(o.Work_Date))
      if (!eventsByDate[key]) eventsByDate[key] = []
      eventsByDate[key].push(o)
    }
  })

  return (
    <div> 
      

      ปฏิทิน {order.length}
      <p>{year} - {month + 1}</p>
      <div className="oc-grid">
  {cells.map((date, idx) => {
        if (!date) return <div key={`empty-${idx}`} />

        const key = toDateKey(date)
        const dayOrders = eventsByDate[key] || []

        return (
         <button key={key} onClick={() => setSelectedDateKey(key)}>
          {date.getDate()}
          {dayOrders.length > 0 && <span>●</span>}
</button>
        )
  })}
  
      </div>
      {selectedDateKey && (
  <div>
    <p>นัดหมายวันที่ {selectedDateKey}</p>
    {(eventsByDate[selectedDateKey] || []).map((o) => (
      <p key={o.Order_Id}>{o.Service?.Title}</p>
    ))}
  </div>
)}
    </div>
  )
}