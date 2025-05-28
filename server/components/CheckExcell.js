const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'ProgramInput.xlsm');
const jsonFilePath = path.join(__dirname, 'jsons/input.json');
const readDataFilePath = path.join(__dirname, 'jsons/ReadData.json');
const stationUserFilePath = path.join(__dirname, 'jsons/stationuser.json');
const readyset = path.join(__dirname, 'jsons/readyset.json');
const BreakData = path.join(__dirname, 'jsons/BreakData.json');

// Function to clean existing JSON files
const cleanJsonFiles = () => {
    // Clean ReadData.json
    fs.writeFileSync(readDataFilePath, JSON.stringify([], null, 2), 'utf-8');
    console.log('ReadData.json has been cleaned.');

    // Clean stationuser.json
    fs.writeFileSync(stationUserFilePath, JSON.stringify([], null, 2), 'utf-8');
    console.log('stationuser.json has been cleaned.');

    // Clean stationuser.json
    fs.writeFileSync(BreakData, JSON.stringify([], null, 2), 'utf-8');
    console.log('BreakData.json has been cleaned.');

    // Clean and update readyset.json with new data
    const readysetData = {
        "readyset": "Stop"
    };
    fs.writeFileSync(readyset, JSON.stringify(readysetData, null, 2), 'utf-8');
    console.log('readyset.json has been cleaned and updated.');
};


// Function to read and parse the Excel file
const readExcelFile = () => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return worksheet;
    } catch (error) {
        console.error('Error reading Excel file:', error);
        return null;
    }
};

// Function to extract data from Excel and update the JSON file
const updateJsonFile = () => {
    const worksheet = readExcelFile();
    if (!worksheet) return;

    // Define mappings for station columns

    const EnglishMap = {
        1: 'B', 2: 'F', 3: 'J', 4: 'N',
        5: 'B', 6: 'F', 7: 'J'
    };

    const SpanishMap = {
        1: 'C', 2: 'G', 3: 'K', 4: 'O',
        5: 'C', 6: 'G', 7: 'K'
    };

    const RequestedTimes = {
        1: 'D', 2: 'H', 3: 'L', 4: 'P',
        5: 'D', 6: 'H', 7: 'L',
    };


    const EnglishMapOld = {
        1: 'B', 2: 'F', 3: 'J', 4: 'N', 5: 'R',
        6: 'V', 7: 'Z', 8: 'AD', 9: 'AH', 10: 'AL',
        11: 'B', 12: 'F', 13: 'J', 14: 'N', 15: 'R',
        16: 'V', 17: 'Z', 18: 'AD', 19: 'AH', 20: 'AL'
    };

    const SpanishMapOld = {
        1: 'C', 2: 'G', 3: 'K', 4: 'O', 5: 'S',
        6: 'W', 7: 'AA', 8: 'AE', 9: 'AI', 10: 'AM',
        11: 'C', 12: 'G', 13: 'K', 14: 'N', 15: 'S',
        16: 'W', 17: 'AA', 18: 'AE', 19: 'AI', 20: 'AM'
    };

    const RequestedTimesOld = {
        1: 'D', 2: 'H', 3: 'L', 4: 'P', 5: 'T',
        6: 'X', 7: 'AB', 8: 'AF', 9: 'AJ', 10: 'AN',
        11: 'D', 12: 'H', 13: 'L', 14: 'O', 15: 'T',
        16: 'X', 17: 'AB', 18: 'AF', 19: 'AJ', 20: 'AN'
    };

    const extractData = (column, startRow, endRow) => {
        let array = [];
        for (let i = startRow; i <= endRow; i++) {
            const cellAddress = `${column}${i}`;
            const cell = worksheet[cellAddress];
            if (cell && cell.v) {
                array.push(cell.v);
            }
        }
        return array;
    };

    const data = {};

    // Process data for all stations
    for (let stationId = 1; stationId <= 20; stationId++) {
        if (!EnglishMap[stationId]) continue;

        const englishColumn = EnglishMap[stationId];
        const spanishColumn = SpanishMap[stationId];
        const timeColumn = RequestedTimes[stationId];

        //const startRow = stationId <= 10 ? 17 : 32;
        //const endRow = stationId <= 10 ? 28 : 42;

        const startRow = stationId <= 4 ? 17 : 32;
        const endRow = stationId <= 4 ? 28 : 42;

        const englishArray = extractData(englishColumn, startRow, endRow);
        const spanishArray = extractData(spanishColumn, startRow, endRow);
        const stepTime = extractData(timeColumn, startRow, endRow);
        const projectData = ["E10", "E11", "E12", "E13"].map(cell => worksheet[cell]?.v).filter(value => value !== undefined);

        data[`station_${stationId}`] = {
            english: englishArray,
            spanish: spanishArray,
            projectData: projectData,
            stepTime: stepTime
        };
    }

    // Save data to the JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
    console.log('Data updated in input.json');
};

// Watch the Excel file for changes and update the JSON file accordingly
const watchExcelFile = () => {
    fs.watchFile(filePath, { interval: 1000 }, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            console.log('Excel file changed, cleaning JSON files and updating...');
            cleanJsonFiles();  // Clean JSON files before updating
            updateJsonFile();
        }
    });
};

// Start watching the Excel file
watchExcelFile();

// Export the functions to be used in server.js
module.exports = {
    updateJsonFile,
    watchExcelFile,
};
