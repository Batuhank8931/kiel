const fs = require('fs').promises;
const path = require('path');


const readBreakFilePath = path.join(__dirname, 'jsons/BreakData.json');

// Function to calculate total break time per station
async function calculateTotalBreakTime() {

    // Read BreakData.json
    const readBreakData = await fs.readFile(readBreakFilePath, 'utf8');
    const data = JSON.parse(readBreakData);

    const stationData = {};

    // Loop through the data to group by station
    data.forEach(item => {
        const station = item.station;

        // Initialize station data if not already
        if (!stationData[station]) {
            stationData[station] = [];
        }

        // Push break events to the station
        stationData[station].push(item);
    });

    // Calculate total break time for each station
    const stationBreakTimes = {};

    Object.keys(stationData).forEach(station => {
        let totalBreakTime = 0;
        const breaks = stationData[station];

        for (let i = 0; i < breaks.length; i++) {
            const breakData = breaks[i];

            if (breakData.data === 'start') {

                const breakDataTime = breakData.time; // e.g., "14.03.2025 00:10:59"
                // Convert DD.MM.YYYY HH:mm:ss format to YYYY-MM-DDTHH:mm:ss
                const [date, time] = breakDataTime.split(' ');
                const [day, month, year] = date.split('.');
                const formattedDate = `${year}-${month}-${day}T${time}`;
                const startTime = new Date(formattedDate);
                const endBreak = breaks[i + 1]; // Next event should be 'end'

                if (endBreak && endBreak.data === 'end') {
                    const endBreakTime = endBreak.time; // e.g., "14.03.2025 00:11:45"
                    // Convert DD.MM.YYYY HH:mm:ss format to YYYY-MM-DDTHH:mm:ss
                    const [date, time] = endBreakTime.split(' ');
                    const [day, month, year] = date.split('.');
                    const formattedDate = `${year}-${month}-${day}T${time}`;
                    const endTime = new Date(formattedDate);
                    const breakTime = (endTime - startTime) / 1000; // Calculate difference in seconds
                    totalBreakTime += breakTime;
                }
            }
        }

        stationBreakTimes[station] = totalBreakTime;
    });

    return stationBreakTimes;
}


module.exports = calculateTotalBreakTime;