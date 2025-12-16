const fs = require("fs");
const path = require("path");
const os = require("os");
const express = require("express");
const { exec } = require("child_process");

// ------------------------
// Port ve dist dizini
const PORT = 5173;

// pkg ile çalışacak şekilde paths
const BASE_PATH = path.dirname(process.execPath);
const DIST_PATH = path.join(BASE_PATH, "dist");
const CONFIG_PATH = path.join(BASE_PATH, "config.json");

console.log("[CLIENT] BASE_PATH:", BASE_PATH);
console.log("[CLIENT] DIST_PATH:", DIST_PATH);
console.log("[CLIENT] CONFIG_PATH:", CONFIG_PATH);

// ------------------------
// IP alma
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let fallback = "127.0.0.1";

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === "IPv4" &&
        !iface.internal
      ) {
        // LAN önceliği
        if (
          iface.address.startsWith("192.168.") ||
          iface.address.startsWith("10.")
        ) {
          console.log("[CLIENT] Selected LAN IP:", iface.address);
          return iface.address;
        }

        // fallback olarak sakla
        fallback = iface.address;
      }
    }
  }

  console.log("[CLIENT] Fallback IP:", fallback);
  return fallback;
}


const LOCAL_IP = getLocalIP();

// ------------------------
// Config güncelle
let configContent = {};
try {
  if (fs.existsSync(CONFIG_PATH)) {
    console.log("[CLIENT] config.json bulundu, okunuyor...");
    configContent = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    console.log("[CLIENT] config.json içeriği:", configContent);
  } else {
    console.log("[CLIENT] config.json bulunamadı, yeni oluşturulacak");
  }
} catch (err) {
  console.warn("[CLIENT] Config okunamadı, yeni oluşturuluyor:", err);
}

configContent.API_HOST = LOCAL_IP;
configContent.API_PORT = "3008";

try {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(configContent, null, 2), "utf-8");
  console.log(`[CLIENT] ✅ config.json güncellendi: ${CONFIG_PATH}`);
  console.log(`[CLIENT] 🌍 Yeni IP: ${LOCAL_IP}, PORT: ${configContent.API_PORT}`);
} catch (err) {
  console.error("[CLIENT] config.json yazılamadı:", err);
}

// ------------------------
// Express app ile serve
const app = express();

if (!fs.existsSync(DIST_PATH)) {
  console.error("[CLIENT] DIST_PATH bulunamadı:", DIST_PATH);
} else {
  console.log("[CLIENT] DIST_PATH bulundu, static serve başlatılıyor");
}

// ------------------------
// CONFIG_PATH'i serve et
app.get("/config.json", (req, res) => {
  res.sendFile(CONFIG_PATH);
});


// React build dosyalarını sun
app.use(express.static(DIST_PATH));


// SPA fallback
app.get(/.*/, (req, res) => {
  const indexPath = path.join(DIST_PATH, "index.html");
  console.log("[CLIENT] index.html servisi:", indexPath);
  if (!fs.existsSync(indexPath)) {
    console.error("[CLIENT] index.html bulunamadı:", indexPath);
    return res.status(404).send("index.html bulunamadı!");
  }
  res.sendFile(indexPath);
});

// Server başlat
app.listen(PORT, "0.0.0.0", () => {
  const baseUrl = `http://${LOCAL_IP}:${PORT}`;
  const carouselUrl = `${baseUrl}/CarouselPage`;

  console.log(`[CLIENT] 🚀 React app running at ${baseUrl}`);

  const startCmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
      ? "start"
      : "xdg-open";

  // Ana sayfa
  exec(`${startCmd} ${baseUrl}`, (err) => {
    if (err) console.error("[CLIENT] Tarayıcı açılamadı:", err);
  });

  // 2️⃣ CarouselPage (yeni sekme)
  setTimeout(() => {
    exec(`${startCmd} ${carouselUrl}`, (err) => {
      if (err) console.error("[CLIENT] CarouselPage açılamadı:", err);
    });
  }, 500);
});
