const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'ProgramInput.xlsx');
const jsonFilePath = path.join(__dirname, 'jsons/barcodes.json');

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

const generateBarcodes = (productCode, amount, productName) => {
    let barcodes = [];
    for (let i = 1; i <= amount; i++) {
        barcodes.push(`product${i}no${productCode}`);
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
    const barcodes = generateBarcodes(productCode, amount, productID);

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
