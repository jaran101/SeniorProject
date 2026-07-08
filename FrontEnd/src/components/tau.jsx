import { useState } from "react";
import { memo } from "react";
import MyJobsAsTech from "./MyJobsAsTech";
import MyJobsAsUser from "./MyJobsAsUser";
import "./tau.css";

export default memo(function Tau() {
  // state สำหรับเก็บหน้าที่เลือกแสดงในส่วนงานของฉัน
  const [page, setPage] = useState("MyJobsAsTech");

  return (
    <div>
      {/* แถบเมนูสลับระหว่างงานของฉันในบทบาทต่าง ๆ */}
      <div className="tau-wrap">
        <div className="tau-tab-row">
          <button
            className={`tau-tab ${page === "MyJobsAsTech" ? "active" : ""}`}
            onClick={() => setPage("MyJobsAsTech")}
          >
            งานของฉัน (เป็นเทคนิค)
          </button>
          <button
            className={`tau-tab ${page === "MyJobsAsUser" ? "active" : ""}`}
            onClick={() => setPage("MyJobsAsUser")}
          >
            งานของฉัน (เป็นผู้ใช้งาน)
          </button>
        </div>
      </div>

      {/* แสดงคอมโพเนนต์ตามหน้าที่เลือก */}
      <div key={page} className="tau-panel">
        {page === "MyJobsAsTech" && <MyJobsAsTech />}
        {page === "MyJobsAsUser" && <MyJobsAsUser />}
      </div>
    </div>
  );
})