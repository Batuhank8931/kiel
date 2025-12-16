const path = require('path');
const fs = require('fs');

const GetStationPicture = (req, res) => {
    const { id } = req.params;

    const folderPath = path.join(process.cwd(), 'stationpictures');

    // Dosya uzantılarını kontrol et
    const extensions = ['png', 'jpg', 'jpeg', 'gif'];

    let foundFile = null;

    for (const ext of extensions) {
        const filePath = path.join(folderPath, `${id}.${ext}`);
        if (fs.existsSync(filePath)) {
            foundFile = filePath;
            break;
        }
    }

    if (foundFile) {
        return res.sendFile(foundFile);
    } else {
        return res.status(404).json({ message: `No picture found for station ${id}` });
    }
};

module.exports = {
    GetStationPicture,
};
