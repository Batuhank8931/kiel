const path = require('path');
const fs = require('fs');

const stationsjson = path.join(__dirname, 'jsons/stationuser.json');

const GetStationsChart = async (req, res) => {
    try {
        const stationsData = await fs.promises.readFile(stationsjson, 'utf8');
        let stationsList = [];

        if (stationsData) {
            try {
                stationsList = JSON.parse(stationsData);
                if (!Array.isArray(stationsList)) stationsList = [];
            } catch (error) {
                console.error('Error parsing stationuser.json:', error);
            }
        }

        // Create the final stations array (IDs from 1 to 7)
        const stations = Array.from({ length: 7 }, (_, i) => {
            const station_id = (i + 1).toString();

            // Find the *first* user assigned to this station
            const user = stationsList.find(s => s.station === station_id);

            return {
                station_id: parseInt(station_id),
                active: !!user,
                name: user ? user.name : '',
                surname: user ? user.surname : ''
            };
        });

        res.status(200).json(stations);

    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = GetStationsChart;
