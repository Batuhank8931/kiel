const path = require('path');
const fs = require('fs');

// EXE uyumlu klasörler
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');


const jsonFilePath = path.join(dataDir, 'input.json');
const datajson = path.join(dataDir, 'ReadData.json');
const stationsjson = path.join(dataDir, 'stationuser.json');


const OperationNumber = async (req, res) => {
    try {
        // Read input.json file to get total operations
        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err || !data) {
                console.error('Error reading input.json:', err);
                return res.status(500).json({ message: 'Error reading input.json' });
            }

            let jsonData;
            try {
                jsonData = JSON.parse(data);
            } catch (error) {
                console.error('Invalid JSON format in input.json:', error);
                return res.status(500).json({ message: 'Invalid JSON format in input.json' });
            }

            const totalOperations = jsonData.station_1?.projectData?.[3] || 0; // Ensure safe access

            // Read stationuser.json to get the highest station number
            fs.readFile(stationsjson, 'utf8', (err, stationData) => {
                if (err || !stationData) {
                    console.error('Error reading stationuser.json:', err);
                    return res.status(500).json({ message: 'Error reading stationuser.json' });
                }

                let stationUsers;
                try {
                    stationUsers = JSON.parse(stationData);
                    if (!Array.isArray(stationUsers)) stationUsers = []; // Ensure it's an array
                } catch (error) {
                    console.error('Invalid JSON format in stationuser.json:', error);
                    return res.status(500).json({ message: 'Invalid JSON format in stationuser.json' });
                }

                const highestStation = stationUsers.reduce((max, user) => 
                    Math.max(max, parseInt(user.station, 10) || 0), 0);

                // Read ReadData.json to count completed operations
                fs.readFile(datajson, 'utf8', (err, readData) => {
                    if (err || !readData) {
                        console.error('Error reading ReadData.json:', err);
                        return res.status(500).json({ message: 'Error reading ReadData.json' });
                    }

                    let readJsonData;
                    try {
                        readJsonData = JSON.parse(readData);
                        if (!Array.isArray(readJsonData)) readJsonData = []; // Ensure it's an array
                    } catch (error) {
                        console.error('Invalid JSON format in ReadData.json:', error);
                        return res.status(500).json({ message: 'Invalid JSON format in ReadData.json' });
                    }

                    const completedOperations = readJsonData.filter(item => 
                        item.data === "end" && parseInt(item.station, 10) === highestStation
                    ).length;

                    const remainingOperations = totalOperations - completedOperations;

                    res.status(200).json({
                        totalOperations,
                        remainingOperations,
                        highestStation
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = OperationNumber;
