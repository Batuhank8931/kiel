const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const jsonFilePath = path.join(__dirname, 'jsons/barcodes.json');


let dataArray = {};

const updateCachedData = () => {
    try {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        dataArray = JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading or parsing input.json:', error);
    }
};


setInterval(updateCachedData, 3000); // Update every 3 seconds


const GetProductBarcodes = async (req, res) => {
    try {

        // Check if the stationKey exists in the data
        if (dataArray && Array.isArray(dataArray.barcodes)) {
            res.status(200).json(dataArray.barcodes);
        } else {
            res.status(404).json({ message: 'No barcodes found' });
        }

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = GetProductBarcodes;
