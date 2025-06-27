const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "jsons/ReadData.json");
const filePathBreak = path.join(__dirname, "jsons/BreakData.json");
const filePathUsers = path.join(__dirname, "jsons/stationuser.json");

const GetReadData = async (req, res) => {
    try {
        const { data, time, product, station, barcode, breakproduct } = req.body;

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
            let difference = 0;

            const stationBreaks = readBreaks.filter(entry => entry.station === station && entry.break);



            if (stationBreaks.length > 0) {
                const checkproduct = breakproduct;
                const filteredBreaks = stationBreaks.filter(
                    (entry) => entry.breakproduct === checkproduct
                );

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

                if (filteredBreaks.length > 0) {
                    const lastBreak = filteredBreaks[filteredBreaks.length - 1];
                    const lastBreakTotal = lastBreak.difference;
                    // Convert the time strings to Date objects
                    const [day1, month1, year1, hour1, min1, sec1] = lastBreak.time.match(/\d+/g);
                    const [day2, month2, year2, hour2, min2, sec2] = time.match(/\d+/g);

                    const date1 = new Date(`${year1}-${month1}-${day1}T${hour1}:${min1}:${sec1}`);
                    const date2 = new Date(`${year2}-${month2}-${day2}T${hour2}:${min2}:${sec2}`);

                    if (data === "start") {
                        difference = lastBreakTotal;
                    } else if (data === "end") {
                        difference = Math.floor(((date2 - date1) / 1000) + lastBreakTotal);
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
                surname: user.surname,
                breakproduct,
                difference
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
