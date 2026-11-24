// utils/orderStatus.js
export const statusText = {
  ACCEPTED: "ยอมรับ",
  IN_PROGRESS: "กำลังดำเนินการ",
  WAITING_CONFIRM: "รอลูกค้ายืนยัน",
  COMPLETED: "งานเสร็จสิ้น",
  CANCELLED: "ยกเลิก",
  PENDING: "รอการชำระเงิน",
  REJECTED: "ปฏิเสธ",
  WAITING_CONFIRMATION:"รอช่างยืนยัน",
  PAID:"ชำระเงินแล้ว"
  };

// TODO 2: ฟังก์ชันช่วย ถ้าไม่เจอสถานะในตาราง ให้คืนค่าเดิมกลับไป
export function getStatusText(status) {
  return statusText[status] || status;
}