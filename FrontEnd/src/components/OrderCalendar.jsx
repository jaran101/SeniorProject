import axios from "axios"
import { useEffect, useState, useMemo } from "react"


function buildMonthGrid(year, month) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const daysInMonth = lastDay.getDate()
    const startWeekday = firstDay.getDay()

    const cells = []
    for (let i = 0; i < startWeekday; i++) {
        cells.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day)
        const dateKey = dateObj.toISOString().split("T")[0]
        cells.push({ day, dateKey })
    }
    return cells
}

function chunkIntoWeeks(cells) {
    const weeks = []
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7))
    }
    return weeks
}



function getDatesInRange(startDate, endDate) {
    const dates = []
    let current = new Date(startDate)
    const end = new Date(endDate)
   
    while (current <= end) {
        dates.push(current.toISOString().split("T")[0])
        current.setDate(current.getDate() + 1)
    }
    return dates
}

function buildCalendarMap(orders) {
    const map = {}
    orders.forEach((order) => {
        const dates = getDatesInRange(order.Work_Date, order.Work_Date_End)
        dates.forEach((date) => {
            if (!map[date]) {
                map[date] = []
            }
            map[date].push(order)
        })
    })
    return map
}




export default function OrderCalendar() {
    const [techorders, setTechorders] = useState([])
    const [userorders, setUserorders] = useState([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)
    
    useEffect( ()=>{
      const token = localStorage.getItem("token")
        const id = JSON.parse(localStorage.getItem("user"))?.payload?.id

       const fethAll = async()=>{
         try{
          const [techRes, userRes] = await Promise.all([
            axios.get(`http://localhost:3000/api/readtechorder/${id}`,
                {headers:{authorization:token}
            }), 
            axios.get(`http://localhost:3000/api/readorderbyuserid/${id}`,
                {headers:{authorization:token}
            })
          ])

          setTechorders(techRes.data.result)
          setUserorders(userRes.data.result)
        }catch(err){
          console.log(err.response.data.message)
        }
       }
            
       fethAll() 
    },[]) 


       const allOrders = useMemo(() => {
        const tagged1 = techorders.map((o) => ({ ...o, role: "tech" }))
        const tagged2 = userorders.map((o) => ({ ...o, role: "user" }))
        return [...tagged1, ...tagged2]
    }, [techorders, userorders])


        const calendarMap = useMemo(() => buildCalendarMap(allOrders), [allOrders])

        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const cells = useMemo(() => buildMonthGrid(year, month), [year, month])
        const weeks = useMemo(() => chunkIntoWeeks(cells), [cells])

        const goPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
        const goNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))


   return (
    <div>
        <div>
            <button onClick={goPrevMonth}>{"<"}</button>
            <span>{year}-{month + 1}</span>
            <button onClick={goNextMonth}>{">"}</button>
        </div>

    <table>
        <thead>
            <tr>
                <th>อาทิตย์</th>
                <th>จันทร์</th>
                <th>อังคาร</th>
                <th>พุธ</th>
                <th>พฤหัส</th>
                <th>ศุกร์</th>
                <th>เสาร์</th>
            </tr>
        </thead>
    </table>



        <tbody>
    {weeks.map((week, weekIndex) => (
        <tr key={weekIndex}>
            {week.map((cell, cellIndex) => {
                if (!cell) {
                    return <td key={`empty-${weekIndex}-${cellIndex}`}></td>
                }

                const ordersToday = calendarMap[cell.dateKey] || []

                return (
                    <td
                        key={cell.dateKey}
                        onClick={() => setSelectedDate(cell.dateKey)}
                        style={{ cursor: "pointer", border: "1px solid #ccc", padding: "8px" }}
                    >
                        <div>{cell.day}</div>
                        {ordersToday.length > 0 && <>●</>}
                    </td>
                )
            })}
        </tr>
    ))}
</tbody>
    </div>
)
}