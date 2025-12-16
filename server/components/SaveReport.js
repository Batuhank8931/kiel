const fs = require('fs');
const path = require('path');

// EXE uyumlu klasörler
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');

// Yazılabilir klasörleri EXE dışında oluştur
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const jsonFilePath = path.join(dataDir, 'input.json');
const readDataFilePath = path.join(dataDir, 'ReadData.json');
const stationUserFilePath = path.join(dataDir, 'stationuser.json');

// Read input.json
fs.readFile(jsonFilePath, 'utf8', (err, inputData) => {
    if (err) {
        console.error('Error reading input.json:', err);
        return;
    }
    try {
        const jsonData = JSON.parse(inputData);
        const projectName = jsonData.station_1.projectData[0];
        const projectCode = jsonData.station_1.projectData[1];
        const productCode = jsonData.station_1.projectData[2];
        const totalOperations = jsonData.station_1.projectData[3]; // Final station

        // Read stationuser.json
        fs.readFile(stationUserFilePath, 'utf8', (err, userData) => {
            if (err) {
                console.error('Error reading stationuser.json:', err);
                return;
            }
            try {
                const stationUsers = JSON.parse(userData);

                // Read ReadData.json
                fs.readFile(readDataFilePath, 'utf8', (err, readData) => {
                    if (err) {
                        console.error('Error reading ReadData.json:', err);
                        return;
                    }
                    try {
                        const readDataJson = JSON.parse(readData);

                        // Find the highest station number
                        const highestStation = Math.max(...stationUsers.map(user => user.station));

                        // Count "end" occurrences for highestStation
                        const highestStationEndCount = readDataJson.filter(
                            item => item.data === "end" && item.station === String(highestStation)
                        ).length;


                        // Loop through each station user
                        stationUsers.forEach(user => {

                            const stationKey = `station_${user.station}`;
                            if (jsonData[stationKey] && jsonData[stationKey].english) {
                            } else {
                                console.log(`English field not found for station ${user.station}`);
                            }

                        });

                    } catch (error) {
                        console.error('Error parsing ReadData.json:', error);
                    }
                });

            } catch (error) {
                console.error('Error parsing stationuser.json:', error);
            }
        });

    } catch (error) {
        console.error('Error parsing input.json:', error);
    }
});
