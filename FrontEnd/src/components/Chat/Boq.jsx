import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import axios from "axios";
import BOQPreview from "./BOQPreview.jsx";
import "./Boq.css"
import BOQDocument from "./BOQDocument.jsx";
export default function Boq({onCancel,Service_Id,orderId,onSendMessage }) {

const [confirmed, setConfirmed] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const [items, setItems] = useState([
  { id: 1, name: "", quantity: 0, unitPrice: 0, unit: "", description: "" }
]);

  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

 const handleAddItem = () => {
    const validationError = validateItems();
  if (validationError) {
    alert(validationError);
    return;
  }
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  setItems([...items, { id: newId, name: "", quantity: 0, unitPrice: 0 }]);
};

const handleRemoveItem = (id) => {
  if (items.length <= 1) {
    setErrorMessage("ต้องมีอย่างน้อย 1 รายการ");
    return;
  }
  setItems(items.filter(i => i.id !== id));
};

  const calculateTotal = () => {
    return items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);
  };

  const validateItems = () => {
    if (items.length === 0) {
      return "กรุณาเพิ่มอย่างน้อย 1 รายการ";
    }
    for (const item of items) {
      if (!item.name || item.name.trim() === "") {
        return "กรุณากรอกชื่อรายการให้ครบทุกแถว";
      }
      if (!item.quantity || item.quantity <= 0) {
        return `กรุณากรอกจำนวนของ "${item.name || "รายการที่ว่าง"}" ให้มากกว่า 0`;
      }
      if (item.unitPrice < 0) {
        return `ราคาต่อหน่วยของ "${item.name}" ต้องไม่ติดลบ`;
      }
    }
    return null; 
  };





const handleConfirm = async () => {
  const validationError = validateItems();
  if (validationError) {
    alert(validationError);
    return;
  }
  setIsSubmitting(true);
const itemsPayload = items.map(item => ({
  Name: item.name,
  Description: item.description,
  Quantity: item.quantity,
  Unit: item.unit,
  Unit_Price: item.unitPrice
}));

 const payload = {
  Order_Id: orderId,
  Items: itemsPayload
};

  try {

    const response = await axios.post("http://localhost:3000/api/newboq", payload);
    console.log("BOQ created:", response.data.result);
    console.log(response.data.message)
    setConfirmed(true);
    onSendMessage(`BOQ_CREATED:${orderId}`);
    onCancel();
  } catch (err) {
    console.error(err?.response?.data?.message || "Something went wrong");
    setIsSubmitting(false);
  }
};





  return (
    <div className="boq-container">
      {Service_Id}
      Order ID: {orderId}
      <table>
        <thead>
          <tr>
            <th>รายการ</th>
            <th>จำนวน</th>
            <th>ราคาต่อหน่วย</th>
            <th>หน่วย</th>
            <th>รวม</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td><input className="boq_input" value={i.name} onChange={e => handleItemChange(i.id, 'name', e.target.value)} /></td>
              <td><input className="boq_input" type="number" value={i.quantity} onChange={e => handleItemChange(i.id, 'quantity', +e.target.value)} /></td>
              <td><input className="boq_input" type="number" value={i.unitPrice} onChange={e => handleItemChange(i.id, 'unitPrice', +e.target.value)} /></td>
              <td><input className="boq_input" value={i.unit} onChange={e => handleItemChange(i.id, 'unit', e.target.value)} /></td>
              <td>{(i.quantity * i.unitPrice).toFixed(2)}</td>
              <td><button onClick={() => handleRemoveItem(i.id)} disabled={items.length <= 1}>ลบ</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleAddItem}>+ เพิ่มรายการ</button>

          <div>ยอดรวมทั้งหมด: {calculateTotal().toFixed(2)}</div>
          <button onClick={onCancel}>ยกเลิก</button>
          <button onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? "กำลังบันทึก..." : "ยืนยัน"}
          </button>

{confirmed && (
  <>
    <PDFDownloadLink document={<BOQDocument items={items} />} fileName="BOQ.pdf">
      {({ loading }) => (loading ? "Generating PDF..." : "Download BOQ")}
    </PDFDownloadLink>
    <BOQPreview items={items} />
  </>
)}
    </div>
  );
}

