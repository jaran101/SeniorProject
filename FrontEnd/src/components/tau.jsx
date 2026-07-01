import MyJobsAsTech from "./MyJobsAsTech";
import MyJobsAsUser from "./MyJobsAsUser";
import "./tau.css";
import { useState } from "react";
export default function Tau(){
    const [page, setPage] = useState("MyJobsAsTech");
    return(
    <div  >
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
            <div key={page} className="tau-panel">
              {page === "MyJobsAsTech" && <MyJobsAsTech />}
              {page === "MyJobsAsUser" && <MyJobsAsUser />}
            </div>
        </div>
    )
}