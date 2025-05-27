const path = require('path');
const fs = require('fs');

const stationsjson = path.join(__dirname, 'jsons/stationuser.json');

const GetEmployeesChart = async (req, res) => {
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

        // Extract unique station numbers as employee IDs
        const activeEmployeeIds = new Set(stationsList.map(station => station.station));

        // Create employees array (assuming IDs from 1 to 20)
        const employees = Array.from({ length: 7 }, (_, i) => {
            const employee_id = i + 1;
            return {
                employee_id,
                active: activeEmployeeIds.has(employee_id.toString()) // Check if station ID exists
            };
        });

        // Return the generated employees array
        res.status(200).json(employees);

    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = GetEmployeesChart;
