import { useState, useEffect } from "react";
import axios from "axios";
import "./ServiceCreate.css";

export default function ServiceOption({ serviceId ,onClose }) {
  const data = localStorage.getItem("user");
  const id = JSON.parse(data).payload.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setCategory] = useState("");

  // โหลดข้อมูลเดิมมาใส่ฟอร์ม
  useEffect(() => {
    if (!serviceId) return;
    const token = localStorage.getItem("token");
    const fetchService = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/readservice/${serviceId}`,
          { headers: { authorization: token } }
        );
        const s = response.data.result;
        setTitle(s.Title);
        setDescription(s.Description);
        setPrice(s.Price);
        console.log("ser",serviceId)
        setCategory(s.Category);
        if (s.Image) {
          setPreviewUrl(`http://localhost:3000/uploads/${s.Image}`);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpdateService = async () => {
    const token = localStorage.getItem("token");
    if (!title || !description || !price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const formData = new FormData();
    formData.append("Users_Id", id);
    formData.append("Service_Id", serviceId);
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("Price", price);
    formData.append("Category", category);
    if (image) formData.append("file", image);

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/updateservice`,formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: token,
          },
        }
      );
      console.log(response.data);
      alert("แก้ไขงานสำเร็จ");
      window.location.reload();
    } catch (err) {
      console.log(err);
      console.log("error:", err.response?.data);
      alert("เกิดข้อผิดพลาด: " + err.response?.data?.msg);
    }
  };

  return (
    <div className="div1">
      <p>แก้ไขงาน (ID: {serviceId})</p>
      <button onClick={onClose}>X</button>
      <input className="input1" type="text" placeholder="ชื่องาน" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="input1" type="text" placeholder="รายละเอียด" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="input1" type="number" placeholder="ราคา" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input className="input1" type="file" accept="image/*" onChange={handleImageChange} />
      <select className="input_option" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">เลือกประเภทงาน</option>
        <option value="ELECTRICAL">งานไฟฟ้า</option>
        <option value="PLUMBING">งานประปา</option>
        <option value="AIR_CONDITIONER">งานปรับอากาศ</option>
        <option value="PAINTING">งานทาสี</option>
        <option value="CONSTRUCTION">งานโครงสร้าง</option>
        <option value="FURNITURE">งานเฟอร์นิเจอร์</option>
        <option value="CLEANING">งานทำความสะอาด</option>
        <option value="OTHER">อื่นๆ</option>
      </select>
      {previewUrl && (
        <img src={previewUrl} alt="ภาพที่เลือก" style={{ maxWidth: "100%", marginTop: "8px" }} />
      )}
      <button className="button1" onClick={handleUpdateService}>บันทึกการแก้ไข</button>
    </div>
  );
}