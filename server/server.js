const express = require('express');
const app = express();
const apiRoutes = require('./routes/api/api'); // Import the routes
const cors = require('cors');
const { watchBarcodesFile } = require('./components/CheckBarcodes');
const WatchExcelFile = require('./components/CheckExcell');
const os = require('os');

const PORT = 3008;

// Middleware
app.use(express.json());
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/api', apiRoutes);

// Start watching files
watchBarcodesFile();
WatchExcelFile();

// Function to get local IPv4 addresses
function getLocalIPv4() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results;
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIPv4();
  console.log(`Server is running on port ${PORT}`);
  ips.forEach(ip => console.log(`Accessible at http://${ip}:${PORT}`));
});
