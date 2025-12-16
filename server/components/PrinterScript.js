const fs = require('fs/promises');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

const UsePrinter = async (barcode) => {
    try {
        const scriptsDir = path.join(path.dirname(process.execPath), 'python-scripts');
        await fs.mkdir(scriptsDir, { recursive: true });

        const zplPath = path.join(scriptsDir, 'barcode.zpl');
        await fs.writeFile(zplPath, barcode);

        const exePath = path.join(scriptsDir, 'print_barcode.exe');

        await execFileAsync(exePath, [zplPath], { windowsHide: true });

        return 'Data printed successfully';
    } catch (err) {
        console.error('Barcode print error:', err);
        if (err.stderr) console.error('stderr:', err.stderr);
        if (err.stdout) console.error('stdout:', err.stdout);
        throw new Error('Error printing barcode');
    }
};

module.exports = { UsePrinter };
