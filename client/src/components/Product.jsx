import React, { useState, useEffect } from "react";
import print from "../assets/print.png";
import API from "../utils/utilRequest";

const Product = () => {
    const [status, setStatus] = useState("PRODUCTION STATUS");
    const [statusColor, setStatusColor] = useState("#ccc");
    const [isReadySet, setIsReadySet] = useState("Stop"); // Renamed for clarity


    const checkready = async () => {
        try {
            const response = await API.informReady();
            setIsReadySet(response.data.readyset);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    useEffect(() => {
        checkready();
        const interval = setInterval(checkready, 3000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []); // Runs when id changes

    useEffect(() => {

        if (isReadySet == "Stop") {
            setStatus("PRODUCTION STOP");
            setStatusColor("#ff3131"); // Orange color
        }

    }, [isReadySet]);

    const handleStart = async () => {
        await changeReadySet("Start"); // Ensure the toggle happens after API call
        setStatus("PRODUCTION START");
        setStatusColor("#7ed957");
    };

    const handleStop = async () => {
        await changeReadySet("Stop"); // Ensure the toggle happens after API call
        setStatus("PRODUCTION STOP");
        setStatusColor("#ff3131");
    };

    const handleReady = async () => {
        await changeReadySet("Ready"); // Ensure the toggle happens after API call
        setStatus("PRODUCTION READY");
        setStatusColor("#ffa500"); // Orange color
    };

    const changeReadySet = async (button) => {
        try {
            const response = await API.PostReady({ readyset: button });
            setIsReadySet(button);
        } catch (error) {
            console.error("Error updating ready status:", error);
        }
    };

    return (
        <div className="d-flex align-items-center p-2">
            <button
                className="col-2 fs-4 btn border hover-effect"
                style={{ backgroundColor: "#7ed957", borderRadius: "0" }}
                onClick={handleStart}
            >
                START
            </button>
            <button
                className="col-2 fs-4 btn border hover-effect"
                style={{ backgroundColor: "#ffa500", borderRadius: "0" }}
                onClick={handleReady}
            >
                READY
            </button>
            <button
                className="col-2 fs-4 btn border hover-effect"
                style={{ backgroundColor: "#ff3131", borderRadius: "0" }}
                onClick={handleStop}
            >
                STOP
            </button>
            <button
                className="col-6 fs-4 btn border hover-effect"
                style={{ backgroundColor: statusColor, borderRadius: "0", color: "#fff" }}
            >
                {status}
            </button>
        </div>
    );
};

export default Product;
