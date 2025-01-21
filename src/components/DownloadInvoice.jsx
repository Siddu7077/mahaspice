import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { FileDown } from "lucide-react";

const styles = StyleSheet.create({
  page: {
    padding: 20, // Reduced padding
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 10, // Reduced margin
    borderBottom: 1,
    paddingBottom: 5, // Reduced padding
  },
  title: {
    fontSize: 16, // Reduced font size
    fontWeight: "bold",
    marginBottom: 5, // Reduced margin
  },
  section: {
    margin: 0, // Removed margin
    padding: 5, // Reduced padding
    marginBottom: 10, // Added specific bottom margin
  },
  sectionTitle: {
    fontSize: 12, // Reduced font size
    fontWeight: "bold",
    marginBottom: 5,
  },
  // Customer Details Table styles
  customerTable: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bbb",
    marginBottom: 10, // Reduced margin
  },
  customerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    minHeight: 16, // Reduced height
  },
  customerLabelCell: {
    width: "25%", // Reduced width
    padding: 4, // Reduced padding
    backgroundColor: "#f3f4f6",
    borderRightWidth: 1,
    borderRightColor: "#bbb",
    fontSize: 8, // Reduced font size
  },
  customerValueCell: {
    width: "75%", // Increased width
    padding: 4, // Reduced padding
    fontSize: 8, // Reduced font size
  },
  // Order Details Table styles
  orderTable: {
    display: "table",
    width: "100%",
    marginBottom: 10, // Reduced margin
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    minHeight: 20, // Reduced height
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
    fontSize: 8, // Reduced font size
  },
  tableCell: {
    fontSize: 8, // Reduced font size
    padding: 4, // Reduced padding
  },
  tableCol1: {
    width: "40%",
    padding: 4,
  },
  tableCol2: {
    width: "20%",
    padding: 4,
    textAlign: "center",
  },
  tableCol3: {
    width: "20%",
    padding: 4,
  },
  tableCol4: {
    width: "20%",
    padding: 4,
  },
  total: {
    marginTop: 5, // Reduced margin
    borderTopWidth: 1,
    borderTopColor: "#bbb",
    paddingTop: 5, // Reduced padding
  },
  amount: {
    position: "relative",
  },
  totalRow: {
    flexDirection: "row",
    minHeight: 16, // Reduced height
    alignItems: "center",
  },
  totalLabel: {
    width: "60%",
    fontSize: 8,
    padding: 4,
  },
  totalAmount: {
    width: "40%",
    fontSize: 8,
    padding: 4,
    textAlign: "right",
  },
});

const InvoicePDF = ({
  formData,
  cart,
  cartTotal,
  gstAmount,
  deliveryCharge,
  finalTotal,
  discountAmount,
  gstPercentage,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Mahaspice Caterers - Invoice</Text>
        <Text style={{ fontSize: 8 }}>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <View style={styles.customerTable}>
          <View style={styles.customerRow}>
            <View style={styles.customerLabelCell}>
              <Text>Name</Text>
            </View>
            <View style={styles.customerValueCell}>
              <Text>{formData.name}</Text>
            </View>
          </View>
          <View style={styles.customerRow}>
            <View style={styles.customerLabelCell}>
              <Text>Phone & Email</Text>
            </View>
            <View style={styles.customerValueCell}>
              <Text>{formData.phone1} | {formData.email}</Text>
            </View>
          </View>
          <View style={styles.customerRow}>
            <View style={styles.customerLabelCell}>
              <Text>Address</Text>
            </View>
            <View style={styles.customerValueCell}>
              <Text>{formData.address}</Text>
            </View>
          </View>
          <View style={styles.customerRow}>
            <View style={styles.customerLabelCell}>
              <Text>Delivery Details</Text>
            </View>
            <View style={styles.customerValueCell}>
              <Text>{formData.location} | {formData.deliveryDate} | {formData.deliveryTime}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.orderTable}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol1, styles.tableCell]}>Item</Text>
            <Text style={[styles.tableCol2, styles.tableCell]}>Qty</Text>
            <Text style={[styles.tableCol3, styles.tableCell]}>Price</Text>
            <Text style={[styles.tableCol4, styles.tableCell]}>Total</Text>
          </View>

          {Object.entries(cart).map(([itemId, item]) => (
            <View style={styles.tableRow} key={itemId}>
              <Text style={[styles.tableCol1, styles.tableCell]}>{item.details.name}</Text>
              <Text style={[styles.tableCol2, styles.tableCell]}>{item.quantity}</Text>
              <View style={styles.tableCol3}>
                <Text style={[styles.amount, styles.tableCell]}>
                  ₹{parseFloat(item.details.price.replace(/[^\d.]/g, "")).toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={[styles.amount, styles.tableCell]}>
                  ₹{(item.quantity * parseFloat(item.details.price.replace(/[^\d.]/g, ""))).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalAmount}>₹{cartTotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>GST ({gstPercentage}%)</Text>
            <Text style={styles.totalAmount}>₹{gstAmount}</Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalAmount}>-₹{discountAmount}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Charge</Text>
            <Text style={styles.totalAmount}>₹{deliveryCharge}</Text>
          </View>
          <View style={[styles.totalRow, { fontWeight: "bold" }]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{finalTotal}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const DownloadInvoice = ({
  formData,
  cart,
  cartTotal,
  gstAmount,
  deliveryCharge,
  finalTotal,
  discountAmount,
  gstPercentage,
}) => (
  <PDFDownloadLink
    document={
      <InvoicePDF
        formData={formData}
        cart={cart}
        cartTotal={cartTotal}
        gstAmount={gstAmount}
        deliveryCharge={deliveryCharge}
        finalTotal={finalTotal}
        discountAmount={discountAmount}
        gstPercentage={gstPercentage}
      />
    }
    fileName={`invoice-${formData.name}-${new Date().toISOString().split("T")[0]}.pdf`}
  >
    {({ loading }) => (
      <button
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        <FileDown size={20} />
        {loading ? "Generating Invoice..." : "Download Invoice"}
      </button>
    )}
  </PDFDownloadLink>
);

export default DownloadInvoice;