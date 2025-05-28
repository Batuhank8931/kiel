import axios from "axios";


//export const baseUrl = 'http://192.168.1.5:3005/api/';
//export const baseUrl = 'http://localhost:3005/api/';

export const baseUrl = import.meta.env.VITE_BASE_URL;

async function headersF() {
    return {
        "Content-Type": "application/json",
        Accept: "*/*",
    };
}

const API = {

    GetStatusChart: async () => {
        return axios.get(`${baseUrl}statuschart`, {
            headers: await headersF(),
        });
    },

    InsertOutputTable: async () => {
        return axios.get(`${baseUrl}insertoutputable`, {
            headers: await headersF(),
        });
    },

    GetEmployeesChart: async () => {
        return axios.get(`${baseUrl}employeeschart`, {
            headers: await headersF(),
        });
    },

    GetStationsChart: async () => {
        return axios.get(`${baseUrl}stationschart`, {
            headers: await headersF(),
        });
    },

    GetProductBarcodes: async () => {
        return axios.get(`${baseUrl}getproductbarcodes`, {
            headers: await headersF(),
        });
    },

    printBarcode: async (body) => {
        return axios.post(`${baseUrl}printbarcode`, body, {
            headers: await headersF(),
        });
    },

    PostReady: async (body) => {
        return axios.post(`${baseUrl}postready`, body, {
            headers: await headersF(),
        });
    },

    informReady: async () => {
        return axios.get(`${baseUrl}informready`, {
            headers: await headersF(),
        });
    },

    OperationNumber: async () => {
        return axios.get(`${baseUrl}operationnumber`, {
            headers: await headersF(),
        });
    },

    SetUsertoStation: async (body) => {
        return axios.post(`${baseUrl}setusertostation`, body, {
            headers: await headersF(),
        });
    },

    GetReadData: async (body) => {
        return axios.post(`${baseUrl}getreaddata`, body, {
            headers: await headersF(),
        });
    },

    // GET a specific device by device_id
    getRawdata: async (station_id) => {
        return axios.get(`${baseUrl}getallrawdata/${station_id}`, {
            headers: await headersF(),
        });
    },

    // GET a specific device by device_id
    getRawdata: async (station_id) => {
        return axios.get(`${baseUrl}getallrawdata/${station_id}`, {
            headers: await headersF(),
        });
    },


    userInfo: async (body) => {
        return axios.post(`${baseUrl}userinfo/`, body, {
            headers: await headersF(),
        });
    },

    // GET Users
    getUsers: async () => {
        return axios.get(`${baseUrl}users/`, {
            headers: await headersF(),
        });
    },

    // PUT User
    putUsers: async (body) => {
        return axios.put(`${baseUrl}users/`, body, {
            headers: await headersF(),
        });
    },

    // delete User
    deleteUsers: async (seriNo) => {
        return axios.delete(`${baseUrl}users/${seriNo}`, {
            headers: await headersF(),
        });
    },

}

export default API;
