import axios from "axios"
import { useEffect, useState } from "react"

export default function ListService() {
  const [data, setData] = useState([])

  useEffect(() => {
    const handleAll = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/listservice")  
        setData(response.data.result)  // ดึง ข้อมูล ออกมา
        console.log(response.data)
      } catch (error) {
        console.log(error.response?.data?.message)
      }
    }
    handleAll()
  }, [])

  return (
    <>
      {data.map((service) => (
        <div key={service.Service_Id}>
          <p>{service.Title}</p>
          <p>{service.Description}</p>
          <p>{service.Price} บาท</p>
          {service.Image && (
            <img src={`http://localhost:3000/uploads/${service.Image}`} width={150} alt={service.Title} />
          )}
        </div>
      ))}
    </>
  )
}