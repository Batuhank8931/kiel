const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const UsePrinter = (barcode) => {
    return new Promise((resolve, reject) => {
        try {

            const zplFolderPath = path.resolve('C:/Users/Mehmet/Desktop/kiel/server/python-scripts');
            if (!fs.existsSync(zplFolderPath)) {
                fs.mkdirSync(zplFolderPath, { recursive: true });
            }


            const zplFilePath = path.join(zplFolderPath, 'barcode.zpl');

            // Write the barcode data into the file
            fs.writeFileSync(zplFilePath, barcode);

            // Define the Python executable and script paths C:\Users\Mehmet\Desktop\kiel\server\python-scripts\barcode.zpl
            //C:\Users\Mehmet\AppData\Local\Programs\Python\Python313
            const pythonPath = 'C:/Users/Mehmet/AppData/Local/Programs/Python/Python313/python.exe';
            const pythonScriptPath = path.resolve('C:/Users/Mehmet/Desktop/kiel/server/python-scripts/print_barcode.py');

            // Execute the Python script to print the barcode
            const command = `"${pythonPath}" "${pythonScriptPath}" "${zplFilePath}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing Python script: ${error.message}`);
                    return reject("Error printing barcode");
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return reject("Error printing barcode");
                }
                console.log(`stdout: ${stdout}`);
                resolve("Data printed successfully");
            });

        } catch (error) {
            console.error(error);
            reject("Something went wrong");
        }
    });
};

module.exports = { UsePrinter };
