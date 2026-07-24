import axios from "axios"
import { useEffect, useState } from "react"
import "./tech.css"

export default function Tech({ techorder }) {
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
                techorder.map((order) =>
                    Promise.all([
                        axios.get(`http://localhost:3000/api/readservice/${order.Service_Id}`),
                        axios.get(`http://localhost:3000/api/readprofile/${order.Users_Id}`, {
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
    }, [techorder])

    return (
        <div>
            <h1>Tech</h1>
            <table>
                <thead>
                    <tr>
                        <th>order</th>
                        <th>service</th>
                        <th>status</th>
                        <th>customer</th>
                        <th>เริ่มงาน</th>
                        <th>เสร็จงาน</th>
                    </tr>
                </thead>
                <tbody>
                    {techorder.map((order) => (
                        <tr key={order.Order_Id}>
                            <td>{order.Order_Id}</td>
                            <td>{servicelist[order.Service_Id]?.Title}</td>
                            <td>{order.Status}</td>
                            <td>{profilelist[order.Users_Id]?.First_Name}</td>
                            <td>{formatDate(order.Work_Date)}</td>
                            <td>{formatDate(order.Work_Date_End)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}