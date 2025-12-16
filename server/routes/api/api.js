const express = require('express');
const router = express.Router();

// Import the getStatusChart function from StatusChart.js
const getStatusChart = require('../../components/StatusChart');
const GetEmployeesChart = require('../../components/GetEmployeesChart');
const GetStationsChart = require('../../components/GetStationsChart');
const GetAllRawData = require('../../components/GetAllRawData');
const GetProductBarcodes = require('../../components/GetProductBarcodes');
const PrintBarcode = require('../../components/PrintBarcode');
const WatchExcelFile = require('../../components/CheckExcell');
const GetStationObject  = require("../../components/GetStationObject");

const { InsertOutputTable } = require('../../components/InsertOutputTable');

// Import functions from user.js
const { Userinfo, getUser, deleteUser, putUsers } = require('../../components/user');
const { PostReady, informReady } = require('../../components/PostReady');
const { SetUsertoStation } = require('../../components/PostArrangeUser');
const { GetReadData } = require('../../components/GetReadData');

const OperationNumber = require('../../components/OperationNumber');
const { GetStationPicture } = require('../../components/GetStationPicture');

// Use the getStatusChart function for the '/data' route
router.get('/statuschart', getStatusChart);
router.get('/employeeschart', GetEmployeesChart);
router.get('/stationschart', GetStationsChart);
router.get('/getproductbarcodes', GetProductBarcodes);
router.get('/getallrawdata/:station_id', GetAllRawData);
router.post('/printbarcode', PrintBarcode);
router.post('/postready', PostReady);
router.get('/informready', informReady);
router.post("/getstationobject/:id", GetStationObject); 

router.post('/setusertostation', SetUsertoStation);


router.post('/getreaddata', GetReadData);

router.get('/operationnumber', OperationNumber);

router.get('/insertoutputable', InsertOutputTable);

router.get('/resetInputable', WatchExcelFile);

// User routes
router.post('/userinfo', Userinfo);  // Get all or a specific user
router.get('/users', getUser);  // Get all or a specific user
router.delete('/users/:seriNo', deleteUser);  // Delete a user by seriNo
router.put('/users', putUsers);  // Add or update a user

// Example route (you can keep this or modify it)
router.get('/anotherRoute', (req, res) => {
    res.send('Hello from the API!');
});

router.get('/getstationpicture/:id', GetStationPicture)

// Export the router
module.exports = router;
