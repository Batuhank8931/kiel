const { UsePrinter } = require('./PrinterScript'); // Import UsePrinter function

const PrintBarcode = async (req, res) => {
    try {
        if (!Array.isArray(req.body.barcodes)) {
            return res.status(400).json({ message: "Something Wrong" });
        }

        const barcodes = req.body.barcodes;

        // Iterate over the barcodes array and print each barcode
        for (let i = 0; i < barcodes.length; i++) {
            const zpl_code = barcodes[i];

            // Call the UsePrinter function from PrinterScript.js for each barcode
            const result = await UsePrinter(zpl_code);

            // If any barcode printing fails, return an error response
            if (result !== "Data printed successfully") {
                return res.status(500).json({ message: `Error printing barcode ${i + 1}` });
            }
        }

        // If all barcodes are printed successfully, send a success response
        return res.status(200).json({ message: "All barcodes printed successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = PrintBarcode;
