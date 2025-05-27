const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "jsons/ReadData.json");
const filePathBreak = path.join(__dirname, "jsons/BreakData.json");
const filePathUsers = path.join(__dirname, "jsons/stationuser.json");

const GetReadData = async (req, res) => {
    try {
        const { data, time, product, station, barcode } = req.body; 

        const stationUserData = JSON.parse(fs.readFileSync(filePathUsers, "utf-8"));
        const user = stationUserData.find(user => user.station === station);

        if (!user) {
            return res.status(404).json({ message: "Station not found in stationuser.json" });
        }

        let readData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        let readBreaks = JSON.parse(fs.readFileSync(filePathBreak, "utf-8"));

        if (!Array.isArray(readData)) {
            readData = [];
        }

        if (!Array.isArray(readBreaks)) {
            readBreaks = [];
        }

        const existingEntryIndex = readData.findIndex(entry =>
            entry.data === data &&
            entry.product === product &&
            entry.station === station &&
            entry.seriNo === user.seriNo
        );

        if (existingEntryIndex !== -1 && product !== "BREAK") {
            return res.status(200).json({ message: "Data already exists, no changes made" });
        }

        if (product !== "BREAK") {
            readData.push({
                data,
                time,
                product,
                station,
                barcode,
                seriNo: user.seriNo,
                name: user.name,
                surname: user.surname
            });
            fs.writeFileSync(filePath, JSON.stringify(readData, null, 2));
        } else {
            let breakNumber = 1;

            const stationBreaks = readBreaks.filter(entry => entry.station === station && entry.break);

            if (stationBreaks.length > 0) {
                const breakNumbers = stationBreaks
                    .map(entry => entry.break)
                    .filter(num => !isNaN(num));

                if (breakNumbers.length > 0) {
                    const maxBreak = Math.max(...breakNumbers);
                    const breakCount = breakNumbers.filter(b => b === maxBreak).length;

                    if (breakCount >= 2) {
                        breakNumber = maxBreak + 1;
                    } else {
                        breakNumber = maxBreak;
                    }
                }
            }

            readBreaks.push({
                data,
                time,
                break: breakNumber,
                station,
                barcode,
                seriNo: user.seriNo,
                name: user.name,
                surname: user.surname
            });

            fs.writeFileSync(filePathBreak, JSON.stringify(readBreaks, null, 2));
        }

        return res.status(200).json({ message: "Data successfully inserted" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { GetReadData };
