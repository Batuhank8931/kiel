const fs = require('fs').promises;
const path = require('path');

const readDataFilePath = path.join(__dirname, 'jsons/ReadData.json');
const jsonFilePath = path.join(__dirname, 'jsons/input.json');

const processStationData = (stationData) => {
    let previousEndTime = 0; // Track cumulative end time

    return stationData.reduce((result, item, index) => {
        const { product, data, difference } = item;

        if (data === "start") {
            const startTime = previousEndTime + difference; // Start after previous end + difference
            result.push({ product, product_code: item.product_code, start: startTime, end: 0, duration: index === 0 ? 0 : difference });
        } else if (data === "end") {
            // Find the last entry for this product and update its end time
            const lastEntry = result.find((entry) => entry.product === product && entry.end === 0);
            if (lastEntry) {
                lastEntry.end = lastEntry.start + difference;
                previousEndTime = lastEntry.end; // Update previousEndTime after end
            }
        }

        return result;
    }, []);
};

async function SavePageTwo() {
    try {
        const data = await fs.readFile(readDataFilePath, 'utf8');
        const inputData = await fs.readFile(jsonFilePath, 'utf8');
        const jsoninput = JSON.parse(inputData);
        const productCode = jsoninput.station_1.projectData[2];
        const jsonData = JSON.parse(data);

        // Group data by station
        const groupedData = jsonData.reduce((acc, item) => {
            if (!acc[item.station]) {
                acc[item.station] = [];
            }

            // Calculate the time difference

            //const currentTime = new Date(item.time);

            const breakDataTime = item.time; // e.g., "14.03.2025 00:10:59"
            // Convert DD.MM.YYYY HH:mm:ss format to YYYY-MM-DDTHH:mm:ss
            const [date, time] = breakDataTime.split(' ');
            const [day, month, year] = date.split('.');
            const formattedDate = `${year}-${month}-${day}T${time}`;
            const currentTime = new Date(formattedDate);



            const previousData = acc[item.station][acc[item.station].length - 1];

            let difference = 0;
            if (previousData) {

                const breakDataTime = previousData.time; // e.g., "14.03.2025 00:10:59"
                // Convert DD.MM.YYYY HH:mm:ss format to YYYY-MM-DDTHH:mm:ss
                const [date, time] = breakDataTime.split(' ');
                const [day, month, year] = date.split('.');
                const formattedDate = `${year}-${month}-${day}T${time}`;
                const previousTime = new Date(formattedDate);

                //const previousTime = new Date(previousData.time);

                difference = (currentTime - previousTime) / 1000; // Convert to seconds
            }

            // Push the current item with the calculated difference
            acc[item.station].push({
                product_code : productCode,
                product: item.product,
                data: item.data,
                time: item.time,
                difference
            });

            return acc;
        }, {});

        // Process each station’s data
        const processedData = Object.fromEntries(
            Object.entries(groupedData).map(([station, stationData]) => [
                station,
                processStationData(stationData)
            ])
        );

        return processedData; // Return the processed data
    } catch (error) {
        console.error('Error in SavePageTwo:', error);
        return {};
    }
}

module.exports = SavePageTwo;
