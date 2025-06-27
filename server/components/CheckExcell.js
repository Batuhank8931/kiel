const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs').promises;

const filePath = path.join(__dirname, 'ProgramInput.xlsm');
const jsonFilePath = path.join(__dirname, 'jsons/input.json');
const readDataFilePath = path.join(__dirname, 'jsons/ReadData.json');
const stationUserFilePath = path.join(__dirname, 'jsons/stationuser.json');
const readyset = path.join(__dirname, 'jsons/readyset.json');
const BreakData = path.join(__dirname, 'jsons/BreakData.json');

const cleanJsonFiles = async () => {
    try {
        await fs.writeFile(readDataFilePath, JSON.stringify([], null, 2), 'utf-8');
        console.log('ReadData.json has been cleaned.');

        await fs.writeFile(stationUserFilePath, JSON.stringify([], null, 2), 'utf-8');
        console.log('stationuser.json has been cleaned.');

        await fs.writeFile(BreakData, JSON.stringify([], null, 2), 'utf-8');
        console.log('BreakData.json has been cleaned.');

        const readysetData = { readyset: 'Stop' };
        await fs.writeFile(readyset, JSON.stringify(readysetData, null, 2), 'utf-8');
        console.log('readyset.json has been cleaned and updated.');
    } catch (err) {
        console.error('Error cleaning JSON files:', err);
        throw err;
    }
};

const readExcelFile = () => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        return workbook.Sheets[sheetName];
    } catch (error) {
        console.error('Error reading Excel file:', error);
        return null;
    }
};

const updateJsonFile = async () => {
    const worksheet = readExcelFile();
    if (!worksheet) return;

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

    for (let stationId = 1; stationId <= 20; stationId++) {
        if (!EnglishMap[stationId]) continue;

        const englishColumn = EnglishMap[stationId];
        const spanishColumn = SpanishMap[stationId];
        const timeColumn = RequestedTimes[stationId];
        const startRow = stationId <= 4 ? 17 : 32;
        const endRow = stationId <= 4 ? 28 : 42;

        const englishArray = extractData(englishColumn, startRow, endRow);
        const spanishArray = extractData(spanishColumn, startRow, endRow);
        const stepTime = extractData(timeColumn, startRow, endRow);
        const projectData = ['E10', 'E11', 'E12', 'E13', 'H10']
            .map(cell => worksheet[cell]?.v)
            .filter(v => v !== undefined);

        data[`station_${stationId}`] = {
            english: englishArray,
            spanish: spanishArray,
            projectData: projectData,
            stepTime: stepTime
        };
    }

    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Data updated in input.json');
};

const WatchExcelFile = async (req, res) => {
    try {
        await cleanJsonFiles();
        await updateJsonFile();
        return res.status(200).json({ message: 'Data Updated' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = WatchExcelFile;
