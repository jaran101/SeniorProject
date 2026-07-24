import axios from "axios"
import { useEffect, useState } from "react"
import "./tech.css"

export default function User({ userorder }) {
    const [servicelist, setServicelist] = useState({})
    const [profilelist, setProfilelist] = useState({})
    const token = localStorage.getItem("token")
    
    function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("th-TH", { 
    day: "2-digit", month: "2-digit", year: "numeric" 
  });
}
    
    
    useEffect(() => {
        const fetchservice = async () => {
            const results = await Promise.all(
                userorder.map((order) =>
                    Promise.all([
                        axios.get(`http://localhost:3000/api/readservice/${order.Service_Id}`),
                        axios.get(`http://localhost:3000/api/readprofile/${order.Tech_Id}`, {
                            headers: { authorization: token }
                        })
                    ])
                )
            )

            const serviceMap = {}
            const profileMap = {}

            results.forEach(([serviceRes, profileRes]) => {
                const service = serviceRes.data.result
                const profile = profileRes.data.result
                serviceMap[service.Service_Id] = service
                profileMap[profile.Users_Id] = profile
            })

            setServicelist(serviceMap)
            setProfilelist(profileMap)
        }
        fetchservice()
    }, [userorder])

    return (
        <div>
            <h1>User</h1>
            <table>
                <thead>
                    <tr>
                        <th>order</th>
                        <th>service</th>
                        <th>status</th>
                        <th>Tech</th>
                        <th>เริ่มงาน</th>
                        <th>เสร็จงาน</th>
                     
                    </tr>
                </thead>
                <tbody>
                    {userorder.map((order) => (
                        <tr key={order.Order_Id}>
                            <td>{order.Order_Id}</td>
                            <td>{servicelist[order.Service_Id]?.Title}</td>
                            <td>{order.Status}</td>
                            <td>{profilelist[order.Tech_Id]?.First_Name}</td>
                            <td>{formatDate(order.Work_Date)}</td>
                            <td>{formatDate(order.Work_Date_End)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}