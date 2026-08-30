import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import SarabunFont from "../../assets/fonts/Sarabun-Regular.ttf";
Font.register({
  family: "Sarabun",
  src: SarabunFont,
});
Font.registerHyphenationCallback(word => [word]);

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Sarabun" },
  title: { fontSize: 18, marginBottom: 20 },
  headerRow: {
    flexDirection: "row",
    borderBottom: "2 solid #000",
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    borderBottom: "1 solid #ccc",
    paddingVertical: 4,
  },
  cellName: { width: "30%", fontSize: 18 },
  cellQty: { width: "15%", textAlign: "right", fontSize: 16 },
  cellPrice: { width: "20%", textAlign: "right", fontSize: 16 },
  cellTotal: { width: "20%", textAlign: "right", fontSize: 16 },
  cellUnit: { width: "20%", textAlign: "center", fontSize: 16 },
});

export default function BOQDocument({items}){
const grandTotal = items.reduce((sum,item)=> sum + item.quantity * item.unitPrice, 0);


    return (
          <Document>
      <Page style={styles.page}>
        <View style={styles.headerRow}>
            <Text style={styles.cellName}>รายการ</Text>
            <Text style={styles.cellQty}>จำนวน </Text>
            <Text style={styles.cellUnit}>หน่วย</Text>
            <Text style={styles.cellPrice}>ราคาต่อหน่วย</Text>
            <Text style={styles.cellTotal}>รวม</Text>
        </View>
 

          {items.map((item) => (
    <View key={item.id} style={styles.row}>
      <Text style={styles.cellName}>{item.name}</Text>
      <Text style={styles.cellQty}>{item.quantity}</Text>
      <Text style={styles.cellQty}>{item.unit}</Text>
      <Text style={styles.cellPrice}>{item.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</Text>

      <Text style={styles.cellTotal}>{(item.quantity * item.unitPrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
    </View>
  ))}

   <View style={{ flexDirection: "row", marginTop: 10, paddingTop: 8, borderTop: "2 solid #000" }}>
<Text style={{ width: "100%", textAlign: "right" }}>
  ยอดรวมทั้งหมด {grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}บาท
</Text></View>  
    </Page>
    </Document>
    )
}