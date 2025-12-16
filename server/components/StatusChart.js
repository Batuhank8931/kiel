const path = require('path');
const fs = require('fs');
const fsp = fs.promises;   

// EXE uyumlu klasörler
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');

// Yazılabilir klasörleri EXE dışında oluştur
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const jsonFilePath = path.join(dataDir, 'input.json');
const readDataPath = path.join(dataDir, 'ReadData.json');
const stationsjson = path.join(dataDir, 'stationuser.json');

const getStatusChart = async (req, res) => {
    try {
        // Read input.json
        const inputData = await fsp.readFile(jsonFilePath, 'utf8');
        let jsonData = {};

        if (inputData) {
            try {
                jsonData = JSON.parse(inputData);
            } catch (error) {
                console.error('Error parsing input.json:', error);
            }
        }

        const totalOperations = jsonData.station_1?.projectData?.[3] || 0; // Safe access with default value 0

        // Read stationuser.json
        const stationsData = await fsp.readFile(stationsjson, 'utf8');
        let stationsList = [];

        if (stationsData) {
            try {
                stationsList = JSON.parse(stationsData);
                // Ensure stationsList is an array
                if (!Array.isArray(stationsList)) stationsList = [];
            } catch (error) {
                console.error('Error parsing stationuser.json:', error);
            }
        }

        // Extract unique station numbers
        const uniqueStations = [...new Set(stationsList.map(station => station.station))];

        // Read and process ReadData.json
        const readData = await fsp.readFile(readDataPath, 'utf8');
        let readJson = [];

        if (readData) {
            try {
                readJson = JSON.parse(readData);
                // Ensure readJson is an array
                if (!Array.isArray(readJson)) readJson = [];
            } catch (error) {
                console.error('Error parsing ReadData.json:', error);
            }
        }

        // Count occurrences of "data": "end" per station
        const completedCounts = uniqueStations.reduce((acc, station) => {
            acc[station] = readJson.filter(entry => entry.station === station && entry.data === "end").length;
            return acc;
        }, {});

        // Create data array dynamically
        const data = [
            ["", "Completed", "Remaining"],
            ...uniqueStations.map(station => [
                station, 
                completedCounts[station] || 0, // Use the count of "end" data
                totalOperations - (completedCounts[station] || 0) // Remaining operations
            ])
        ];

        // Return the dynamically created data array
        res.status(200).json(data);

    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = getStatusChart;
