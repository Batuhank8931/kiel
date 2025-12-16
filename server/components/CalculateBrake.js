const fs = require('fs');
const fsp = fs.promises; // promises fs
const path = require('path');

// EXE’nin çalıştığı dizine göre path
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');
const readBreakFilePath = path.join(dataDir, 'BreakData.json');

// Function to calculate total break time per station
async function calculateTotalBreakTime() {
    // Read BreakData.json
    const readBreakData = await fs.promises.readFile(readBreakFilePath, 'utf8');
    const data = JSON.parse(readBreakData);

    const stationData = {};

    // Loop through the data to group by station
    data.forEach(item => {
        const station = item.station;
        if (!stationData[station]) {
            stationData[station] = [];
        }
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
                const [date, time] = breakDataTime.split(' ');
                const [day, month, year] = date.split('.');
                const formattedDate = `${year}-${month}-${day}T${time}`;
                const startTime = new Date(formattedDate);

                const endBreak = breaks[i + 1];
                if (endBreak && endBreak.data === 'end') {
                    const [endDate, endTime] = endBreak.time.split(' ');
                    const [endDay, endMonth, endYear] = endDate.split('.');
                    const formattedEndDate = `${endYear}-${endMonth}-${endDay}T${endTime}`;
                    const endTimeObj = new Date(formattedEndDate);

                    totalBreakTime += (endTimeObj - startTime) / 1000; // seconds
                }
            }
        }

        stationBreakTimes[station] = totalBreakTime;
    });

    return stationBreakTimes;
}

module.exports = calculateTotalBreakTime;
