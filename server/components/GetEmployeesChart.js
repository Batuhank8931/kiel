const path = require('path');
const fs = require('fs');

const stationsjson = path.join(__dirname, 'jsons/stationuser.json');

const GetEmployeesChart = async (req, res) => {
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

        // Filter out duplicate seriNo entries (keep the first occurrence)
        const uniqueBySeriNo = new Map();
        for (const item of stationsList) {
            if (!uniqueBySeriNo.has(item.seriNo)) {
                uniqueBySeriNo.set(item.seriNo, item);
            }
        }

        const uniqueStations = Array.from(uniqueBySeriNo.values());

        // Create a map of station number to employee info
        const stationToUser = new Map();
        for (const user of uniqueStations) {
            stationToUser.set(user.station, {
                name: user.name || "",
                surname: user.surname || ""
            });
        }

        // Create employees array from 1 to 7
        const employees = Array.from({ length: 7 }, (_, i) => {
            const employee_id = i + 1;
            const userInfo = stationToUser.get(employee_id.toString()) || { name: "", surname: "" };

            return {
                employee_id,
                active: stationToUser.has(employee_id.toString()),
                name: userInfo.name,
                surname: userInfo.surname
            };
        });

        // Sort active users first
        employees.sort((a, b) => {
            return (a.active === b.active) ? 0 : a.active ? -1 : 1;
        });

        res.status(200).json(employees);

    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = GetEmployeesChart;
