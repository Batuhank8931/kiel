const path = require('path');
const fs = require('fs');

const stationsjson = path.join(__dirname, 'jsons/stationuser.json');

const GetStationsChart = async (req, res) => {
    try {
        // Read stationuser.json
        const stationsData = await fs.promises.readFile(stationsjson, 'utf8');
        
        let stationsList = [];

        // Check if the file is not empty and valid JSON
        if (stationsData) {
            try {
                stationsList = JSON.parse(stationsData);
                // Ensure stationsList is an array, if not set to empty array
                if (!Array.isArray(stationsList)) stationsList = [];
            } catch (error) {
                console.error('Error parsing stationuser.json:', error);
            }
        }

        // Extract unique station numbers as station IDs
        const activeStationIds = new Set(stationsList.map(station => station.station));

        // Create stations array (assuming IDs from 1 to 20)
        const stations = Array.from({ length: 7 }, (_, i) => {
            const station_id = i + 1;
            return {
                station_id,
                active: activeStationIds.has(station_id.toString()) // Check if station ID exists
            };
        });

        // Return the generated stations array
        res.status(200).json(stations);

    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = GetStationsChart;
