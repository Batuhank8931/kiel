import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";

import StationName from "../components/StationName.jsx";
import DateAndTime from "../components/dateandtime.jsx";
import DonutChart from "../components/DonutChart.jsx";

import user_photo from "../assets/users/user.png";

import img1 from "../assets/stationpictures/1.png";
import img2 from "../assets/stationpictures/2.png";
import img3 from "../assets/stationpictures/3.png";
import img4 from "../assets/stationpictures/4.png";
import img5 from "../assets/stationpictures/5.png";
import img6 from "../assets/stationpictures/6.png";
import img7 from "../assets/stationpictures/7.png";
import img8 from "../assets/stationpictures/8.png";
import img9 from "../assets/stationpictures/9.png";
import img10 from "../assets/stationpictures/10.png";
import img11 from "../assets/stationpictures/11.png";
import img12 from "../assets/stationpictures/12.png";
import img13 from "../assets/stationpictures/13.png";
import img14 from "../assets/stationpictures/14.png";
import img15 from "../assets/stationpictures/15.png";
import img16 from "../assets/stationpictures/16.png";
import img17 from "../assets/stationpictures/17.png";
import img18 from "../assets/stationpictures/18.png";
import img19 from "../assets/stationpictures/19.png";
import img20 from "../assets/stationpictures/20.png";

const images = {
    "1": img1,
    "2": img2,
    "3": img3,
    "4": img4,
    "5": img5,
    "6": img6,
    "7": img7,
    "8": img8,
    "9": img9,
    "10": img10,
    "11": img11,
    "12": img12,
    "13": img13,
    "14": img14,
    "15": img15,
    "16": img16,
    "17": img17,
    "18": img18,
    "19": img19,
    "20": img20,
};

import API from "../utils/utilRequest";

