// utils/orderStatus.js
export const statusText = {
  ACCEPTED: "ยอมรับ",
  IN_PROGRESS: "อยู่ในระหว่างดำเนินการ",
  WAITING_CONFIRM: "รอการยืนยัน",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิก",
  PENDING: "รอดำเนินการ",
  REJECTED: "ปฏิเสธ",
  ON_HOLD: "พักงาน",};

// TODO 2: ฟังก์ชันช่วย ถ้าไม่เจอสถานะในตาราง ให้คืนค่าเดิมกลับไป
export function getStatusText(status) {
  return statusText[status] || status;
}