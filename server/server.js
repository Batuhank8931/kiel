const express = require('express');
const app = express();
const apiRoutes = require('./routes/api/api'); // Import the routes
const cors = require('cors');
const { watchExcelFile } = require('./components/CheckExcell'); // Import the function from CheckExcell.js
const { watchBarcodesFile } = require('./components/CheckBarcodes'); // Import the function from CheckExcell.js

const PORT = 3005; // Change the port if needed

// Middleware to parse JSON
app.use(express.json());

const corsOptions = {
  origin: "*", // Allow requests from any IP
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Use the API routes
app.use('/api', apiRoutes); // All API routes will be prefixed with '/api'

// Start watching the Excel file for changes
//watchExcelFile();
watchBarcodesFile();

// Start the Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running`);
});
