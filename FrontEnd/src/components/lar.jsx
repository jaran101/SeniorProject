import { useState } from "react";
import Login from "./Login";
import Register from "./register";
import NewProfile from "./newprofile";
export default function Lar() {
  const [page, setPage] = useState("login");

  return (
    <div className="lar-wrap">
      <div className="lar-card">
        <div className="lar-tab-row">
          <button
            className={`lar-tab ${page === "login" ? "active" : ""}`}
            onClick={() => setPage("login")}
          >
            เข้าสู่ระบบ
          </button>
          <button
            className={`lar-tab ${page === "register" ? "active" : ""}`}
            onClick={() => setPage("register")}
          >
            สมัครสมาชิก
          </button>
        </div>

        <div key={page} className="lar-panel">
          {page === "login" && <Login />}
          {page === "register" && <Register setPage={setPage} />}
        </div>
      </div>
    </div>
  );
}