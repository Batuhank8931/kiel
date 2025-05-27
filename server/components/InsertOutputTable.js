const XLSX = require('xlsx');
const path = require('path');
const SavePageOne = require('./SavePageOne');
const SavePageTwo = require('./SavePageTwo');

// Define the output folder path
const outputFolder = path.join(__dirname, '../../outputs');

async function insertfunction() {
    const result1 = await SavePageOne();

    const result2 = await SavePageTwo();

    // Get today's date and time in the format YYYY-MM-DD_HH-MM-SS
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
    const currentTime = now.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-'); // Format as "HH-MM-SS"

    // Prepare the data to insert into Excel for Sheet1
    const data = [];

    result1.forEach((item) => {
        Object.keys(item).forEach((key) => {
            const station = item[key];
            const row = [
                today, // Column A (Today's Date)
                station['Start Time'], // Column B
                station['Project Code'], // Column C
                station['Project Name'], // Column D
                station['Production Code'], // Column E
                station['Operator Name'], // Column F
                station['Station'], // Column G
                station['Operations'].join(', '), // Column H (if it's an array)
                station['Total Operations'], // Column I
                station['Remaining'], // Column J
                station['Completed'], // Column K
                station['Total operation time'], // Column L
                station['Total Duration'], // Column M
                station['Total Break Time'] // Column N
            ];
            data.push(row);
        });
    });

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Add a new sheet with the data for Sheet1
    const ws1 = XLSX.utils.aoa_to_sheet([[
        'Date', 'Start Time', 'Project Code', 'Project Name', 'Production Code', 'Operator Name',
        'Station Number', 'Operations', 'Total Operations', 'Remaining', 'Completed', 'Total Operation Time', 'Total Duration', 'Total Break Time'
    ], ...data]); // Add headers and data rows
    XLSX.utils.book_append_sheet(wb, ws1, 'Sheet1');

    // Prepare data for Sheet2
    /*     const result2 = {
            '1': [
                { product: 'product1', start: 0, end: 7, duration: 0 },
                { product: 'product2', start: 9, end: 13, duration: 2 },
                { product: 'product3', start: 21, end: 30, duration: 8 }
            ],
            '2': [
                { product: 'product1', start: 0, end: 70, duration: 0 },
                { product: 'product2', start: 396, end: 591, duration: 326 },
                { product: 'product3', start: 1914, end: 1967, duration: 1323 },
                { product: 'product4', start: 2580, end: 2762, duration: 613 }
            ],
            '3': [
                { product: 'product1', start: 0, end: 162, duration: 0 },
                { product: 'product2', start: 260, end: 332, duration: 98 }
            ]
        }; */

    // Format data for Sheet2
    const sheet2Data = [];

    // Iterate over each product and format it into a row
    const allProducts = new Set();
    Object.keys(result2).forEach((productKey) => {
        result2[productKey].forEach((entry) => {
            allProducts.add(entry.product);
        });
    });

    const productKeys = Object.keys(result2);

    // Create dynamic headers based on product keys
    const headers = ['Product']; // Start with the 'Product' column
    productKeys.forEach((key) => {
        headers.push(`Station ${key} Start`, `Station ${key} Finish`, `Duration`);
    });

    // Loop over each product to ensure the data is in the correct format
    allProducts.forEach((product) => {
        const row = [product]; // First column: Product Name

        // Iterate through dynamic stations
        productKeys.forEach((station) => {
            const productData = result2[station]?.find((item) => item.product === product) || {};

            // Add station data for the current product
            row.push(productData.start || 0);
            row.push(productData.end || 0);
            row.push(productData.duration || 0);
        });

        // Add the formatted row to sheet2Data
        sheet2Data.push(row);
    });

    // Create a new sheet for Sheet2
    const ws2 = XLSX.utils.aoa_to_sheet([
        headers, // Dynamically generated headers
        ...sheet2Data // Add data rows for Sheet2
    ]);
    XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2');

    // Write the workbook to an output file with dynamic name
    const filename = `output_${today}_${currentTime}.xlsx`;
    const filePath = path.join(outputFolder, filename);
    XLSX.writeFile(wb, filePath);
}


const InsertOutputTable = async (req, res) => {
    try {
        await insertfunction(); // Await the insertion function to complete first
        return res.status(200).json({ message: "Data is ready" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};



module.exports = { InsertOutputTable };