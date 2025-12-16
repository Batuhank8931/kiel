const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// EXE’nin çalıştığı dizine göre path
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');
const filePath = path.join(path.dirname(process.execPath), 'data', 'ProgramInput.xlsm');


const jsonFilePath = path.join(dataDir, 'barcodes.json');



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

const generateBarcodes = (amount, productName) => {
    let barcodes = [];
    for (let i = 1; i <= amount; i++) {
        barcodes.push(`product${i}no${productName}`);
        //barcodes.push(`end${i}no${productCode}`);
    }
    return barcodes;
};

const updateJsonFile = () => {
    const worksheet = readExcelFile();
    if (!worksheet) return;

    const projectData = ["E10", "E11", "E12", "E13"].map(cell => worksheet[cell]?.v).filter(value => value !== undefined);
    if (projectData.length < 4) {
        console.error('Error: Missing required data in projectData');
        return;
    }

    const [productName, productCode, productID, amount] = projectData;
    const barcodes = generateBarcodes( amount, productName);

    const data = { barcodes };
    
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
    console.log('Data updated in barcodes.json');
};

const watchBarcodesFile = () => {
    fs.watchFile(filePath, { interval: 1000 }, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            console.log('Excel file changed, updating JSON...');
            updateJsonFile();
        }
    });
};

module.exports = {
    updateJsonFile,
    watchBarcodesFile,
};
