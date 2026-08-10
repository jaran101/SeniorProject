import { useState, useEffect } from 'react';

export default function BOQTable({ onTotalChange }) 
{
const [items, setItems] = useState([
  { id: Date.now(), name: '', quantity: 0, unitPrice: 0 }
]);

const [total, setTotal] = useState(0);
function handleAddItem() {

      const newItem = {
    id: Date.now(),      
    name: "",
    quantity: 0,
    unitPrice: 0
  };

  setItems(prev => [...prev, newItem]);

}

function handleChangeItem(id, field, value) {
    setItems(prev =>
        prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
        )
);
}

function handleRemoveItem(id) {
    // TODO 2: กรอง items เอาแถวที่ id ตรงกับที่ส่งมาออกไป (filter)

    setItems(prev => prev.filter(item => item.id !== id));
}

     useEffect(() => {

    const total = items.reduce((sum, item) => {
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);
        return sum + (quantity * unitPrice);
    }, 0);
    setTotal(total);
    onTotalChange(total);
  }, [items]);




    return (
    
    <div>
    <h4>รายการ BOQ</h4>
    {items.map((item) => (
        <div key={item.id}>

<input 
    type="text" 
    placeholder="ชื่อรายการ" 
    value={item.name} 
    onChange={(e) => handleChangeItem(item.id, "name", e.target.value)} 
    />

    <input 
        type="number" 
        placeholder="จำนวน" 
        value={item.quantity} 
        onChange={(e) => handleChangeItem(item.id, "quantity", e.target.value)} 
    />
    <input 
        type="number" 
        placeholder="ราคาต่อหน่วย" 
        value={item.unitPrice} 
        onChange={(e) => handleChangeItem(item.id, "unitPrice", e.target.value)} 
    />


        <button onClick={() => handleRemoveItem(item.id)}>ลบ</button>
        </div>
    ))}
    <button onClick={handleAddItem}>+ เพิ่มรายการ</button>


    <p>ยอดรวม: {total.toLocaleString()} บาท</p>
    </div>


)
}

