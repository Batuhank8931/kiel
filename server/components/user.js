const fs = require('fs');
const path = require('path');
const fsp = fs.promises;   

// EXE uyumlu klasörler
const dataDir = path.join(path.dirname(process.execPath), 'data', 'jsons');

// Yazılabilir klasörleri EXE dışında oluştur
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersFile = path.join(dataDir, 'users.json');
const stationfile = path.join(dataDir, 'stationuser.json');

const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};


const generateBarcode = (seriNo, name, surname) => {
  const namePrefix = name.slice(0, 2).toLowerCase();
  const surnamePrefix = surname.slice(0, 2).toLowerCase();
  return `UN${seriNo}${namePrefix}${surnamePrefix}`;
};


const Userinfo = async (req, res) => {
  const { station } = req.body;  // Access station from the request body

  if (station) {
    try {
      // Read the JSON file asynchronously
      const data = await fsp.readFile(stationfile, 'utf-8');
      const users = JSON.parse(data);

      // Find the user based on the 'station' value
      const user = users.find(u => u.station === station);

      if (user) {
        // Return the user's name and surname
        return res.json({ name: user.name, surname: user.surname });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      return res.status(500).json({ message: 'Error reading JSON file', error: err });
    }
  }

  // If no station parameter is provided, return an error
  res.status(400).json({ message: 'Station parameter is required' });
};



const getUser = async (req, res) => {
  const users = readUsers();
  const { seriNo } = req.query;

  if (seriNo) {
    const user = users.find(u => u.seriNo === seriNo);
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }

  res.json(users);
};


const deleteUser = async (req, res) => {
  const users = readUsers();
  const { seriNo } = req.params;

  const filteredUsers = users.filter(u => u.seriNo !== seriNo);
  if (filteredUsers.length === users.length) {
    return res.status(404).json({ message: 'User not found' });
  }

  saveUsers(filteredUsers);
  res.json({ message: 'User deleted successfully' });
};


const putUsers = async (req, res) => {
  const users = readUsers();
  const newUser = req.body;
  newUser.barcode = generateBarcode(newUser.seriNo, newUser.name, newUser.surname);

  const existingUserIndex = users.findIndex(u => u.seriNo === newUser.seriNo);

  if (existingUserIndex !== -1) {
    users[existingUserIndex] = newUser;
    saveUsers(users);
    return res.json({ message: 'User updated successfully' });
  }


  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ message: 'User added successfully' });
};

module.exports = { Userinfo, getUser, deleteUser, putUsers };
