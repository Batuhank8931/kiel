import React, { useState } from 'react';
import rapor from "../assets/rapor.png";
import addimagepng from "../assets/addimage.png";
import save from "../assets/save.png";
import API from "../utils/utilRequest";
import AddImageModal from "./AddImageModal"; 

const GenerateReport = () => {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmSend, setShowConfirmSend] = useState(false);
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const sendoutput = async () => {
        try {
            const response = await API.ResetInputTable();
            alert(response.data.message);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    const resetinput = async () => {
        try {
            const response = await API.InsertOutputTable();
            alert(response.data.message);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    const handleConfirmSendOutput = () => {
        setShowConfirmSend(false);
        sendoutput();
    };

    const handleConfirmResetInput = () => {
        setShowConfirmReset(false);
        resetinput();
    };

    return (
        <div>
            <div className="d-flex text-white fs-3 align-items-center justify-content-center" style={{ backgroundColor: '#004081' }}>
                GENERATE REPORT
            </div>
            <div className="d-flex flex-grow-1">
                <div className="col-12 border">
                    <div className="d-flex justify-content-between p-1">
                        <div className='px-4 d-flex justify-content-center align-items-center'>
                            <button 
                                className="btn hover-effect ms-4" 
                                onClick={() => setShowConfirmSend(true)}
                            >
                                <img src={rapor} alt="rapor" className="img-fluid" style={{ height: '4rem' }} />
                            </button>
                        </div>
                        <div className='px-4 d-flex justify-content-center align-items-center'>
                            <button className="btn hover-effect ms-4" onClick={() => setShowModal(true)}>
                                <img src={addimagepng} alt="add" className="img-fluid" style={{ height: '4rem' }} />
                            </button>
                        </div>
                        <div className="d-flex columns">
                            <button 
                                className="btn hover-effect me-4" 
                                onClick={() => setShowConfirmReset(true)} 
                            >
                                <img src={save} alt="save" className="img-fluid" style={{ height: '4rem' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AddImageModal */}
            <AddImageModal
                show={showModal}
                handleClose={() => setShowModal(false)}
            />

            {/* Confirmation modal for sendoutput */}
            {showConfirmSend && (
                <div 
                  className="confirmation-modal-backdrop" 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                  }} 
                >ssdsdsds
                    <div style={{backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '320px', textAlign: 'center'}}>
                        <p>All data will upload to excel and memory will erase.</p>
                        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '20px'}}>
                            <button onClick={handleConfirmSendOutput} className="btn btn-primary">Confirm</button>
                            <button onClick={() => setShowConfirmSend(false)} className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation modal for resetinput */}
            {showConfirmReset && (
                <div 
                  className="confirmation-modal-backdrop" 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                  }}
                >
                    <div style={{backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '320px', textAlign: 'center'}}>
                        <p>All data will upload from excel and memory will erase.</p>
                        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '20px'}}>
                            <button onClick={handleConfirmResetInput} className="btn btn-primary">Confirm</button>
                            <button onClick={() => setShowConfirmReset(false)} className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GenerateReport;
