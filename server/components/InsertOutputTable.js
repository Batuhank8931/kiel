const fs   = require('fs');
const XLSX = require('xlsx');
const path = require('path');
const SavePageOne = require('./SavePageOne');
const SavePageTwo = require('./SavePageTwo');

const outputFolder = path.join(__dirname, '../../outputs');
const outputFile   = path.join(outputFolder, 'outputs.xlsx');   // <‑‑ single workbook

async function insertfunction() {
  const [result1, result2] = await Promise.all([SavePageOne(), SavePageTwo()]);

  /* ───── build the data arrays exactly as before ───── */
  const now         = new Date();
  const today       = now.toISOString().split('T')[0];                    // 2025‑05‑28
  const currentTime = now.toISOString().split('T')[1]                     // 17:04:22.123Z
                         .split('.')[0]                                   // 17:04:22
                         .replace(/:/g, '-');                              // 17‑04‑22

  const sheetBase   = `output_${today}_${currentTime}`;                   // worksheet name

  /* --------------- SHEET 1 (result1) --------------- */
  const sheet1Rows = [];
  result1.forEach(item => {
    Object.values(item).forEach(station => {
      sheet1Rows.push([
        today,
        station['Start Time'],
        station['Project Code'],
        station['Project Name'],
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

  const ws1 = XLSX.utils.aoa_to_sheet([
    ['Date','Start Time','Project Code','Project Name','Production Code','Operator Name',
     'Station Number','Operations','Total Operations','Remaining','Completed',
     'Total Operation Time','Total Duration','Total Break Time'],
    ...sheet1Rows
  ]);

  /* --------------- SHEET 2 (result2) --------------- */
  const productKeys  = Object.keys(result2);
  const allProducts  = new Set(productKeys.flatMap(k => result2[k].map(e => e.product)));

  const headers = ['Product'];
  productKeys.forEach(k => headers.push(`Station ${k} Start`,`Station ${k} Finish`,`Duration`));

  const sheet2Rows = [];
  allProducts.forEach(product => {
    const row = [product];
    productKeys.forEach(station => {
      const found = result2[station].find(e => e.product === product) || {};
      row.push(found.start || 0, found.end || 0, found.duration || 0);
    });
    sheet2Rows.push(row);
  });

  const ws2 = XLSX.utils.aoa_to_sheet([headers, ...sheet2Rows]);

  /* ───── open or create the workbook, then append the new sheets ───── */
  const wb = fs.existsSync(outputFile) ? XLSX.readFile(outputFile) : XLSX.utils.book_new();

  // ▸ If you only want ONE sheet per run, comment‑out the second append line.
  XLSX.utils.book_append_sheet(wb, ws1,  `${sheetBase}_page1`);   // 31‑char limit is fine
  XLSX.utils.book_append_sheet(wb, ws2,  `${sheetBase}_page2`);

  XLSX.writeFile(wb, outputFile);          // ← overwrites the same file, keeps older sheets
}

/* express handler stays the same */
const InsertOutputTable = async (req, res) => {
  try {
    await insertfunction();
    return res.status(200).json({ message: "Data is ready" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { InsertOutputTable };
