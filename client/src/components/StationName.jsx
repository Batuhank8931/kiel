import React from "react";
import kiellogo from "../assets/kiel.png";
import DateAndTime from "./dateandtime.jsx";

const StationName = ({ id }) => {
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

    return (
        <div className="d-flex justify-content-between" style={{ height: "4rem" }}>
            <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center justify-content-start" style={{ flex: 1 }}>
                    <img src={kiellogo} alt="Kiel Logo" className="img-fluid" style={{ height: "4rem" }} />
                </div>
                <div className="d-flex fs-1 align-items-center justify-content-center" style={{ flex: 1 }}>
                    STATION {id}
                </div>

                <div className="d-flex flex-row align-items-center justify-content-end" style={{ flex: 1 }}>
                    <div className="d-flex align-items-center justify-content-center">
                        <button
                            onClick={handleFullscreen}
                            className="btn hover-effect"
                            style={{
                                backgroundColor: 'rgba(0, 64, 129, 0.5)',
                                fontSize: "1rem"
                            }}
                        >
                            Fullscreen
                        </button>
                    </div>
                    <div className="p-2">
                        <DateAndTime />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StationName;
