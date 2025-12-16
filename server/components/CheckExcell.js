const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

// EXE yanındaki data/jsons klasörü
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');
const filePath = path.join(path.dirname(process.execPath), 'data', 'ProgramInput.xlsm');

const jsonFilePath = path.join(dataDir, 'input.json');
const readDataFilePath = path.join(dataDir, 'ReadData.json');
const stationUserFilePath = path.join(dataDir, 'stationuser.json');
const readyset = path.join(dataDir, 'readyset.json');
const BreakData = path.join(dataDir, 'BreakData.json');

// Klasör yoksa oluştur
async function ensureDataDir() {
  await fsp.mkdir(dataDir, { recursive: true });
}

// JSON dosyalarını temizle
const cleanJsonFiles = async () => {
  await ensureDataDir();

  await fsp.writeFile(readDataFilePath, JSON.stringify([], null, 2), 'utf-8');
  console.log('ReadData.json has been cleaned.');

  await fsp.writeFile(stationUserFilePath, JSON.stringify([], null, 2), 'utf-8');
  console.log('stationuser.json has been cleaned.');

  await fsp.writeFile(BreakData, JSON.stringify([], null, 2), 'utf-8');
  console.log('BreakData.json has been cleaned.');

  const readysetData = { readyset: 'Stop' };
  await fsp.writeFile(readyset, JSON.stringify(readysetData, null, 2), 'utf-8');
  console.log('readyset.json has been cleaned and updated.');
};

// Excel dosyasını oku
const readExcelFile = () => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return workbook.Sheets[sheetName];
  } catch (err) {
    console.error('Error reading Excel file:', err);
    return null;
  }
};

// Excel’den JSON’a aktar
const updateJsonFile = async () => {
  const worksheet = readExcelFile();
  if (!worksheet) return;

  const EnglishMap = { 1: 'B', 2: 'F', 3: 'J', 4: 'N', 5: 'B', 6: 'F', 7: 'J' };
  const SpanishMap = { 1: 'C', 2: 'G', 3: 'K', 4: 'O', 5: 'C', 6: 'G', 7: 'K' };
  const RequestedTimes = { 1: 'D', 2: 'H', 3: 'L', 4: 'P', 5: 'D', 6: 'H', 7: 'L' };

  const extractData = (column, startRow, endRow) => {
    const array = [];
    for (let i = startRow; i <= endRow; i++) {
      const cell = worksheet[`${column}${i}`];
      if (cell && cell.v !== undefined) array.push(cell.v);
    }
    return array;
  };

  const data = {};

  for (let stationId = 1; stationId <= 20; stationId++) {
    if (!EnglishMap[stationId]) continue;

    const englishArray = extractData(
      EnglishMap[stationId],
      stationId <= 4 ? 17 : 32,
      stationId <= 4 ? 28 : 42
    );

    const spanishArray = extractData(
      SpanishMap[stationId],
      stationId <= 4 ? 17 : 32,
      stationId <= 4 ? 28 : 42
    );

    const stepTime = extractData(
      RequestedTimes[stationId],
      stationId <= 4 ? 17 : 32,
      stationId <= 4 ? 28 : 42
    );

    const projectData = ['E10', 'E11', 'E12', 'E13', 'H10']
      .map(cell => worksheet[cell]?.v)
      .filter(v => v !== undefined);

    data[`station_${stationId}`] = {
      english: englishArray,
      spanish: spanishArray,
      projectData,
      stepTime
    };
  }

  await fsp.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Data updated in input.json');
};

// Tek fonksiyon halinde çalıştır
const WatchExcelFile = async () => {
    // Başlangıçta bir kere çalıştır
    (async () => {
        await cleanJsonFiles();
        await updateJsonFile();
        console.log('Initial Excel processing done.');
    })();

    // Excel değişikliklerini izle
    fs.watchFile(filePath, { interval: 1000 }, async (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            console.log('Excel file changed, updating JSON...');
            await cleanJsonFiles();
            await updateJsonFile();
        }
    });
};



module.exports = WatchExcelFile;
