const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const PDFTable = require('pdfkit-table');
const { Sequelize, DataTypes } = require('sequelize');
const Customer = require('../models/Customers');
const Order = require('../models/Orders');
const Payment = require('../models/Payments');
const OrderDetails = require('../models/OrderDetails');
const Product = require('../models/Products');
const Employee = require('../models/Employees');


const getInvoice =  async (req, res) => {
  const { customerId, productIds } = req.query;

  try {
    // Fetch customer details
    const customer = await Customer.findByPk(customerId);

    // Fetch order details
    // You need to define the Order model and establish associations between models if necessary
    const order = await Order.findOne({
      where: { customerNumber: customerId },
    //   order: [['orderDate', 'DESC']],
    });

    // Fetch payment details
    // You need to define the Payment model and establish associations between models if necessary
    const payment = await Payment.findOne({ where: { customerNumber: customerId } });

    // Fetch order details and quantity ordered
    // You need to define the OrderDetails and Product models and establish associations between models if necessary
    const orderDetails = await OrderDetails.findOne({
    //   include: [{ model: Product }],
      where: { orderNumber: order.orderNumber },
    });

    // Fetch product details and product line details
    // You need to define the Product and ProductLine models and establish associations between models if necessary
    const productDetails = await Product.findOne({
    //   include: [{ model: ProductLine }],
      where: { productCode: productIds },
    });

    // Fetch sales rep details and office details
    // You need to define the Employee and Office models and establish associations between models if necessary
    const salesRep = await Employee.findOne({
    //   include: [{ model: Office }],
      where: { employeeNumber: customer.salesRepEmployeeNumber },
    });

    // Generate PDF
    const pdfDoc = new PDFDocument();
    const fileName = `invoice-${Date.now()}.pdf`;

    pdfDoc.pipe(fs.createWriteStream(fileName));

    // Add your standard invoice template here
    pdfDoc
      .fontSize(18)
      .text('Alibaba', { align: 'center' })
      .fontSize(12)
      .text(`Invoice for ${customer.customerName}`)
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
          ['Order No.', 'Quantity Ordered'],
          [orderDetails.dataValues.orderNumber, orderDetails.dataValues.quantityOrdered],
        ],
      })
      .moveDown()
      .text('Product Details:')
      .table({
        body: [
          ['Product Name', 'Buy Price', 'Product Line Details'],
          [productDetails.dataValues.productName, productDetails.dataValues.buyPrice, productDetails.dataValues.ProductLine],
        ],
      })
      .moveDown()
      .text('Sales Rep Details:')
      .text(`Sales Rep: ${salesRep.firstName} ${salesRep.lastName}`)
      .text(`Office: ${salesRep.Office.city}, ${salesRep.Office.country}`)
      .text(`Phone: ${salesRep.Office.phone}`);

    pdfDoc.end();

    // Respond with the generated PDF file
    res.download(fileName);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = getInvoice
