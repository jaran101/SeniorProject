import { useLocation,useNavigate  } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./DetailOrder.css";
import "leaflet/dist/leaflet.css";

import {MapContainer,TileLayer,Marker,Popup,useMap,useMapEvents,} from "react-leaflet";
// ========================================
// Recenter Map
// ========================================

function RecenterMap({ position, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom);
  }, [position, zoom, map]);

  return null;
}

// ========================================
// Zoom Tracker
// ========================================

function ZoomTracker({ onZoomChange }) {
  const map = useMapEvents({
    zoomend: () => {
      const currentZoom = map.getZoom();
      onZoomChange(currentZoom);
    },
  });
  return null;
}

// ========================================
// Detail Order
// ========================================
export default function DetailOrder() {
  const location = useLocation();
  const { order } = location?.state || {};
  const [zoom, setZoom] = useState(13);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [position, setPosition] = useState([lat, lng]);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  // ========================================
  // Format Date
  // ========================================
  function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(
      "th-TH",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }
  // ========================================
  // Fetch Customer
  // ========================================

  useEffect(() => {
    if (!order?.User?.Users_Id) return;
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/readprofile/${order.User.Users_Id}`,
          {
            headers: {
              authorization: token,
            },
          }
        );
        setUser(response.data.result);
        console.log(
          "User:",
          response.data.result
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();

}, [order?.User?.Users_Id, token]);


  // ========================================
  // Fetch Address
  // ========================================

  useEffect(() => {

    if (!user?.Users_Id) return;


    const fetchAddress = async () => {

      try {

        const response = await axios.get(
          `http://localhost:3000/api/readmyaddresses/${user.Users_Id}`
        );
        setAddress(
          response?.data?.result || []
        );

        if (
          !response?.data?.result ||
          response.data.result.length === 0
        ) {
          console.log("No addresses found");
          return;
        }
        const newLat = response?.data?.result[0].Latitude;
        const newLng = response?.data?.result[0].Longitude;
        setLat(newLat)
        setLng(newLng)
        setPosition([newLat, newLng])
        console.log(
          "Address:",
          response.data.result
        );

      } catch (err) {

        console.log(err);

      }

    };


    fetchAddress();

  }, [user?.Users_Id]);


  // ========================================
  // Render
  // ========================================


  const handleViewBoq = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/readboqorder/${order.Order_Id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log("Response:",response.data.result)
      navigate("/BOQPreview", {
        state: {
          items: mapItemsForPdf(response?.data?.result?.Items || []),
        },
      });
    } catch (err) {
    const message = err.response?.data?.message || err.message;
    console.log(message)
    alert(message || "ยังไม่มีใบเสนอราคาสำหรับงานนี้")
    }
  };


  function mapItemsForPdf(items) {
    return items.map((item) => ({
      id: item?.BOQ_Item_Id,
      name: item?.Name,
      unit: item?.Unit,
      quantity: item?.Quantity,
      unitPrice: item?.Unit_Price,
    }));
  }


  return (

    <div className="detail-order-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="detail-order-header">
        <div>
          <h1>
            รายละเอียดงาน
          </h1>
          <p className="header-subtitle">
            รายละเอียดคำสั่งซื้อและข้อมูลลูกค้า
          </p>
        </div>
        <div className="order-id">
          #{order.Order_Id}
        </div>
      </div>
      {/* =====================================
          INFORMATION
      ===================================== */}
      <div className="detail-order-container">
        {/* =================================
            ORDER INFORMATION
        ================================= */}
        <div className="order-card">
          <div className="card-header">
            <h2>
              ข้อมูลงาน
            </h2>
          </div>
          <div className="card-body">
            <div className="info-item">
              <span className="info-label">
                หมายเลขคำสั่งซื้อ
              </span>
              <span className="info-value order-number">
                #{order.Order_Id}
              </span>

              <button
              onClick={handleViewBoq}
              className="view-boq-button"
            >
              ดูใบ BOQ
            </button>
            
            </div>
            {/* Service */}
            <div className="info-item">
              <span className="info-label">
                บริการ
              </span>
              <span className="info-value">
                {order.Service?.Title || "-"}
              </span>
            </div>
            {/* Description */}
            <div className="description-item">
              <span className="info-label">
                รายละเอียดงาน
              </span>
              <div className="description">
                {order.Service?.Description || "-"}
              </div>
            </div>
            {/* Date */}

            <div className="date-grid">
              <div className="date-box">
                <span className="info-label">
                  วันที่เริ่มงาน
                </span>
                <strong>
                  {formatDate(
                    order.Work_Date
                  )}
                </strong>
              </div>
              <div className="date-box">
                <span className="info-label">
                  วันที่เสร็จงาน
                </span>
                <strong>
                  {formatDate(
                    order.Work_Date_End
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>
        {/* =================================
            CUSTOMER INFORMATION
        ================================= */}

        <div className="customer-card">
          <div className="card-header">
            <h2>
              ข้อมูลลูกค้า
            </h2>
          </div>
          <div className="customer-body">
            {/* Customer Profile */}
            <div className="customer-profile">
              {user?.Avatar ? (
                <img
                  src={`http://localhost:3000/uploads/${user.Avatar}`}
                  alt="Customer Avatar"
                  className="image-customer"
                />
              ) : (
                <div className="avatar-placeholder">
                  ?
                </div>
              )}
              <div className="customer-info">
                <h3>
                  {user?.First_Name || "-"}{" "}
                  {user?.Last_Name || ""}
                </h3>
                <p>
                  {user?.Phone || "-"}
                </p>
              </div>
            </div>
            {/* Address */}
            <div className="address-section">
              <h3>
                ที่อยู่ลูกค้า
              </h3>
              {address.length > 0 ? (
                address.map((item) => (
                  <div
                    key={item.Address_Id}
                    className="address-box"
                  >
                    <p>
                      <strong> จังหวัด </strong>
                      <span> {item.Province || "-"}
                      </span>
                    </p>
                    <p>
                      <strong> อำเภอ </strong>
                      <span> {item.District || "-"} </span>
                    </p>
                    <p>
                      <strong> ตำบล </strong>
                      <span>
                        {item.Subdistrict || "-"}
                      </span>
                    </p>
                    <p>
                      <strong> ที่อยู่ </strong>
                      <span> {item.Address || "-"} </span>
                    </p>
                  </div>
                ))

              ) : (
                <p className="no-address">
                  ไม่พบข้อมูลที่อยู่
                </p>
              )}
            </div>
          </div>
        </div>
     </div>



      {/* =====================================
          MAP
      ===================================== */}

      <div className="map-card">
        <div className="card-header">
          <div>
            <h2>
              ตำแหน่งงาน
            </h2>

            <p className="map-subtitle">
              คลิกบนแผนที่เพื่อเลือกตำแหน่ง
            </p>
          </div>
        </div>
        <div className="MapCon">
             {lat !== null && lng !== null ? (
          <MapContainer
            center={position}
            zoom={zoom}
            className="map-container"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                ตำแหน่งงาน
              </Popup>
            </Marker>
            <RecenterMap
              position={position}
              zoom={zoom}
            />
            <ZoomTracker
              onZoomChange={setZoom}
            />
          </MapContainer>
            ) : (
          <div className="map-placeholder">
            กรุณาระบุที่อยู่ลูกค้าก่อน
          </div>
        )}
        </div>
      </div>
    </div>

  );
}