const StationPage = () => {
    const { id } = useParams();
    const [OperationListEnglish, setOperationListEnglish] = useState([]);
    const [OperationListSpanish, setOperationListSpanish] = useState([]);
    const [OperationData, setOperationData] = useState([]);
    const [StepTimes, setStepTimes] = useState([]);
    const [CountTime, setCountTime] = useState("00:00:00");
    const [WaitState, setWaitState] = useState(true);
    const inputRef = useRef(null);
    const [scannedData, setScannedData] = useState("");
    const [seconds, setSeconds] = useState(0);
    const [isready, setisready] = useState("Stop");
    const [userbarcode, setUserbarcode] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [scanshow, setscanshow] = useState("SCAN");
    const [errorshow, setErrorShow] = useState("..");
    const [scanshowcolor, setscanshowcolor] = useState("white");
    const [errorshowcolor, setErrorshowcolor] = useState("white");
    const [freescan, setFreeScan] = useState(true)

    // Fallback in case id is not found
    const product_photo = images[id] || img1;


    const [breaktime, setBrakeTime] = useState(false);
    const [currentproduct, setCurrentProduct] = useState("");

    const handleFullscreen = () => {
        const elem = document.documentElement; // Fullscreen the entire page
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // Edge/IE11
            elem.msRequestFullscreen();
        }
    };

    let timer;

    const GetUsers = async () => {
        const body = { station: id };
        try {
            const response = await API.userInfo(body);
            setName(response.data.name);
            setSurname(response.data.surname);
        } catch (error) {
            //console.error("Error fetching warrant:", error);
        }
    };

    useEffect(() => {
        if (!WaitState) {
            timer = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [WaitState]); // Runs only when WaitState changes

    useEffect(() => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        setCountTime(
            `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
        );
    }, [seconds]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setErrorshowcolor("white");
            setErrorShow("..");
        }, 10000);

        return () => clearTimeout(timer); // Cleanup timeout on unmount or re-render
    }, [errorshow]);


    useEffect(() => {
        GetUsers();
    }, []);

    useEffect(() => {
        GetStatusChartAtStart();
    }, []);


    useEffect(() => {

        GetStatusChart();
        const interval = setInterval(GetStatusChart, 2000);

        if (isready) {
            setscanshow("SCAN");
            setErrorShow("..");
            setscanshowcolor("white");
            setErrorshowcolor("white");
            setCountTime("00:00:00");
            setWaitState(true);
            setSeconds(0);
            setSurname("");
        }

        return () => clearInterval(interval);
    }, [id, isready]);


    useEffect(() => {
        const fetchUserInfo = async () => {
            const body = { station: id };
            try {
                const response = await API.userInfo(body);
                setName(response.data.name);
                setSurname(response.data.surname);
            } catch (error) {
                //console.error("Error fetching user info:", error);
                setName("");
                setSurname("");
            }
        };

        // Initial call
        fetchUserInfo();
        checkready();

        // Repeated calls
        const interval = setInterval(() => {
            checkready();
            fetchUserInfo();
        }, 3000);

        return () => clearInterval(interval);
    }, [id]);




    useEffect(() => {
        // Focus on the hidden input when the component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }

    }, [isready, breaktime]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isready, breaktime]);


    useEffect(() => {
        // Focus on the hidden input when the component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }

        const GetStatusRrealChart = async () => {
            try {
                const response = await API.getRawdata(id);
                setOperationListEnglish(response.data[0]);
                setOperationListSpanish(response.data[1]);
                setOperationData(response.data[2]);

                const totalSeconds = response.data[3].reduce((sum, num) => sum + num, 0);

                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                setStepTimes(formattedTime)

            } catch (error) {
                console.error("Error fetching warrant:", error);
            }
        };

        GetStatusRrealChart();
    }, []);

    const checkready = async () => {
        try {
            const response = await API.informReady();
            setisready(response.data.readyset);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    const GetStatusChartAtStart = async () => {
        try {
            const response = await API.getRawdata(id);

            const newEnglish = response.data[0];
            const newSpanish = response.data[1];
            const newOperationData = response.data[2];
            const newStepTimes = response.data[3]?.reduce((sum, num) => sum + num, 0) || 0;
            const readData = response.data[4] || null;
            const breakData = response.data[5] || null;

            const history = readData ? `#${readData.product} ${readData.data}` : "";

            if (breakData && readData) {
                if ((breakData.time || 0) > (readData.time || 0)) {
                    setscanshowcolor("#ffa500");
                    if (breakData.data === "start") {
                        setCurrentProduct("break01Pro");
                        setBrakeTime(true);
                        setscanshow("Break Start");
                    } else {
                        setscanshow("Break End");
                    }
                } else {
                    if (readData.data === "start") {
                        console.log(readData.time);
                        const timeString = readData.time;
                        const [datePart, timePart] = timeString.split(' ');
                        const [day, month, year] = datePart.split('.');
                        const [hour, minute, second] = timePart.split(':');

                        const now = new Date();
                        const formattedTime = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

                        // Convert the formatted time string into a Date object
                        const readTimeformat = new Date(formattedTime);


                        const diffInSeconds = Math.floor((now - readTimeformat) / 1000);
                        setscanshow(history);
                        setscanshowcolor("#6ce5e8");
                        setWaitState(false);
                        setSeconds(diffInSeconds);
                        setCurrentProduct(readData.barcode);
                    } else if (readData.data === "end") {
                        setscanshow(history);
                        setscanshowcolor("#31356e");
                    }
                }
            } else if (breakData && !readData) {
                setscanshowcolor("#ffa500");
                if (breakData.data === "start") {
                    setCurrentProduct("break01Pro");
                    setBrakeTime(true);
                    setscanshow("Break Start");
                } else {
                    setscanshow("Break End");
                }
            } else if (readData && !breakData) {
                if (readData.data === "start") {
                    const timeString = readData.time;
                    const [datePart, timePart] = timeString.split(' ');
                    const [day, month, year] = datePart.split('.');
                    const [hour, minute, second] = timePart.split(':');
                    const now = new Date();
                    const formattedTime = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
                    const readTimeformat = new Date(formattedTime);

                    const diffInSeconds = Math.floor((now - readTimeformat) / 1000);
                    setscanshow(history);
                    setscanshowcolor("#6ce5e8");
                    setWaitState(false);
                    setSeconds(diffInSeconds);
                    setCurrentProduct(readData.barcode);
                } else if (readData.data === "end") {
                    setscanshow(history);
                    setscanshowcolor("#31356e");
                }
            } else if (!readData && !breakData) {
                setscanshow("");
                setscanshowcolor("white");
                setWaitState(true);
                setSeconds(0);
                setCurrentProduct("");
                setBrakeTime(false);
            }

            // Check if data has changed before updating state
            setOperationListEnglish(prev => JSON.stringify(prev) !== JSON.stringify(newEnglish) ? newEnglish : prev);
            setOperationListSpanish(prev => JSON.stringify(prev) !== JSON.stringify(newSpanish) ? newSpanish : prev);
            setOperationData(prev => JSON.stringify(prev) !== JSON.stringify(newOperationData) ? newOperationData : prev);

            const hours = Math.floor(newStepTimes / 3600);
            const minutes = Math.floor((newStepTimes % 3600) / 60);
            const seconds = newStepTimes % 60;

            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            setStepTimes(prev => prev !== formattedTime ? formattedTime : prev);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };


    const GetStatusChart = async () => {
        try {
            const response = await API.getRawdata(id);

            const newEnglish = response.data[0];
            const newSpanish = response.data[1];
            const newOperationData = response.data[2];
            const newStepTimes = response.data[3].reduce((sum, num) => sum + num, 0);

            // Check if data has changed before updating state
            setOperationListEnglish(prev => JSON.stringify(prev) !== JSON.stringify(newEnglish) ? newEnglish : prev);
            setOperationListSpanish(prev => JSON.stringify(prev) !== JSON.stringify(newSpanish) ? newSpanish : prev);
            setOperationData(prev => JSON.stringify(prev) !== JSON.stringify(newOperationData) ? newOperationData : prev);

            const hours = Math.floor(newStepTimes / 3600);
            const minutes = Math.floor((newStepTimes % 3600) / 60);
            const seconds = newStepTimes % 60;

            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            setStepTimes(prev => prev !== formattedTime ? formattedTime : prev);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    const PostUser = async (barcode, id) => {
        try {
            const response = await API.SetUsertoStation({
                barcode: barcode,
                station: id
            });

            // Check if the response was successful
            if (response.status === 404) {
                setUserbarcode("NONE REGISTERED USER");
            }
        } catch (error) {
            console.error("Error updating ready status:", error);

            // Check if error response contains a message (backend might send error message)
            if (error.response && error.response.data && error.response.data.message) {
                setUserbarcode("⚠️NONE REGISTERED USER⚠️");
            } else {
                alert(error.message); // Default alert for unknown errors
            }
        }
    };

    const PostStart = async (data, time, number, id) => {

        try {
            const response = await API.GetReadData({
                data: data,
                time: time,
                product: number,
                station: id,
                barcode: scannedData
            });
            if (number !== "BREAK") {
                if (response.data.message == "Data successfully inserted") {
                    setWaitState((prev) => !prev);
                    if (data === "start") {
                        setCurrentProduct(scannedData);
                        setscanshow("#" + number + " start");
                        setscanshowcolor("#6ce5e8");
                    } else if (data === "end") {
                        setSeconds(0);
                        setCountTime("00:00:00");
                        setscanshow("#" + number + " end");
                        setscanshowcolor("#31356e");
                    }

                } else if (response.data.message == "Data already exists, no changes made") {
                    setErrorShow("#" + number + " exists");
                    setErrorshowcolor("#ff3131");
                }
                setFreeScan(true);

            } else if (number === "BREAK") {
                if (response.data.message == "Data successfully inserted") {

                    setscanshowcolor("#ffa500");
                    if (data === "start") {
                        setscanshow("Break Start");
                        setBrakeTime((prev) => !prev);
                        setCurrentProduct("break01Pro");
                    } else if (data === "end") {
                        setscanshow("Break end");
                        setBrakeTime((prev) => !prev);
                        setCurrentProduct("");
                    }
                }
                setFreeScan(true);

            }

        } catch (error) {
            console.error("Error updating ready status:", error);
        }
    };


    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (scannedData.startsWith("UN") && isready === "Ready") {
                setscanshow(scannedData);
                PostUser(scannedData, id);
                setUserbarcode(scannedData);
                GetUsers();
                setCurrentProduct("");
            }
            else if (scannedData.startsWith("product") && isready === "Start" && currentproduct !== "break01Pro" && freescan === true) {

                const currentTime = new Date().toLocaleString();
                const match = scannedData.match(/product(\d+)no/);

                let numberBetween = null;
                if (match) {
                    numberBetween = match[1];
                }


                if (numberBetween && WaitState === true) {
                    setFreeScan(false);
                    PostStart("start", currentTime, numberBetween, id);
                } else if (numberBetween && WaitState === false && currentproduct === scannedData && CountTime >= "00:00:05") {
                    setFreeScan(false);
                    PostStart("end", currentTime, numberBetween, id);
                } else if (numberBetween && WaitState === true || currentproduct !== scannedData || CountTime < "00:00:05") {
                    setErrorShow("No Valid");
                    setErrorshowcolor("#ff3131");
                }

            } else if (scannedData.startsWith("break01Pro") && isready === "Start" && currentproduct !== "break01Pro" && freescan === true && breaktime === false && CountTime === "00:00:00" && WaitState === true) {

                const currentTime = new Date().toLocaleString();
                PostStart("start", currentTime, "BREAK", id);


            } else if (scannedData.startsWith("break01Pro") && isready === "Start" && currentproduct === "break01Pro" && freescan === true && breaktime === true && WaitState === true) {

                const currentTime = new Date().toLocaleString();
                PostStart("end", currentTime, "BREAK", id);

            } else if (scannedData.startsWith("break01Pro") && currentproduct !== "break01Pro" && freescan === true && breaktime === false) {
                setErrorShow("No Break");
                setErrorshowcolor("#ff3131");
            } else if (scannedData == 9789758607884) {
                //} else if (scannedData == "resetpage01"){
                window.location.reload();
            } else if (scannedData == 9789758607754) {
                //} else if (scannedData == "fullpage01"){
                handleFullscreen();
            }

            setScannedData("");
        }
    };


    useEffect(() => {
        if (isready === "Ready") {
            inputRef.current?.focus();
            setUserbarcode("");
        }
    }, [isready, breaktime]);


    return (
        <div className="d-flex flex-column vh-100">

            <Modal
                show={
                    isready === "Ready" ||
                    isready === "Stop" ||
                    (isready === "Start" && name === "" && surname == "") ||
                    breaktime === true
                }
                backdrop="static" centered size={isready === "Ready" ? "lg" : "lg"}>
                <Modal.Body className="text-center p-5 position-relative">
                    {isready === "Ready" ? (
                        <>
                            <input
                                ref={inputRef}
                                type="text"
                                value={scannedData}
                                onChange={(e) => setScannedData(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ position: "absolute", opacity: 0, pointerEvents: "none", zIndex: 9999 }}
                            />
                            <h1 className="fw-bold">SCAN THE USER QR</h1>
                            <h1 className="fw-bold">USER: {userbarcode}</h1>
                        </>
                    ) : isready === "Stop" ? (
                        <>
                            <h1 style={{ fontSize: '5rem' }}>⚠️</h1>
                            <h1 className="fw-bold text-danger display-1">NO PRODUCTION</h1>
                        </>
                    ) : (isready === "Start" && name === "" && surname == "") ? (
                        <>
                            <input
                                ref={inputRef}
                                type="text"
                                value={scannedData}
                                onChange={(e) => setScannedData(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ position: "absolute", opacity: 0, pointerEvents: "none", zIndex: 9999 }}
                            />
                            <h1 className="fw-bold">NO USER</h1>
                        </>
                    ) : breaktime === true ? (
                        <>
                            <input
                                ref={inputRef}
                                type="text"
                                value={scannedData}
                                onChange={(e) => setScannedData(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ position: "absolute", opacity: 0, pointerEvents: "none", zIndex: 9999 }}
                            />
                            <h1 className="fw-bold">SCAN THE BREAK QR</h1>
                        </>
                    ) :

                        null}
                </Modal.Body>
            </Modal>



            {/* Hidden Input Field */}
            <input
                ref={inputRef}
                type="text"
                value={scannedData}
                onChange={(e) => setScannedData(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
            />

            <StationName id={id} />
            <div className="d-flex flex-grow-1">
                <div className="col-3 d-flex row align-items-center justify-content-center m-0">
                    <div className="h-50 d-flex row align-items-center justify-content-center border p-0">
                        <div className="h-20 d-flex align-items-center justify-content-around border">
                            <div
                                className="d-flex fs-5 align-items-center justify-content-center text-white p-2 px-4"
                                style={{
                                    backgroundColor: scanshowcolor,
                                    borderRadius: "10px",
                                }}
                            >
                                {scanshow}
                            </div>
                            <div
                                className="d-flex fs-5 align-items-center justify-content-center text-white p-2 px-4"
                                style={{
                                    backgroundColor: errorshowcolor,
                                    borderRadius: "10px",
                                }}
                            >
                                {errorshow}
                            </div>


                        </div>
                        <div className="h-20 d-flex align-items-center justify-content-center border">
                            <div className="d-flex fs-3 align-items-center justify-content-center" style={{ flex: 1 }}>
                                SEAT CODE: {OperationData[2]}
                            </div>
                        </div>
                        <div className="h-60 d-flex align-items-center justify-content-center border">
                            <img src={product_photo} alt="product_photo" className="img-fluid" style={{ height: '10rem' }} />
                            <div>ID: {id}</div>
                        </div>
                    </div>
                    <div className="h-50 d-flex align-items-center justify-content-center border">
                        <div className="p-2 overflow-hidden d-flex justify-content-center align-items-center pb-3" style={{ maxHeight: '40vh' }}>
                            <DonutChart />
                        </div>
                    </div>
                </div>
                <div className="col-6 d-flex row align-items-center justify-content-center m-0">
                    <div className="h-30 d-flex align-items-center justify-content-center border">
                        <div className="d-flex h-100 fs-3 align-items-center justify-content-around" style={{ flex: 1 }}>
                            <div className="h-100 w-50 d-flex row align-items-center justify-content-center border">
                                <div className="d-flex align-items-center justify-content-center py-2">Target Time</div>
                                <div className="h-full d-flex align-items-center justify-content-center fs-1">{StepTimes}</div>
                            </div>
                            <div className="h-100 w-50 d-flex row align-items-center justify-content-center border">
                                <div className="d-flex align-items-center justify-content-center py-2">Current Time</div>
                                <div className="h-full d-flex align-items-center justify-content-center fs-1">
                                    {CountTime}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-70 d-flex align-items-center justify-content-center border p-0">
                        <div className="h-100 w-100 d-flex row align-items-center justify-content-center border p-0">
                            <div className="d-flex text-white fs-6 align-items-center justify-content-center h-10" style={{ backgroundColor: '#004081' }}>
                                Operation List
                            </div>
                            <div className="h-85 p-2 d-flex column align-items-center justify-content-evenly">
                                <div>
                                    <div className="d-flex column align-items-center justify-content-center"> English </div>
                                    <ul className="custom-bullets list-unstyled">
                                        {OperationListEnglish.map((operation, index) => (
                                            <li className="m-1" key={index}>{operation}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <div className="d-flex column align-items-center justify-content-center"> Spanish </div>
                                    <ul className="custom-bullets list-unstyled">
                                        {OperationListSpanish.map((operation, index) => (
                                            <li className="m-1" key={index}>{operation}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3 d-flex row align-items-center justify-content-center m-0">
                    <div className="h-15 d-flex align-items-center justify-content-center border fs-2">{OperationData[0]}</div>
                    <div className="h-15 d-flex align-items-center justify-content-center border fs-2">{OperationData[1]}</div>
                    <div className="h-40 d-flex align-items-center justify-content-center border">
                        <img src={user_photo} alt="user_photo" className="img-fluid" style={{ height: '12rem' }} />
                    </div>
                    <div className="h-15 d-flex align-items-center justify-content-center border fs-2">{name} {surname}</div>
                    <div className="h-15 d-flex align-items-center justify-content-center border"><DateAndTime /></div>
                </div>
            </div>
        </div>
    );
};

export default StationPage;
