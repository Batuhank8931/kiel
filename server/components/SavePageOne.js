const fs = require('fs').promises;
const path = require('path');

const jsonFilePath = path.join(__dirname, 'jsons/input.json');
const stationUserFilePath = path.join(__dirname, 'jsons/stationuser.json');
const readDataFilePath = path.join(__dirname, 'jsons/ReadData.json');
const calculateTotalBreakTime = require('./CalculateBrake');


async function SavePageOne() {
    try {
        const stationsArray = [];
        const result = await calculateTotalBreakTime(); // Call the function and wait for the result


        // Read input.json
        const inputData = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(inputData);
        const projectName = jsonData.station_1.projectData[0];
        const projectCode = jsonData.station_1.projectData[1];
        const productCode = jsonData.station_1.projectData[2];
        const totalOperations = jsonData.station_1.projectData[3];

        // Read stationuser.json
        const userData = await fs.readFile(stationUserFilePath, 'utf8');
        const stationUsers = JSON.parse(userData);

        // Read ReadData.json
        const readData = await fs.readFile(readDataFilePath, 'utf8');
        const readDataJson = JSON.parse(readData);

        // Find the highest station number
        const highestStation = Math.max(...stationUsers.map(user => user.station));

        // Count "end" occurrences for highestStation
        const highestStationEndCount = readDataJson.filter(
            item => item.data === "end" && item.station === String(highestStation)
        ).length;

        // Loop through each station user
        for (const user of stationUsers) {
            const operations = [];
            const stationKey = `station_${user.station}`;
            if (jsonData[stationKey] && jsonData[stationKey].english) {
                operations.push(jsonData[stationKey].english.join(',\n '));
            }

            // Find all "start" and "end" times for the station
            const stationData = readDataJson.filter(item => item.station === String(user.station));


            const startTimes = stationData
                .filter(item => item.data === "start")
                .map(item => {
                    // Convert the time format from "DD.MM.YYYY HH:mm:ss" to "YYYY-MM-DDTHH:mm:ss"
                    const [day, month, year, time] = item.time.split(/[\s.]+/);
                    const formattedTime = `${year}-${month}-${day}T${time}`;
                    return new Date(formattedTime);
                });

            const endTimes = stationData
                .filter(item => item.data === "end")
                .map(item => {
                    // Convert the time format from "DD.MM.YYYY HH:mm:ss" to "YYYY-MM-DDTHH:mm:ss"
                    const [day, month, year, time] = item.time.split(/[\s.]+/);
                    const formattedTime = `${year}-${month}-${day}T${time}`;
                    return new Date(formattedTime);
                });


            const startTimesText = stationData
                .filter(item => item.data === "start")
                .map(item => item.time);

            // First and last start/end
            const firstStart = startTimes.length > 0 ? startTimes[0] : null;
            const firstStartText = startTimesText.length > 0 ? startTimesText[0] : null;
            const lastEnd = endTimes.length > 0 ? endTimes[endTimes.length - 1] : null;
            const diffInSeconds = firstStart && lastEnd ? (lastEnd - firstStart) / 1000 : 0;

            let totalDifference = 0;
            for (let i = 0; i < Math.min(startTimes.length, endTimes.length); i++) {
                totalDifference += (endTimes[i] - startTimes[i]) / 1000;
            }

            // Prepare station data object
            const stationDataObj = {
                [`station ${user.station}`]: {
                    "Start Time": firstStartText,
                    "Project Code": projectCode,
                    "Project Name": projectName,
                    "Production Code": productCode,
                    "Operator Name": `${user.name} ${user.surname}`,
                    "Station": user.station,
                    "Operations": operations,
                    "Total Operations": totalOperations,
                    "Remaining": totalOperations - highestStationEndCount,
                    "Completed": highestStationEndCount,
                    "Total operation time": `${diffInSeconds}`,
                    "Total Duration": `${diffInSeconds - totalDifference} `,
                    "Total Break Time": `${result[user.station] || 0}`
                }
            };

            stationsArray.push(stationDataObj);
        }

        //console.log(stationsArray); // NOW IT WILL BE FILLED
        return stationsArray;

    } catch (error) {
        console.error('Error in SavePageOne:', error);
        return [];
    }
}

module.exports = SavePageOne;
