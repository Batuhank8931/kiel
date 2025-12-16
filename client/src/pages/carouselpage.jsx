import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import greenman from "../assets/greenman.png";
import grayman from "../assets/grayman.png";

import CarouselName from "../components/carouselname.jsx";
import PieChart from "../components/PieChart.jsx";
import StatusChart from "../components/StatusChart.jsx";
import API from "../utils/utilRequest";



const CarouselPage = () => {

    const [employees, setemployees] = useState([]);
    const [stations, setstations] = useState([]);
    const [isready, setisready] = useState("Stop");
    const [OperationData, setOperationData] = useState([]);
    const [totalOperations, settotalOperations] = useState("");
    const [remainingOperations, setremainingOperations] = useState("");
    const [remainingPercentage, setremainingPercentage] = useState(((remainingOperations / totalOperations) * 100));
    const [completedPercentage, setcompletedPercentage] = useState(100 - ((remainingOperations / totalOperations) * 100));


    const GetStatusChart = async () => {
        try {
            const response = await API.getRawdata(1);
            setOperationData(response.data[2]);

        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    useEffect(() => {
        checkchart();
        const interval = setInterval(checkchart, 3000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []); // Runs when id changes

    const checkchart = async () => {
        try {
            const response = await API.OperationNumber();

            const total = (response.data.totalOperations);
            const remain = (response.data.remainingOperations);


            settotalOperations(total);
            setremainingOperations(remain);
            setremainingPercentage(((remain / total) * 100));
            setcompletedPercentage(100 - ((remain / total) * 100));
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    useEffect(() => {
        GetStatusChart();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            GetStatusChart();
            GetEmployeeandStationdata();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const GetEmployeeandStationdata = async () => {
        try {
            const responseEmployee = await API.GetEmployeesChart();
            const responseStations = await API.GetStationsChart();
            setemployees(responseEmployee.data)
            setstations(responseStations.data)
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };


    useEffect(() => {
        const GetStatusChart = async () => {
            try {
                const responseEmployee = await API.GetEmployeesChart();
                const responseStations = await API.GetStationsChart();
                setemployees(responseEmployee.data)
                setstations(responseStations.data)
            } catch (error) {
                console.error("Error fetching warrant:", error);
            }
        };

        GetStatusChart();
    }, []);

    const checkready = async () => {
        try {
            const response = await API.informReady();
            setisready(response.data.readyset);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };


    useEffect(() => {
        checkready();
        const interval = setInterval(checkready, 3000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []); // Runs when id changes

    const [circleColor, setcircleColor] = useState("#e1e7e9");


    let firstHalfEmployees, secondHalfEmployees;
    if (employees.length >= 10) {
        firstHalfEmployees = employees.slice(0, Math.ceil(employees.length / 2));
        secondHalfEmployees = employees.slice(Math.ceil(employees.length / 2));
    } else {
        // Don't slice, keep all in first half, second half empty or null
        firstHalfEmployees = employees;
        secondHalfEmployees = [];
    }

    let firstHalfStations, secondHalfStations;
    if (stations.length >= 10) {
        firstHalfStations = stations.slice(0, Math.ceil(stations.length / 2));
        secondHalfStations = stations.slice(Math.ceil(stations.length / 2));
    } else {
        firstHalfStations = stations;
        secondHalfStations = [];
    }


    return (
        <div className="d-flex flex-column vh-100 p-0 m-0">
            <CarouselName />
            <div className="d-flex h-50 p-0 m-0">
                <div className="col-4 d-flex row align-items-center justify-content-center m-0 ">
                    <div className="h-100 d-flex row border p-0">
                        <div className="d-flex text-white fs-3 align-items-center justify-content-center h-15" style={{ backgroundColor: '#004081' }}>
                            Product Status
                        </div>
                        <div className="h-85 p-2 d-flex justify-content-center align-items-center">
                            <div className="d-flex flex-column p-3 rounded-3 shadow">
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`light bg-success ${isready === "Start" ? "active" : "faded"}`}></div>
                                    <span className="label">Start</span>
                                </div>
                                <div className="d-flex align-items-center mt-2 gap-3">
                                    <div className={`light bg-warning ${isready === "Ready" ? "active" : "faded"}`}></div>
                                    <span className="label">Ready</span>
                                </div>
                                <div className="d-flex align-items-center mt-2 gap-3">
                                    <div className={`light bg-danger ${isready === "Stop" ? "active" : "faded"}`}></div>
                                    <span className="label">Stop</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-4 d-flex row align-items-center justify-content-center m-0 ">
                    <div className="h-100 d-flex row  p-0 border">
                        <div className="d-flex text-white fs-3 align-items-center justify-content-center h-15" style={{ backgroundColor: '#004081' }}>
                            Targeted Seat Status
                        </div>
                        <div className="h-85">
                            <div className="h-40">
                                <div className="d-flex h-100 fs-1 align-items-center justify-content-center" style={{ flex: 1 }}>
                                    {totalOperations}
                                </div>
                            </div>
                            <div className="h-60 d-flex row align-items-center justify-content-center  p-0">
                                <div className="d-flex text-white fs-3 align-items-center justify-content-center h-30" style={{ backgroundColor: '#004081' }}>
                                    Completed SEAT Status
                                </div>
                                <div className="h-70">
                                    <div className="d-flex h-100 fs-1 align-items-center justify-content-center" style={{ flex: 1 }}>
                                        {totalOperations - remainingOperations}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <div className="col-4 d-flex row align-items-center justify-content-center m-0 ">
                    <div className="h-100 d-flex row border p-0 ">
                        <div className="d-flex text-white fs-3 align-items-center justify-content-center h-15" style={{ backgroundColor: '#004081' }}>
                            Status
                        </div>
                        <div className="p-2 overflow-hidden d-flex justify-content-center align-items-center pb-5" style={{ maxHeight: '100vh' }}>
                            <PieChart />
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex h-30">
                <div className="col-4 d-flex row align-items-center justify-content-center m-0 ">
                    <div className="p-0 m-0 h-50 border">
                        <div className="d-flex h-100 fs-2 align-items-center justify-content-center gap-5">
                            <div>
                                {OperationData[0]}
                            </div>
                            <div>
                                {OperationData[4]}
                            </div>
                        </div>
                    </div>
                    <div className="p-0 m-0 h-50 border">
                        <div className="d-flex h-100 fs-2 align-items-center justify-content-center " >
                            {OperationData[2]}
                        </div>
                    </div>

                </div>
                <div className="col-8 d-flex row align-items-center justify-content-center m-0 border ">
                    <StatusChart />
                </div>
            </div>
            <div className="d-flex h-20">
                {/* Number of Employees */}
                <div className="col-6 d-flex row align-items-center justify-content-center m-0 border">
                    <div
                        className="d-flex text-white fs-5 align-items-center justify-content-center h-20"
                        style={{ backgroundColor: "#004081" }}
                    >
                        Number of Employees
                    </div>
                    <div className="h-80 d-flex row align-items-center justify-content-center">
                        {/* First Row */}
                        <div className="p-1 d-flex justify-content-between">
                            {firstHalfEmployees.map((employee) => (
                                <div key={employee.employee_id}>
                                    <img
                                        src={employee.active ? greenman : grayman}
                                        alt={employee.active ? "greenman" : "grayman"}
                                        className="img-fluid px-1"
                                        style={{ height: "2.5rem" }}
                                    />
                                    <div>{employee.name}</div>
                                    <div>{employee.surname}</div>
                                </div>
                            ))}
                        </div>

                        {/* Second Row */}
                        <div className="p-1 d-flex justify-content-between">
                            {secondHalfEmployees.map((employee) => (
                                <div key={employee.employee_id}>
                                    <img
                                        src={employee.active ? greenman : grayman}
                                        alt={employee.active ? "greenman" : "grayman"}
                                        className="img-fluid px-1"
                                        style={{ height: "2.5rem" }}
                                    />
                                    <div>{employee.name}</div>
                                    <div>{employee.surname}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stations Status */}
                <div className="col-6 d-flex row align-items-center justify-content-center m-0 border">
                    <div
                        className="d-flex text-white fs-5 align-items-center justify-content-center h-20"
                        style={{ backgroundColor: "#004081" }}
                    >
                        Stations Status
                    </div>
                    <div className="h-80 d-flex row align-items-center justify-content-center">
                        {/* First Row */}
                        <div className="p-1 d-flex justify-content-between">
                            {firstHalfStations.map((station) => (
                                <div key={station.station_id}>
                                    <div
                                        className="text-center"
                                        style={{
                                            width: "2.5rem",
                                            height: "2.5rem",
                                            backgroundColor: station.active ? "#7ed957" : "#e1e7e9",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {station.station_id}
                                    </div>
                                    <div>{station.name}</div>
                                    <div>{station.surname}</div>
                                </div>
                            ))}
                        </div>

                        {/* Second Row */}
                        <div className="p-1 d-flex justify-content-between">
                            {secondHalfStations.map((station) => (
                                <div key={station.station_id}>
                                    <div
                                        className="text-center px-1"
                                        style={{
                                            width: "2.5rem",
                                            height: "2.5rem",
                                            backgroundColor: station.active ? "#7ed957" : "#e1e7e9",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {station.station_id}
                                    </div>
                                    <div>{station.name}</div>
                                    <div>{station.surname}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CarouselPage;
