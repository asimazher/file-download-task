const bodyParser = require('body-parser');
const fs = require('fs');
const PDFDocument = require('pdfkit');



// app.post('/generateInvoice',

const getInvoice = async (req, res) => {
  const { customerId, productIds } = req.body;

  try {
    // Fetch customer details
    const customerQuery = `SELECT customerName, creditLimit FROM customers WHERE customerNumber = ${customerId}`;
    const customerResult = await pool.query(customerQuery, [customerId]);
    const customer = customerResult.rows[0];

    // Fetch order details
    const orderQuery = `SELECT orderDate, shippedDate, status FROM orders WHERE customerNumber = ${customerId} ORDER BY orderDate DESC LIMIT 1`;
    const orderResult = await pool.query(orderQuery, [customerId]);
    const order = orderResult.rows[0];

    // Fetch payment details
    const paymentQuery = `SELECT paymentDate, amount FROM payments WHERE customerNumber = ${customerId}`;
    const paymentResult = await pool.query(paymentQuery, [customerId]);
    const payment = paymentResult.rows[0];

    // Fetch order details and quantity ordered
    const orderDetailsQuery = `
      SELECT od.productCode, od.quantityOrdered, p.productName, p.buyPrice
      FROM orderdetails od
      JOIN products p ON od.productCode = p.productCode
      WHERE od.orderNumber = (SELECT orderNumber FROM orders WHERE customerNumber = ${customerId} ORDER BY orderDate DESC LIMIT 1)
    `;
    const orderDetailsResult = await pool.query(orderDetailsQuery, [customerId]);
    const orderDetails = orderDetailsResult.rows[0];

    // Fetch product details and product line details
    const productDetailsQuery = `
      SELECT p.productName, p.buyPrice, pl.textDescription AS productLineDetails
      FROM products p
      JOIN productlines pl ON p.productLine = pl.productLine
      WHERE p.productCode = ANY(${productIds})
    `;
    const productDetailsResult = await pool.query(productDetailsQuery, [productIds]);
    const productDetails = productDetailsResult.rows[0];

    // Fetch sales rep details and office details
    const salesRepQuery = `
      SELECT e.firstName AS repFirstName, e.lastName AS repLastName, o.*
      FROM employees e
      JOIN offices o ON e.officeCode = o.officeCode
      WHERE e.employeeNumber = (SELECT salesRepEmployeeNumber FROM customers WHERE customerNumber = ${customerId})
    `;
    const salesRepResult = await pool.query(salesRepQuery, [customerId]);
    const salesRep = salesRepResult.rows[0];

    // Generate PDF
    const pdfDoc = new PDFDocument();
    const fileName = `invoice-${Date.now()}.pdf`;

    pdfDoc.pipe(fs.createWriteStream(fileName));

    // Add your standard invoice template here
    pdfDoc
      .fontSize(18)
      .text('Alibaba', { align: 'center' })
      .fontSize(12)
      .text(`Invoice for ${customer.contactFirstName} ${customer.contactLastName}`)
      .text(`Customer ID: ${customerId}`)
      .text(`Order Date: ${order.orderDate}`)
      .text(`Ship Date: ${order.shippedDate}`)
      .text(`Order Status: ${order.status}`)
      .text(`Payment Date: ${payment.paymentDate}`)
      .text(`Payment Amount: ${payment.amount}`)
      .moveDown()
      .text('Order Details:')
      .table({
        body: [
          ['Product Name', 'Buy Price', 'Quantity Ordered'],
          ...orderDetails.map((od) => [od.productName, od.buyPrice, od.quantityOrdered]),
        ],
      })
      .moveDown()
      .text('Product Details:')
      .table({
        body: [
          ['Product Name', 'Buy Price', 'Product Line Details'],
          ...productDetails.map((pd) => [pd.productName, pd.buyPrice, pd.productLineDetails]),
        ],
      })
      .moveDown()
      .text('Sales Rep Details:')
      .text(`Sales Rep: ${salesRep.repFirstName} ${salesRep.repLastName}`)
      .text(`Office: ${salesRep.city}, ${salesRep.country}`)
      .text(`Phone: ${salesRep.phone}`);

    pdfDoc.end();

    // Respond with the generated PDF file
    res.download(fileName);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = getInvoice