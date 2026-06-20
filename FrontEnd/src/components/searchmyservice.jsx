import axios from "axios";
import { useEffect, useState } from "react";
import ServiceCreate from "./servicecreate";
import ServiceOption from "./serviceoption";
import { header } from "framer-motion/client";



export default function SearchMyservice(){
const [data,setData]=useState([])
const [show,setShow]=useState(false)
const [shoW,setShoW]=useState(false)
const [serviceId,setServiceId]=useState(0);



useEffect(()=>{
    const token = localStorage.getItem("token")
    const id = JSON.parse(localStorage.getItem("user")).payload.id
    const handleMyservice=async()=>{
        try{
            const response = await axios.get(`http://localhost:3000/api/searchmyservice/${id}`,{
                headers:{
                    authorization:token
                }
            })
            setData(response.data.result)
        }catch(err){
            console.log(err)
        }
    }
    handleMyservice()
},[])

const id = JSON.parse(localStorage.getItem("user")).payload.id
const handleRemove = async (serviceId) => {
            const token = localStorage.getItem("token")
    try{
        const response = await axios.delete(`http://localhost:3000/api/removeservice/${serviceId}`,{
            headers:{authorization: token},
            data: { Users_Id: id }
        })
        alert("ลบงานสำเร็จ")
        window.location.reload()
    }catch(err){
        console.log(err)
        console.log("error:", err.response?.data)
        alert("เกิดข้อผิดพลาด: " + err.response?.data?.msg)
    }
}
return(
        <div>
            <div className="newservice">
                <p>งานของฉัน {data.length} รายการ</p>
             <button onClick={()=>setShow(!show)} className="buttonNw">            
            {show ? "สร้างงานใหม่" : "สร้างงานใหม่"}
            </button>
            
            </div>

            {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
             <button className="modal-close" onClick={() => setShow(false)}>✕</button>
             <ServiceCreate />
             </div>
            </div>
                    )}
            <div className="main">
                {data.map((service)=>
                    <div key={service.Service_Id} className="boxQ">
                        {service.Image && (
                        <img src={`http://localhost:3000/uploads/${service.Image}`} className="img1" alt={service.Title} />
                        )}
                        <p>{service.Title}</p>
                        <p>{service.Description}</p>
                        <p>{service.Price} บาท</p>
                        <button  className="button2" onClick={(e) => { 
                            e.stopPropagation(); // กัน handleclick ของ card ไม่ให้ทำงานซ้อน 
                            setServiceId(service.Service_Id);setShoW(true);}}>
                                แก้ไข
                                </button><br />
                                <button className="button2" onClick={(e) =>(handleRemove(service.Service_Id))}>ลบงาน</button>
                    </div>
                    )}
            </div>
                    {shoW && (
        <div className="modal-overlay" onClick={() => setShoW(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
             <button className="modal-close" onClick={() => setShoW(false)}>✕</button>
             <ServiceOption serviceId={serviceId} />
             </div>
            </div>
                    )}
                  <br />      
            </div>
    )

}