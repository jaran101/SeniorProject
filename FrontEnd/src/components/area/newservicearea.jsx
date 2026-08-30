import axios from "axios";
import { useEffect, useState } from "react";

export default function NewServiceArea({ userId, setArea ,existingAreas }) {
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [loading, setLoading] = useState(false);

    // =========================
    // ดึงข้อมูลจังหวัด
    // =========================
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/readprovinces"
                );

                setProvinces(response.data.result || []);

            } catch (error) {
                console.error(
                    "Error fetching provinces:",
                    error.response?.data?.message || error.message
                );
            }
        };

        fetchProvinces();
    }, []);

    // =========================
    // เพิ่มพื้นที่ให้บริการ
    // =========================
    const handleCreateServiceArea = async () => {

        // ป้องกันกรณียังไม่ได้เลือกจังหวัด
        if (!selectedProvince) {
            alert("กรุณาเลือกจังหวัด");
            return;
        }

        // ป้องกันกรณีไม่มี userId
        if (!userId) {
            alert("ไม่พบ User ID");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:3000/api/newservicearea",
                {
                    Users_Id: userId,
                    Province: selectedProvince,
                }
            );

            console.log(
                "Service area created:",
                response.data.result
            );

            alert(
                response.data.message || "เพิ่มพื้นที่ให้บริการสำเร็จ"
            );

            // ล้างจังหวัดหลังบันทึกสำเร็จ
            setSelectedProvince("");
            setArea((prev) => [...prev, response.data.result]);

        } catch (error) {
            console.error(
                "Error creating service area:",
                error.response?.data?.message || error.message
            );

            alert(
                error.response?.data?.message ||
                "เกิดข้อผิดพลาดในการเพิ่มพื้นที่ให้บริการ"
            );

        } finally {
            setLoading(false);
        }
    };

      const availableProvinces = provinces.filter(
        (province) => !existingAreas.some((area) => area.Province === province.Name)
    );


    return (
        <div className="new-service-area">

            <h2>เพิ่มพื้นที่ให้บริการ</h2>

            {/* เลือกจังหวัด */}
            <select
                className="inputMap-province"
                value={selectedProvince}
                onChange={(e) => {
                    setSelectedProvince(e.target.value);
                }}
                disabled={loading}
            >
                <option value="">
                    เลือกจังหวัด
                </option>

                {availableProvinces.map((province) => (
                    <option
                        key={province.Province_Id}
                        value={province.Name}
                    >
                        {province.Name}
                    </option>
                ))}
            </select>

            {/* แสดงข้อมูลที่เลือก */}
            <div className="data">
                <p>
                    จังหวัดที่เลือก:{" "}
                    <strong>
                        {selectedProvince || "-"}
                    </strong>
                </p>
            </div>

            {/* ปุ่มยืนยัน */}
            <button
                onClick={handleCreateServiceArea}
                disabled={loading || !selectedProvince}
            >
                {loading ? "กำลังบันทึก..." : "ยืนยัน"}
            </button>

        </div>
    );
}