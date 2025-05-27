const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "jsons/readyset.json");

const PostReady = async (req, res) => {
    try {

        const readyset = req.body.readyset;

        // Save the boolean data to a JSON file
        fs.writeFileSync(filePath, JSON.stringify({ readyset }, null, 2), "utf8");

        return res.status(200).json({ message: "User Scan is Ready" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const informReady = async (req, res) => {
    try {

        // Read the saved JSON file
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            const jsonData = JSON.parse(data);

            return res.status(200).json(jsonData);
        } else {
            return res.status(404).json({ message: "No data found" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { PostReady, informReady };
