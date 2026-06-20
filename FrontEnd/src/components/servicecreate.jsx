import { useState } from "react";
import axios from "axios";
import "./ServiceCreate.css"

export default function ServiceCreate() {
  const data = localStorage.getItem("user");
  const id = JSON.parse(data).payload.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setCategory] = useState("");


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCreateService = async () => {
    const token = localStorage.getItem("token");
    if (!title || !description || !price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const formData = new FormData();
    formData.append("Users_Id", id);
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("Price", price);
    formData.append("Category",category);
    if (image) formData.append("file", image);

    try {
      const response = await axios.post("http://localhost:3000/api/newservice",formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
      });
      console.log(response.data);
      alert("สร้างงานสำเร็จ");
    } catch (err) {
      console.log(err);
      console.log("error:", err.response?.data)
      alert("เกิดข้อผิดพลาด"+err.response.data.msg);
    }
  };

  return (
    <>
      <div className="div1">
        <p >สร้างงานใหม่</p>
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

        <button className="button1" onClick={handleCreateService}>สร้างงานใหม่</button>
      </div>
    </>
  );
}