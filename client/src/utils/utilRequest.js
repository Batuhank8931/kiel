import axios from "axios";

// Runtime config yükleme
let configCache = null;
async function loadConfig() {
  if (!configCache) {
    try {
      const res = await fetch("/config.json"); // artık Node server üzerinden serve ediliyor
      if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);

      configCache = await res.json();
    } catch (err) {
      console.error("Config yüklenemedi:", err);
      configCache = { API_HOST: "127.0.0.1", API_PORT: 5173 }; // fallback
    }
  }
  return configCache;
}

// Base URL ve Auth URL dinamik
async function getBaseUrl() {
  const config = await loadConfig();
  return `http://${config.API_HOST}:${config.API_PORT}/api/`;
}

// Headers fonksiyonu
async function headersF() {
  return {
    "Content-Type": "application/json",
    Accept: "*/*",
  };
}

// API wrapper
const API = {

  GetStationImageById: async (id, file) => {
    const baseUrl = await getBaseUrl();
    const formData = new FormData();
    formData.append("image", file);

    return axios.post(`${baseUrl}getstationobject/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  GetStatusChart: async () => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}statuschart`, { headers: await headersF() });
  },

  InsertOutputTable: async () => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}insertoutputable`, { headers: await headersF() });
  },

  ResetInputTable: async () => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}resetInputable`, { headers: await headersF() });
  },

  GetEmployeesChart: async () => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}employeeschart`, { headers: await headersF() });
  },

  GetStationsChart: async () => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}stationschart`, { headers: await headersF() });
  },

  GetProductBarcodes: async () => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}getproductbarcodes`, { headers: await headersF() });
  },

  printBarcode: async (body) => {
    const baseUrl = await getBaseUrl();
    return axios.post(`${baseUrl}printbarcode`, body, { headers: await headersF() });
  },

  PostReady: async (body) => {
    const baseUrl = await getBaseUrl();
    return axios.post(`${baseUrl}postready`, body, { headers: await headersF() });
  },

  informReady: async () => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}informready`, { headers: await headersF() });
  },

  OperationNumber: async () => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}operationnumber`, { headers: await headersF() });
  },

  SetUsertoStation: async (body) => {
    const baseUrl = await getBaseUrl();
    return axios.post(`${baseUrl}setusertostation`, body, { headers: await headersF() });
  },

  GetReadData: async (body) => {
    const baseUrl = await getBaseUrl();
    return axios.post(`${baseUrl}getreaddata`, body, { headers: await headersF() });
  },

  getRawdata: async (station_id) => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}getallrawdata/${station_id}`, { headers: await headersF() });
  },

  userInfo: async (body) => {
    const baseUrl = await getBaseUrl();
    return axios.post(`${baseUrl}userinfo/`, body, { headers: await headersF() });
  },

  getUsers: async () => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}users/`, { headers: await headersF() });
  },

  putUsers: async (body) => {
    const baseUrl = await getBaseUrl();
    return axios.put(`${baseUrl}users/`, body, { headers: await headersF() });
  },

  deleteUsers: async (seriNo) => {
    const baseUrl = await getBaseUrl();
    return axios.delete(`${baseUrl}users/${seriNo}`, { headers: await headersF() });
  },

  GetstationPicture: async (id) => {
    const baseUrl = await getBaseUrl();
    return axios.get(`${baseUrl}getstationpicture/${id}`, {
      headers: await headersF(),
      responseType: 'blob',
    });
  },
};

export default API;
