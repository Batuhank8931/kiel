const fs = require('fs/promises');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

const UsePrinter = async (barcode) => {
    try {
        const scriptsDir = path.resolve(__dirname, '../python-scripts');
        await fs.mkdir(scriptsDir, { recursive: true });

        const zplPath = path.join(scriptsDir, 'barcode.zpl');
        await fs.writeFile(zplPath, barcode);

        const pythonExe = 'C:/Users/Mehmet/AppData/Local/Programs/Python/Python313/python.exe';
        //const pythonExe = 'python3'; 
        const scriptPath = path.join(scriptsDir, 'print_barcode.py');

        await execFileAsync(pythonExe, [scriptPath, zplPath], { windowsHide: true });

        return 'Data printed successfully';
    } catch (err) {
        console.error('Barcode print error:', err);
        throw new Error('Error printing barcode');
    }
};

module.exports = { UsePrinter };
