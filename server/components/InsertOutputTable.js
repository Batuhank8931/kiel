const fs = require('fs');           // sync fs
const fsp = fs.promises;            // promises fs
const XLSX = require('xlsx');
const path = require('path');
const SavePageOne = require('./SavePageOne');
const SavePageTwo = require('./SavePageTwo');

// EXE uyumlu klasörler
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');

// Yazılabilir klasörleri EXE dışında oluştur
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const outputFolder = path.join(process.cwd(), 'outputs'); // EXE yanında yazılabilir
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

const outputFile = path.join(outputFolder, 'outputs.xlsx');

const readDataFilePath = path.join(dataDir, 'ReadData.json');
const stationUserFilePath = path.join(dataDir, 'stationuser.json');
const readyset = path.join(dataDir, 'readyset.json');
const BreakData = path.join(dataDir, 'BreakData.json');

const cleanJsonFiles = async () => {
  try {
    await fsp.writeFile(readDataFilePath, JSON.stringify([], null, 2), 'utf8');
    console.log('ReadData.json has been cleaned.');

    await fsp.writeFile(stationUserFilePath, JSON.stringify([], null, 2), 'utf8');
    console.log('stationuser.json has been cleaned.');

    await fsp.writeFile(BreakData, JSON.stringify([], null, 2), 'utf8');
    console.log('BreakData.json has been cleaned.');

    const readysetData = { readyset: 'Stop' };
    await fsp.writeFile(readyset, JSON.stringify(readysetData, null, 2), 'utf8');
    console.log('readyset.json has been cleaned and updated.');
  } catch (err) {
    console.error('Error cleaning JSON files:', err);
    throw err;
  }
};

const sheet2Headers = [
  'Production Code', 'Product',
  'Station 1 Start', 'Station 1 Finish', 'Duration1',
  'Station 2 Start', 'Station 2 Finish', 'Duration2',
  'Station 3 Start', 'Station 3 Finish', 'Duration3',
  'Station 4 Start', 'Station 4 Finish', 'Duration4',
  'Station 5 Start', 'Station 5 Finish', 'Duration5',
  'Station 6 Start', 'Station 6 Finish', 'Duration6',
  'Station 7 Start', 'Station 7 Finish', 'Duration7'
];

async function insertfunction() {
  const [result1, result2] = await Promise.all([SavePageOne(), SavePageTwo()]);

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const sheetName1 = 'Output-Page1';
  const sheetName2 = 'Output-Page2';

  // New rows for Output-Page1
  const newSheet1Rows = [];
  result1.forEach(item => {
    Object.values(item).forEach(station => {
      newSheet1Rows.push([
        today,
        station['Start Time'],
        station['Project Name'],
        station['Seat Type'],
        station['Production Code'],
        station['Operator Name'],
        station['Station'],
        station['Operations'].join(', '),
        station['Total Operations'],
        station['Remaining'],
        station['Completed'],
        station['Total operation time'],
        station['Total Duration'],
        station['Total Break Time']
      ]);
    });
  });

  // New rows for Output-Page2
  const productKeys = Object.keys(result2);
  const allProducts = new Set(productKeys.flatMap(k => result2[k].map(e => e.product)));

  const newSheet2Rows = [];

  allProducts.forEach(product => {
    let productCode = '';
    for (const station of productKeys) {
      const entry = result2[station].find(e => e.product === product);
      if (entry?.product_code) {
        productCode = entry.product_code;
        break;
      }
    }

    const row = Array(sheet2Headers.length).fill(''); // Initialize entire row with empty cells
    row[0] = productCode;
    row[1] = product;

    for (const station of productKeys) {
      const entry = result2[station].find(e => e.product === product) || {};
      const baseIndex = sheet2Headers.indexOf(`Station ${station} Start`);
      if (baseIndex !== -1) {
        row[baseIndex] = entry.start ?? '';
        row[baseIndex + 1] = entry.end ?? '';
        row[baseIndex + 2] = entry.duration ?? '';
      }
    }

    newSheet2Rows.push(row);
  });

  // Load or create workbook
  const wb = fs.existsSync(outputFile)
    ? XLSX.readFile(outputFile)
    : XLSX.utils.book_new();

  // --- Append to Output-Page1 ---
  const ws1 = wb.Sheets[sheetName1]
    ? XLSX.utils.sheet_to_json(wb.Sheets[sheetName1], { header: 1 })
    : [['Date', 'Start Time', 'Project Name', 'Seat Type', 'Production Code', 'Operator Name',
      'Station Number', 'Operations', 'Total Operations', 'Remaining', 'Completed',
      'Total Operation Time', 'Total Duration', 'Total Break Time']];

  const updatedSheet1Data = [...ws1, ...newSheet1Rows];
  const updatedWs1 = XLSX.utils.aoa_to_sheet(updatedSheet1Data);
  wb.Sheets[sheetName1] = updatedWs1;
  if (!wb.SheetNames.includes(sheetName1)) wb.SheetNames.push(sheetName1);

  // --- Append to Output-Page2 ---
  const ws2 = wb.Sheets[sheetName2]
    ? XLSX.utils.sheet_to_json(wb.Sheets[sheetName2], { header: 1 })
    : [sheet2Headers];

  const updatedSheet2Data = [...ws2, ...newSheet2Rows];
  const updatedWs2 = XLSX.utils.aoa_to_sheet(updatedSheet2Data);
  wb.Sheets[sheetName2] = updatedWs2;
  if (!wb.SheetNames.includes(sheetName2)) wb.SheetNames.push(sheetName2);

  // Save back to file
  XLSX.writeFile(wb, outputFile);
}

/* -------- Express handler -------- */
const InsertOutputTable = async (req, res) => {
  try {
    await insertfunction();
    await cleanJsonFiles();
    return res.status(200).json({ message: "Data is ready and JSON files cleaned" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { InsertOutputTable };
