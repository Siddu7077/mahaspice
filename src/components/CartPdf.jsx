import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'blue',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    textDecoration: 'underline',
  },
  cartTitle: {
    fontSize: 18,
    marginBottom: 15,
    marginTop: 20,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontSize: 12,
  },
  value: {
    width: '70%',
    fontSize: 12,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  totalPrice: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'right',
  },
});

// PDF Document component
const CartPDFDocument = ({ selectedCarts, carts }) => {
  const cartData = selectedCarts
    .map((cartId) => carts.find((cart) => cart.cart_id === cartId))
    .filter(Boolean);

  return (
    <Document>
      <Page style={styles.page}>
        {/* Main Heading */}
        <Text style={styles.title}>Mahaspice Caterers</Text>
        <Text style={styles.header}>Cart Details</Text>

        {cartData.map((cart, index) => (
          <View key={index}>
            <Text style={styles.cartTitle}>
              Cart #{cart.cart_id} - {cart.event_name} ({cart.menu_type})
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>Guest Count:</Text>
              <Text style={styles.value}>{cart.guest_count}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Plate Price:</Text>
              <Text style={styles.value}>₹{cart.plate_price}</Text>
            </View>

            {/* Table Header */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Category</Text>
                <Text style={styles.tableCell}>Item Name</Text>
                <Text style={styles.tableCell}>Price</Text>
              </View>

              {/* Table Rows */}
              {cart.items.map((item, itemIndex) => (
                <View style={styles.tableRow} key={itemIndex}>
                  <Text style={styles.tableCell}>{item.category_name}</Text>
                  <Text style={styles.tableCell}>{item.item_name}</Text>
                  <Text style={styles.tableCell}>
                    {item.is_extra ? `₹${item.price} (Extra)` : '-'}
                  </Text>
                </View>
              ))}
            </View>

            {/* Total Price */}
            <Text style={styles.totalPrice}>Total Amount: ₹{cart.total_price}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

// Download button component
const DownloadPDFButton = ({ selectedCarts, carts }) => {
  if (selectedCarts.length === 0) return null;

  const fileName =
    selectedCarts.length === 1
      ? `cart-${selectedCarts[0]}.pdf`
      : `carts-${selectedCarts.join('-')}.pdf`;

  return (
    <PDFDownloadLink
      document={<CartPDFDocument selectedCarts={selectedCarts} carts={carts} />}
      fileName={fileName}
      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
    >
      {({ loading }) =>
        loading ? 'Preparing PDF...' : `Download ${selectedCarts.length > 1 ? 'Carts' : 'Cart'} as PDF`
      }
    </PDFDownloadLink>
  );
};

export default DownloadPDFButton;
