import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import API from "../utils/utilRequest";
import StationName from "../components/StationName.jsx";
import DateAndTime from "../components/dateandtime.jsx";
import DonutChart from "../components/DonutChart.jsx";
import StationMedia from '../components/StationMedia';


function parseCustomDate(str) {
    const [datePart, timePart] = str.split(' ');
    const [day, month, year] = datePart.split('.');
    const [hour, minute, second] = timePart.split(':');
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
}

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
    const [numbershow, setNumbershow] = useState("#");
    const [scanshow, setscanshow] = useState("...");
    const [errorshow, setErrorShow] = useState("..");
    const [scanshowcolor, setscanshowcolor] = useState("white");
    const [errorshowcolor, setErrorshowcolor] = useState("white");
    const [timerColor, setTimerColor] = useState("white");
    const [freescan, setFreeScan] = useState(true);
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

    function getFormattedDate() {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = now.getFullYear();

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }

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
        if (!WaitState && !breaktime) {
            timer = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else if (WaitState) {
            clearInterval(timer);
        } else if (!WaitState && breaktime) {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [WaitState, breaktime]); // Runs only when WaitState changes

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
            setscanshowcolor("white");
            setscanshow("")
        }, 5000);

        return () => clearTimeout(timer); // Cleanup timeout on unmount or re-render
    }, [scanshow]);


    useEffect(() => {
        GetUsers();
    }, []);

    useEffect(() => {
        GetStatusChartAtStart();
    }, []);


    useEffect(() => {

        GetStatusChart();
        const interval = setInterval(GetStatusChart, 2000);

        if (isready && isready !== "Start") {
            setscanshow("SCAN");
            setscanshowcolor("white");
            setErrorshowcolor("white");
            setTimerColor("white")
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
            console.log(response.data);
            const newEnglish = response.data[0];
            const newSpanish = response.data[1];
            const newOperationData = response.data[2];
            const newStepTimes = response.data[3]?.reduce((sum, num) => sum + num, 0) || 0;
            const readData = response.data[4] || null;
            const breakData = response.data[5] || null;
            const difference = breakData ? breakData.difference || 0 : 0;


            const history = readData ? `${readData.data}` : "";
            const Numberhistory = readData ? `#${readData.product}` : "";

            if (breakData && readData) {

                if ((breakData.time || 0) > (readData.time || 0)) {

                    if (breakData.data === "start" && readData.data === "start") {
                        setTimerColor("#00FF00");
                        setCurrentProduct(breakData.breakproduct);
                        setBrakeTime(true);
                        setscanshow("Break Start");
                        setNumbershow(Numberhistory);
                        const breakDate = parseCustomDate(breakData.time);
                        const readDate = parseCustomDate(readData.time);
                        const diffInSeconds = Math.floor((breakDate - readDate) / 1000);
                        setSeconds(diffInSeconds);

                    } else if (breakData.data === "start" && readData.data === "end") {
                        setTimerColor("#FFA500");
                        setCurrentProduct(breakData.breakproduct);
                        setBrakeTime(true);
                        setscanshow("Break Start");
                        setNumbershow(Numberhistory);
                    } else if (breakData.data === "end" && readData.data === "start") {
                        setNumbershow(Numberhistory);
                        setscanshow(history);
                        setscanshowcolor("#00FF00");
                        setTimerColor("#00FF00");
                        setWaitState(false);
                        setCurrentProduct(readData.barcode);
                        const breakDate = parseCustomDate(breakData.time);
                        const readDate = parseCustomDate(readData.time);
                        const now = new Date();
                        const diffInSeconds = Math.floor(((now - readDate) / 1000) - difference);

                        setSeconds(diffInSeconds);
                    } else if (breakData.data === "end" && readData.data === "end") {
                        setTimerColor("#FFA500");
                        setscanshow("Break End");
                        setNumbershow(Numberhistory);
                        setBrakeTime(false);
                        setscanshow(history);
                        setWaitState(true);
                    }
                } else {
                    if (readData.data === "start") {
                        const timeString = readData.time;
                        const [datePart, timePart] = timeString.split(' ');
                        const [day, month, year] = datePart.split('.');
                        const [hour, minute, second] = timePart.split(':');

                        const now = new Date();
                        const formattedTime = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

                        // Convert the formatted time string into a Date object
                        const readTimeformat = new Date(formattedTime);


                        const diffInSeconds = Math.floor((now - readTimeformat) / 1000);
                        setNumbershow(Numberhistory);
                        setscanshow(history);
                        setscanshowcolor("#00FF00");
                        setTimerColor("#00FF00");
                        setWaitState(false);
                        setSeconds(diffInSeconds);
                        setCurrentProduct(readData.barcode);
                    } else if (readData.data === "end") {
                        setNumbershow(Numberhistory);
                        setscanshow(history);
                        setTimerColor("#FFA500");
                        setscanshowcolor("#FFA500");
                    }
                }
            } else if (breakData && !readData) {
                setscanshowcolor("#00FF00");
                setTimerColor("#00FF00");
                if (breakData.data === "start") {
                    setCurrentProduct(readData.barcode);
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
                    setNumbershow(Numberhistory);
                    setscanshow(history);
                    setscanshowcolor("#00FF00");
                    setTimerColor("#00FF00");
                    setWaitState(false);
                    setSeconds(diffInSeconds);
                    setCurrentProduct(readData.barcode);
                } else if (readData.data === "end") {

                    setNumbershow(Numberhistory);
                    setscanshow(history);
                    setscanshowcolor("#FFA500");
                    setTimerColor("#FFA500");
                }
            } else if (!readData && !breakData) {
                setNumbershow("#");
                setscanshow("..");
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

    const PostStart = async (data, time, number, id, breakproduct) => {
        try {
            const response = await API.GetReadData({
                data: data,
                time: time,
                product: number,
                station: id,
                barcode: scannedData,
                breakproduct: breakproduct
            });
            if (number !== "BREAK") {
                if (response.data.message == "Data successfully inserted") {
                    setWaitState((prev) => !prev);
                    if (data === "start") {
                        setCurrentProduct(scannedData);
                        setNumbershow("#" + number);
                        setscanshow("Start");
                        setscanshowcolor("#00FF00");
                        setTimerColor("#00FF00");
                    } else if (data === "end") {
                        setSeconds(0);
                        setCountTime("00:00:00");
                        setNumbershow("#" + number);
                        setscanshow("End");
                        setscanshowcolor("#FFA500");
                        setTimerColor("#FFA500");
                    }

                } else if (response.data.message == "Data already exists, no changes made") {
                    setscanshow("Exists");
                    setscanshowcolor("#ff3131");
                }
                setFreeScan(true);

            } else if (number === "BREAK") {
                if (response.data.message == "Data successfully inserted") {
                    if (data === "start") {
                        setscanshow("Break Start");
                        setBrakeTime((prev) => !prev);
                        //setCurrentProduct("break01Pro");
                    } else if (data === "end") {
                        setscanshow("Break end");
                        setBrakeTime((prev) => !prev);
                        //setCurrentProduct("");
                        //setTimerColor("#FFA500");
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
                //setscanshow(scannedData);
                PostUser(scannedData, id);
                setUserbarcode(scannedData);
                GetUsers();
                setCurrentProduct("");
            }
            else if (scannedData.startsWith("product") && isready === "Start" && currentproduct !== "break01Pro" && freescan === true) {

                //const currentTime = new Date().toLocaleString();
                const currentTime = getFormattedDate();
                const match = scannedData.match(/product(\d+)no/);

                let numberBetween = null;
                if (match) {
                    numberBetween = match[1];
                }


                if (numberBetween && WaitState === true) {
                    setFreeScan(false);
                    PostStart("start", currentTime, numberBetween, id, "");
                } else if (numberBetween && WaitState === false && currentproduct === scannedData && CountTime >= "00:00:30") {
                    setFreeScan(false);
                    PostStart("end", currentTime, numberBetween, id, "");
                } else if (numberBetween && WaitState === true || currentproduct !== scannedData || CountTime < "00:00:30") {
                    setscanshow("No Valid");
                    setscanshowcolor("#ff3131");
                }

            } else if (scannedData.startsWith("break01Pro") && isready === "Start" && freescan === true && breaktime === false) {
                //const currentTime = new Date().toLocaleString();
                const currentTime = getFormattedDate();
                if (WaitState) {
                    PostStart("start", currentTime, "BREAK", id, "");
                } else {
                    PostStart("start", currentTime, "BREAK", id, currentproduct);
                }

            } else if (scannedData.startsWith("break01Pro") && isready === "Start" && freescan === true && breaktime === true) {

                //const currentTime = new Date().toLocaleString();
                const currentTime = getFormattedDate();
                if (WaitState) {

                    PostStart("end", currentTime, "BREAK", id, "");
                } else {
                    PostStart("end", currentTime, "BREAK", id, currentproduct);
                }

            } else if (scannedData == "resetpage01") {
                //} else if (scannedData == "resetpage01"){
                window.location.reload();
            } else if (scannedData == "fullpage01") {
                //} else if (scannedData == "fullpage01"){
                handleFullscreen();
            } else {
                setscanshow("N/A");
                setscanshowcolor("#ff3131");
            }


            setScannedData("");
        }
    };


    useEffect(() => {
        console.log("ananananananaanananana")
        if (isready === "Ready" || isready === "Start") {
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
                backdrop="static" centered size={isready === "Ready" ? "lg" : "lg"}
                enforceFocus={false}>
                <Modal.Body className="text-center p-5 position-relative">
                    {isready === "Ready" ? (
                        <>
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
                            <h1 className="fw-bold">NO USER</h1>
                        </>
                    ) : breaktime === true ? (
                        <>
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
                style={{
                    position: "absolute",
                    left: "200px", // Add this line to move right
                    opacity: 0.5,
                    pointerEvents: "none"
                }}
            />

            <StationName id={id} />
            <div className="d-flex flex-grow-1">
                <div className="col-3 d-flex row align-items-center justify-content-center m-0">
                    <div className="h-50 d-flex row align-items-center justify-content-center border p-0">
                        <div className="d-flex text-white fs-6 align-items-center justify-content-center h-10" style={{ backgroundColor: '#004081' }}>
                            Operation List
                        </div>
                        <div className="h-85 d-flex column align-items-start justify-content-start">
                            <ul className="custom-bullets list-unstyled">
                                {OperationListEnglish.map((operation, index) => (
                                    <li className="m-1" key={index}>{operation}</li>
                                ))}
                            </ul>
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
                            <div className="h-100 w-50 d-flex row align-items-center justify-content-center border p-1">
                                <div className="d-flex align-items-center justify-content-center py-2">Current Time</div>
                                <div className="h-full d-flex align-items-center justify-content-center fs-1">
                                    {CountTime}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-70 d-flex align-items-center justify-content-center border p-0">
                        <StationMedia id={id} />
                    </div>

                </div>
                <div className="col-3 d-flex row align-items-center justify-content-center m-0">
                    <div className="h-15 d-flex align-items-center justify-content-center border fs-3">{name} {surname}</div>
                    <div className="h-15 d-flex align-items-center justify-content-center border fs-3">{OperationData[4]}</div>
                    <div className="h-70 d-flex align-items-center justify-content-center border row">
                        <div
                            className="d-flex align-items-center justify-content-center text-black text-center font-bold h-50 w-100 p-0 m-0"
                            style={{
                                backgroundColor: timerColor,
                                borderRadius: "10px",
                                fontSize: "8rem", // You can increase this even more if needed
                                fontWeight: "bold", // Optional: makes it more visible
                            }}
                        >
                            {numbershow}
                        </div>
                        <div
                            className="d-flex align-items-center justify-content-center text-black text-center font-bold h-50 w-100 p-0 m-0"
                            style={{
                                backgroundColor: scanshowcolor,
                                borderRadius: "10px",
                                fontSize: "8rem", // You can increase this even more if needed
                                fontWeight: "bold", // Optional: makes it more visible
                            }}
                        >
                            {scanshow}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StationPage;
