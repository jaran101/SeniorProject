import { div } from "framer-motion/client";
import { useState } from "react";


export default function Calendar() {

const [currentDate, setCurrentDate] = useState(new Date());
const today=new Date();
const date=currentDate.getDate();
const month=currentDate.getMonth();
const year=currentDate.getFullYear();
const prevMonth= ()=>setCurrentDate(new Date(year,month-1,date));
const nextMonth= ()=>setCurrentDate(new Date(year,month+1,date));
const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDay = new Date(year, month, 1).getDay();

const isToday= (day) => day===new Date().getDate() && month===new Date().getMonth() && year===new Date().getFullYear();
const getDayCol= (index)=>index%7;
const mounthsNames=[
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
];
const daysNames=[
  "อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"
];

const days=[];
for(let i=0;i<firstDay;i++){
  days.push("");
}
for(let i=1;i<=daysInMonth;i++){
  days.push(i);
}

return (
  <div style={{ padding: "20px" }}>
        <div className="calendar">
            <h1>Calendar</h1>
            <h2>{" วัน" + daysNames[today.getDay()]} {"เดือน" + mounthsNames[month]} {"ปี " + (year + 543)}</h2>

            <button onClick={prevMonth}>Previous Month</button>
            <button onClick={nextMonth}>Next Month</button>
            <div className="weekdays">
              <div>อาทิตย์</div>
              <div>จันทร์</div>
              <div>อังคาร</div>
              <div>พุธ</div> 
              <div>พฤหัสบดี</div>
              <div>ศุกร์</div>
              <div>เสาร์</div>
            </div>
            <div className="days-grid">
              {days.map((day,index)=>(
                <button key={index} className={["day",
                !day ? "empty":"",
                day && isToday(day) ? "today":"",
                day && getDayCol(index)===0 ? "sunday":"",
                day && getDayCol(index)===6 ? "saturday":"",
                  
              ].filter(Boolean).join(" ") }
                disabled={!day}
                
                
                >{day}</button>
              ))}

            </div>

                </div>
        </div>
    );
}