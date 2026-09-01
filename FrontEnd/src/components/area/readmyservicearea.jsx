import axios from "axios";
import { useEffect, useState } from "react";
import "./ReadMyServiceArea.css";
import NewServiceArea from "./newservicearea.jsx";
export default function ReadMyServiceArea({ onClose, userId }) {
    const [area, setArea] = useState([]);

    useEffect(() => {
        const fetchMyArea = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/readmyservicearea/${userId}`);

                setArea(response.data.result || []);

            } catch (err) {
                console.error(
                    "Error fetching service area:",
                    err.response?.data?.message || err.message
                );
            }
        };

        if (userId) {
            fetchMyArea();
        }
    }, [userId]);

    const removeservicearea = async(Area_Id)=>{
        try{
            const response = await axios.delete(`http://localhost:3000/api/removeservicearea/${Area_Id}`)
            
            setArea(prev => prev.filter(a => a.Area_Id !== Area_Id));

        }catch(error){
            console.log(error.response.data.message)
        }
    }


    return (
        <div className="readmyservicearea-container">

            <button className="close-button" onClick={onClose}>
                X
            </button>
            <p>พื้นที่ให้บริการของคุณ</p>
            <div className="area-container">
                {area.length > 0 ? (
                    area.map((item) => (
                        <div
                            className="data"
                            key={item.Area_Id}
                        >
                            <p>{item.Province} <button onClick={()=>{removeservicearea(item.Area_Id)}}>ลบ</button></p>
                        </div>
                    ))
                ) : (
                    <p className="no-area">
                        ยังไม่มีพื้นที่ให้บริการ
                    </p>
                )}
            </div>
                <NewServiceArea userId={userId} setArea={setArea} existingAreas={area}/>
        </div>
    );
}