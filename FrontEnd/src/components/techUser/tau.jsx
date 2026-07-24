import { useState ,useEffect } from "react";
import axios from "axios"
import Tech from "./tech";
import User from "./user";
export default function Tau() {
  const [page, setPage] = useState("tech");


  const [techorder, setTechorder] = useState([])
  const [userorder, setUserorder] = useState([])

  const [id,setId] = useState()


  
  useEffect(() => {

    const token = localStorage.getItem("token")
    const localid = JSON.parse(localStorage.getItem("user"))?.payload?.id;
    setId(localid)
    const fetchTechorder = async () => {
      try {

        const res = await axios.get(`http://localhost:3000/api/readtechorder/${id}`, {
          headers: { authorization: token }
        })
        setTechorder(res.data.result)
        console.log("tech",res.data.result)
      } catch (err) {
        console.log(err.res.data.message)
      }
    }
    fetchTechorder()

  }, [id])

  useEffect(() => {

    const fetchUserorder = async () => {
      const token = localStorage.getItem("token")
      const localid = JSON.parse(localStorage.getItem("user"))?.payload?.id;
      setId(localid)
      try {
        const res = await axios.get(`http://localhost:3000/api/readorderbyuserid/${id}`, {
          headers: { authorization: token }
        })
        setUserorder(res.data.result)
        console.log("user",res.data.result)
      } catch (err) {
        console.log(err.res.data.message)
      }
    }
    fetchUserorder()

  }, [id])

  return (
    <div className="lar-wrap">
      <div className="lar-card">
        <div className="lar-tab-row">
          <button
            className={`lar-tab ${page === "tech" ? "active" : ""}`}
            onClick={() => setPage("tech")}
          >
            ช่าง
          </button>
          <button
            className={`lar-tab ${page === "user" ? "active" : ""}`}
            onClick={() => setPage("user")}
          >
            ผู้ใช้
          </button>
        </div>

        <div key={page} className="lar-panel">
          {page === "tech" && <Tech techorder={techorder} />}
          {page === "user" && <User userorder={userorder} />}
        </div>
      </div>
    </div>
  );
}