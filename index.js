const express = require('express')
const dotenv = require('dotenv')
const {sequelize, connectDb} = require('./config/db');
const Product = require('./models/Products');
const app = express()
const Queue  = require('bull');

const { Op } = require('sequelize');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const uuid = require('uuid');
const csvParser = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const getInvoice = require('./controllers/invoice');
// Define the Bull queue
const downloadQueue = new Queue('downloadQueue');

const router = express.Router();



const port = process.env.PORT || 3000;

app.use(express.json());

connectDb()

// sequelize.sync().then(() => {
//   console.log('Database synced');


// Set up multer for handling file uploads

const upload = multer({ dest: 'uploads/' });

app.get("/api/getInvoice", getInvoice)

//////////////


app.get("/api/getProducts", async(req, res)=>{

//     await Product.sync()
// console.log("products model synced.")

try {
    // Define filters based on query parameters
    const filters = {
      productLine: req.query.productLine,
      priceRange: req.query.priceRange,
      // Add more filters as needed
    };

      // Build the where clause for Sequelize based on filters
      const whereClause = {};
      if (filters.productLine) {
        whereClause.productLine = filters.productLine;
      }
      if (filters.priceRange) {
        // Split the price range into min and max values
        const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
  
        // Add a condition for the price range
        whereClause.buyPrice = {
          [Op.between]: [minPrice, maxPrice],
        };
      }
      // Add more conditions for other filters
  
      // Query the database to get filtered records
      const records = await Product.findAll({
        where: whereClause,
      });


// Generate a unique file name using UUID
const fileName = `uploads/${uuid.v4()}.csv`;


// Set up CSV writer with headers
const csvWriter = createCsvWriter({
    path: fileName,
    header: [
        { id: 'productCode', title: 'Product Code' },
        { id: 'productName', title: 'Product Name' },
        { id: 'productLine', title: 'Product Line' },
        { id: 'productScale', title: 'Product Scale' },
        { id: 'productVendor', title: 'Product Vendor' },
        { id: 'productDescription', title: 'Product Description' },
        { id: 'quantityInStock', title: 'Quantity In Stock' },
        { id: 'buyPrice', title: 'Buy Price' },
        { id: 'MSRP', title: 'MSRP' },
      // Add more headers for other fields
    ],
    // append: false,
  });

  // Write records to the CSV file
  await csvWriter.writeRecords(records.map(record => record.toJSON()));

  // Respond with the CSV file as a download
res.status(200).sendFile(path.resolve(fileName), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }

    // Remove the temporary CSV file after download
    fs.unlink(fileName, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
} catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error');
}
});


// Start your Express server or perform other actions here

app.listen(port, () => console.log(`Listening on port ${port}`))
// });

