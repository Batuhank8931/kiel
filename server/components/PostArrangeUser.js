const fs = require("fs");
const path = require("path");

// EXE uyumlu klasörler
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');

// Yazılabilir klasörleri EXE dışında oluştur
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersFilePath = path.join(dataDir, 'users.json');
const stationUserFilePath = path.join(dataDir, 'stationuser.json');


const SetUsertoStation = async (req, res) => {
    try {
        const { barcode, station } = req.body;

        // Read users.json
        const usersData = fs.existsSync(usersFilePath) 
            ? JSON.parse(fs.readFileSync(usersFilePath, "utf8")) 
            : [];

        // Find user with matching barcode
        const matchedUser = usersData.find(user => user.barcode === barcode);

        if (!matchedUser) {
            return res.status(404).json({ message: "User not found for this barcode" });
        }

        // Create an entry to store
        const stationUserData = { ...matchedUser, station };

        // Read existing stationuser.json or initialize an empty array if not an array
        let stationUsers = fs.existsSync(stationUserFilePath) 
            ? JSON.parse(fs.readFileSync(stationUserFilePath, "utf8")) 
            : [];

        // Ensure it's an array
        if (!Array.isArray(stationUsers)) {
            stationUsers = [];
        }

        // Check if there's already a user assigned to the same station
        const existingStationUserIndex = stationUsers.findIndex(user => user.station === station);

        if (existingStationUserIndex !== -1) {
            // Update the existing record
            stationUsers[existingStationUserIndex] = stationUserData;
        } else {
            // Add new record if no match
            stationUsers.push(stationUserData);
        }

        // Save to stationuser.json
        fs.writeFileSync(stationUserFilePath, JSON.stringify(stationUsers, null, 2));

        return res.status(200).json({ message: "User set to station successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { SetUsertoStation };
