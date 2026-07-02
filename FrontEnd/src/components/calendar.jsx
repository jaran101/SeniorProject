import { useEffect, useState } from "react";
import axios from "axios";
import "./calendar.css";

export default function Calendar() {
  const [order, setOrder] = useState([]);
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("id"));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay();
  const [selectedDateKey, setSelectedDateKey] = useState(null);

useEffect(() => {
  const fetchOrder = async () => {
    try {
      // ขั้นที่ 1 — ดึง order ฝั่งช่าง
      const techRes = await axios.get(`http://localhost:3000/api/readtechorder/${userId}`, {
        headers: { authorization: token }
      })

      // ขั้นที่ 2 — ดึง order ฝั่งลูกค้า
      const userRes = await axios.get(`http://localhost:3000/api/readorderbyuserid/${userId}`, {
        headers: { authorization: token }
      })

      // ขั้นที่ 3 — แปะ type ว่ามาจากฝั่งไหน
      const techOrders = techRes.data.result.map(o => ({ ...o, type: 'tech' }))
      const userOrders = userRes.data.result.map(o => ({ ...o, type: 'user' }))

      // ขั้นที่ 4 — รวมทั้งสองเข้าด้วยกัน แล้วเก็บใน state
      const allOrders = [...techOrders, ...userOrders]
      setOrder(allOrders)

      console.log("order ทั้งหมด:", allOrders)
    } catch (err) {
      console.log(err.response?.data?.message)
    }
  }

  fetchOrder()
}, [userId])

  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  const toDateKey = (date) => {
    const yearValue = date.getFullYear();
    const monthValue = String(date.getMonth() + 1).padStart(2, "0");
    const dayValue = String(date.getDate()).padStart(2, "0");

    return `${yearValue}-${monthValue}-${dayValue}`;
  };

  const eventsByDate = {};
  order.forEach((orderItem) => {
    if (orderItem.Work_Date) {
      const key = toDateKey(new Date(orderItem.Work_Date));
      if (!eventsByDate[key]) {
        eventsByDate[key] = [];
      }
      eventsByDate[key].push(orderItem);
    }
  });

  return (
    <div>
      ปฏิทิน {order.length}
      <p>
        {year} - {month + 1}
      </p>
      <div className="oc-grid">
        {cells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const key = toDateKey(date);
          const dayOrders = eventsByDate[key] || [];

          return (
            <button key={key} onClick={() => setSelectedDateKey(key)}>
              {date.getDate()}
              {dayOrders.length > 0 && <span>●</span>}
            </button>
          );
        })}
      </div>
      {selectedDateKey && (
        <div>
          <p>นัดหมายวันที่ {selectedDateKey}</p>
          {(eventsByDate[selectedDateKey] || []).map((orderItem) => (
            <p key={orderItem.Order_Id}>{orderItem.Service?.Title}</p>
          ))}
        </div>
      )}
    </div>
  );
}