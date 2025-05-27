import React, { useState, useEffect } from 'react';
import rapor from "../assets/rapor.png";
import print from "../assets/print.png"
import save from "../assets/save.png"
import API from "../utils/utilRequest";

const GenerateReport = () => {

    const sendoutput = async () => {
        try {
            const response = await API.InsertOutputTable();
            alert(response.data.message);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    return (
        <div className=''>
            <div className="d-flex text-white fs-3 align-items-center justify-content-center" style={{ backgroundColor: '#004081' }}>
                GENERATE REPORT
            </div>
            <div className="d-flex flex-grow-1">
                <div className="col-12 border">
                    <div className="d-flex justify-content-between p-1">
                        <div className='px-4 d-flex justify-content-center align-items-center'>
                            <img src={rapor} alt="rapor" className="img-fluid" style={{ height: '3rem' }} />
                        </div>

                        <div className='fs-4 d-flex justify-content-center align-items-center'> Daily Report </div>
                        <div className="d-flex columns">


                            <button className="btn hover-effect" onClick={sendoutput}>
                                <div>Save as Excell</div>
                                <img src={save} alt="save" className="img-fluid" style={{ height: '2rem' }} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GenerateReport;
