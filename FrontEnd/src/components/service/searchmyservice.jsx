
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ServiceCreate from "./servicecreate";
import ServiceOption from "./serviceoption";
import Readmyservicearea from "../area/readmyservicearea";
import "./SearchMyservice.css";

export default function SearchMyservice() {
  const token = localStorage.getItem("token");

  const [userId] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return user?.payload?.id ?? null;
    } catch {
      return null;
    }
  });

  const [data, setData] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [showArea, setShowArea] = useState(false);

  // ดึงรายการบริการของฉัน
  const fetchMyServices = useCallback(async () => {
    if (!userId || !token) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/searchmyservice/${userId}`,
        {
          headers: { authorization: token },
        }
      );

      setData(response.data.result ?? []);
    } catch (err) {
      console.error("ไม่สามารถดึงรายการบริการได้:", err);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchMyServices();
  }, [fetchMyServices]);

  // ยกเลิกบริการ
  const handleRemove = async (id) => {
    const confirmed = window.confirm(
      "คุณต้องการยกเลิกบริการนี้ใช่หรือไม่?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/removeservice/${id}`,
        {
          headers: { authorization: token },
          data: {
            Service_Id: Number(id),
            Users_Id: userId,
          },
        }
      );

      setData((prev) =>
        prev.filter(
          (item) => String(item.Service_Id) !== String(id)
        )
      );

      alert("ยกเลิกบริการสำเร็จ");
    } catch (err) {
      console.error(err);
      alert(
        "เกิดข้อผิดพลาด: " +
          (err.response?.data?.msg || "กรุณาลองใหม่อีกครั้ง")
      );
    }
  };

  // เปิดหน้าแก้ไขบริการ
  const handleEdit = (id) => {
    setServiceId(id);
    setShowEdit(true);
  };

  return (
    <div className="myServicePage">
      {/* ส่วนหัว */}
      <div className="serviceHeader">
        <div className="serviceHeaderInfo">
          <h2>งานของฉัน</h2>
          <p>จัดการบริการและรายละเอียดงานของคุณ</p>
        </div>

        <div className="serviceHeaderActions">
          <button
            type="button"
            className="areaButton"
            onClick={() => setShowArea(true)}
          >
            พื้นที่ให้บริการ
          </button>

          <button
            type="button"
            className="createButton"
            onClick={() => setShowCreate(true)}
          >
            <span aria-hidden="true">+</span> สร้างบริการ
          </button>
        </div>
      </div>

      {/* จำนวนบริการ */}
      <div className="serviceCount">
        รายการบริการทั้งหมด{" "}
        <span>{data.length}</span> รายการ
      </div>

      {/* รายการการ์ด */}
      {data.length > 0 ? (
        <div className="allservice">
          {data.map((service) => (
            <article
              className="service"
              key={service.Service_Id}
            >
              <div className="serviceImageWrapper">
                {service.Image ? (
                  <img
                    src={`http://localhost:3000/uploads/${service.Image}`}
                    className="imageLL"
                    alt={service.Title || "รูปบริการ"}
                    loading="lazy"
                  />
                ) : (
                  <div className="serviceImagePlaceholder">
                    ไม่มีรูปภาพบริการ
                  </div>
                )}

                <span className="serviceCategory">
                  {service.Category || "บริการทั่วไป"}
                </span>
              </div>

              <div className="serviceContent">
                <p className="serviceId">
                  รหัสบริการ #{service.Service_Id}
                </p>

                <h3 className="serviceTitle">
                  {service.Title || "ไม่ระบุชื่อบริการ"}
                </h3>

                <div className="servicePrice">
                  <span>ค่าบริการ</span>
                  <strong>
                    {Number(service.Price || 0).toLocaleString("th-TH")}
                    {" "}บาท
                  </strong>
                </div>

                <div className="serviceDescription">
                  <span className="detailLabel">
                    รายละเอียดบริการ
                  </span>
                  <p>
                    {service.Description || "ไม่มีรายละเอียด"}
                  </p>
                </div>
              </div>

              <div className="ButtonTT">
                <button
                  type="button"
                  className="Update"
                  onClick={() => handleEdit(service.Service_Id)}
                >
                  แก้ไข
                </button>

                <button
                  type="button"
                  className="Cancel"
                  onClick={() => handleRemove(service.Service_Id)}
                >
                  ยกเลิก
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="emptyServices">
          <div className="emptyServiceIcon">+</div>
          <h3>ยังไม่มีบริการของคุณ</h3>
          <p>
            เริ่มต้นสร้างบริการเพื่อให้ลูกค้าสามารถค้นหาและติดต่อคุณได้
          </p>
          <button
            type="button"
            className="createButton"
            onClick={() => setShowCreate(true)}
          >
            สร้างบริการแรกของคุณ
          </button>
        </div>
      )}

      {/* Modal สร้างบริการ */}
      {showCreate && (
        <div className="oo">
          <ServiceCreate
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              fetchMyServices();
              setShowCreate(false);
            }}
          />
        </div>
      )}

      {/* Modal แก้ไขบริการ */}
      {showEdit && (
        <div className="oo">
          <ServiceOption
            onClose={() => setShowEdit(false)}
            serviceId={serviceId}
          />
        </div>
      )}

      {/* Modal พื้นที่ให้บริการ */}
      {showArea && (
        <div className="oo">
          <Readmyservicearea
            onClose={() => setShowArea(false)}
            userId={userId}
          />
        </div>
      )}
    </div>
  );
}
