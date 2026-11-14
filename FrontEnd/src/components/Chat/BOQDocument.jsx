
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import SarabunFont from "../../assets/fonts/Sarabun-Regular.ttf";

// ========================================
// Register Font
// ========================================

Font.register({
  family: "Sarabun",
  src: SarabunFont,
});

Font.registerHyphenationCallback((word) => [word]);

// ========================================
// Styles
// ========================================

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 55,
    paddingHorizontal: 35,
    fontFamily: "Sarabun",
    fontSize: 12,
    color: "#333333",
  },

  // Document Header
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 11,
    textAlign: "center",
    color: "#666666",
    marginBottom: 25,
  },

  // Table Header
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#333333",
    paddingVertical: 9,
    paddingHorizontal: 5,
  },

  // Table Body
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#CCCCCC",
    paddingVertical: 8,
    paddingHorizontal: 5,
    minHeight: 30,
  },

  // Column Widths (Total = 100%)
cellName: {
  width: "28%",
  textAlign: "left",
},

cellQty: {
  width: "18%",
  textAlign: "center",
},

cellUnit: {
  width: "12%",
  textAlign: "center",
},

cellPrice: {
  width: "21%",
  textAlign: "right",
},

cellTotal: {
  width: "21%",
  textAlign: "right",
},

headerText: {
  fontSize: 12,
  textAlign: "center",
  lineHeight: 1.3,
},

herderTextName:{
    fontSize: 12,
  textAlign: "left",
  lineHeight: 1.3,
},

  bodyText: {
    fontSize: 11,
  },

  // Grand Total
  summary: {
    marginTop: 15,
    paddingTop: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1.5,
    borderTopColor: "#333333",
    alignItems: "flex-end",
  },

  grandTotalLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  grandTotalValue: {
    fontSize: 16,
  },

  // Empty State
  emptyText: {
    textAlign: "center",
    paddingVertical: 25,
    color: "#888888",
    fontSize: 12,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 35,
    right: 35,
    borderTopWidth: 0.5,
    borderTopColor: "#CCCCCC",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#777777",
  },
});

// ========================================
// Format Number
// ========================================

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatNumber(value) {
  const number = Number(value);

  return numberFormatter.format(
    Number.isFinite(number) ? number : 0
  );
}

// ========================================
// BOQ Document
// ========================================

export default function BOQDocument({ items = [] }) {
  // Prevent invalid data
  const boqItems = Array.isArray(items) ? items : [];

  // Calculate Grand Total
  const grandTotal = boqItems.reduce((sum, item) => {
    const quantity = Number(item?.quantity) || 0;
    const unitPrice = Number(item?.unitPrice) || 0;

    return sum + quantity * unitPrice;
  }, 0);

  return (
    <Document
      title="Bill of Quantities"
      author="FixChang"
      subject="รายการประมาณราคาค่าบริการ"
    >
      <Page size="A4" style={styles.page} wrap>

        {/* ========================================
            Document Title
        ======================================== */}

        <Text style={styles.title}>
          ใบแสดงรายการและประมาณราคา (BOQ)
        </Text>

        <Text style={styles.subtitle}>
          Bill of Quantities
        </Text>

        {/* ========================================
            Table Header
        ======================================== */}

        <View style={styles.headerRow} fixed>
          <Text style={[styles.cellName, styles.herderTextName]}>
            รายการ
          </Text>

          <Text style={[styles.cellQty, styles.headerText]} wrap={false}>
              {"จำนวน\u200B"}
          </Text>

          <Text style={[styles.cellUnit, styles.headerText]}>
            หน่วย
          </Text>

          <Text style={[styles.cellPrice, styles.headerText]}>
            ราคาต่อหน่วย
          </Text>

          <Text style={[styles.cellTotal, styles.headerText]}>
            รวมเงิน(บาท)
          </Text>
        </View>

        {/* ========================================
            Table Body
        ======================================== */}

        {boqItems.length > 0 ? (
          boqItems.map((item, index) => {
            const quantity = Number(item?.quantity) || 0;
            const unitPrice = Number(item?.unitPrice) || 0;
            const total = quantity * unitPrice;

            return (
              <View
                key={item?.id ?? index}
                style={styles.row}
                wrap={false}
              >
                <Text style={[styles.cellName, styles.bodyText]}>
                  {item?.name || "-"}
                </Text>

                <Text style={[styles.cellQty, styles.bodyText]}>
                  {formatNumber(quantity)}
                </Text>

                <Text style={[styles.cellUnit, styles.bodyText]}>
                  {item?.unit || "-"}
                </Text>

                <Text style={[styles.cellPrice, styles.bodyText]}>
                  {formatNumber(unitPrice)}
                </Text>

                <Text style={[styles.cellTotal, styles.bodyText]}>
                  {formatNumber(total)}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>
            ไม่พบรายการวัสดุหรือบริการ
          </Text>
        )}

        {/* ========================================
            Grand Total
        ======================================== */}

        <View style={styles.summary} wrap={false}>
          <Text style={styles.grandTotalLabel}>
            ยอดรวมทั้งหมด
          </Text>

          <Text style={styles.grandTotalValue}>
            {formatNumber(grandTotal)} บาท
          </Text>
        </View>

        {/* ========================================
            Footer / Page Number
        ======================================== */}

        <View style={styles.footer} fixed>
          <Text>
            FixChang | Bill of Quantities
          </Text>

          <Text
            render={({ pageNumber, totalPages }) =>
              `หน้า ${pageNumber} / ${totalPages}`
            }
          />
        </View>

      </Page>
    </Document>
  );
}
