const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// EXE uyumlu klasörler
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');

// Yazılabilir klasörleri EXE dışında oluştur
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const jsonFilePath = path.join(dataDir, 'input.json');
const readdataPath = path.join(dataDir, 'ReadData.json');
const breakdataPath = path.join(dataDir, 'BreakData.json');


let dataArray = {};
let readArray = [];
let breakArray = [];

const updateCachedData = () => {
    try {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        dataArray = JSON.parse(jsonData);

        const jsonReadData = fs.readFileSync(readdataPath, 'utf8');
        readArray = JSON.parse(jsonReadData);

        const jsonBreakData = fs.readFileSync(breakdataPath, 'utf8');
        breakArray = JSON.parse(jsonBreakData);

    } catch (error) {
        console.error('Error reading or parsing input.json:', error);
    }
};


setInterval(updateCachedData, 3000); // Update every 3 seconds


const parseDate = (timeString) => {
    // Convert the date from "DD.MM.YYYY HH:mm:ss" format to "YYYY-MM-DDTHH:mm:ss"
    const [day, month, year, hour, minute, second] = timeString.split(/[\s.:]+/);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
};

const GetAllRawData = async (req, res) => {
    try {
        const stationId = parseInt(req.params.station_id, 10);

        // Convert stationId to string to match the data structure
        const filteredReadData = Array.isArray(readArray)
            ? readArray.filter(item => item.station === stationId.toString())
            : [];

        const filteredBreakData = Array.isArray(breakArray)
            ? breakArray.filter(item => item.station === stationId.toString())
            : [];

        let latestRead = null;
        let latestBreak = null;

        if (filteredReadData.length > 0) {
            // Find the latest entry based on time
            latestRead = filteredReadData.reduce((latest, current) =>
                parseDate(current.time) > parseDate(latest.time) ? current : latest
            );
        }

        if (filteredBreakData.length > 0) {
            // Find the latest entry based on time
            latestBreak = filteredBreakData.reduce((latest, current) =>
                parseDate(current.time) > parseDate(latest.time) ? current : latest
            );
        }

        const stationKey = `station_${stationId}`;

        // Check if the stationKey exists in the data
        if (dataArray.hasOwnProperty(stationKey)) {
            const stationData = dataArray[stationKey];

            const englishArray = stationData.english || [];
            const spanishArray = stationData.spanish || [];
            const projectData = stationData.projectData || [];
            const stepTime = stationData.stepTime || [];

            const resultDataArray = [englishArray, spanishArray, projectData, stepTime, latestRead, latestBreak];

            res.status(200).json(resultDataArray);
        } else {
            res.status(404).json({ message: `Station with ID ${stationId} not found` });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = GetAllRawData;
