import { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceCreate.css";

export default function ServiceOption({ serviceId, onClose }) {
  const data = localStorage.getItem("user");
  const id = JSON.parse(data).payload.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!serviceId) {
      return;
    }

    const token = localStorage.getItem("token");

    const fetchService = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/readservice/${serviceId}`,
          { headers: { authorization: token } }
        );
        const service = response.data.result;

        setTitle(service.Title);
        setDescription(service.Description);
        setPrice(service.Price);
        setCategory(service.Category);

        if (service.Image) {
          setPreviewUrl(`http://localhost:3000/uploads/${service.Image}`);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

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

    if (image) {
      formData.append("file", image);
    }

    try {
      await axios.patch(`http://localhost:3000/api/updateservice`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
      });

      alert("แก้ไขงานสำเร็จ");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("เกิดข้อผิดพลาด: " + err.response?.data?.msg);
    }
  };

  return (
    <div className="div1">
      <p>แก้ไขงาน (ID: {serviceId})</p>
      <button onClick={onClose}>X</button>

      <input
        className="input1"
        type="text"
        placeholder="ชื่องาน"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        className="input1"
        type="text"
        placeholder="รายละเอียด"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <input
        className="input1"
        type="number"
        placeholder="ราคา"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <input
        className="input1"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      <select
        className="input_option"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
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
        <img
          src={previewUrl}
          alt="ภาพที่เลือก"
          style={{ maxWidth: "100%", marginTop: "8px" }}
        />
      )}

      <button className="button1" onClick={handleUpdateService}>
        บันทึกการแก้ไข
      </button>
      <br />
    </div>
  );
}