import React, { useState } from 'react';
// Change the import to this line
import QRCode from 'react-qr-code';  // Updated import



import print from "../assets/print.png";

const CreateSeatQr = () => {

    const [loginQrContent, setLoginQrContent] = useState("login");
    const [exitQrContent, setExitQrContent] = useState("exit");



    return (
        <div className="d-flex align-items-center p-2 flex-grow-1">
            <div className="col-6 d-flex column px-3">
                <div className="col-3 d-flex align-items-center">Project Code:</div>
                <div className="col-6 align-items-center">
                    <div
                        contentEditable="true"
                        style={{
                            backgroundColor: 'rgba(0, 64, 129, 0.5)',
                            width: '100%',
                            padding: '3px',
                            border: '1px solid #ccc',
                            borderRadius: '2px',
                            outline: 'none',
                        }}
                        onInput={(e) => handleInputChange("name", e.target.innerText)}
                    ></div>
                </div>
                <div className='d-flex col-3 align-items-center px-2'>Create QR</div>
            </div>
            <div className="col-4 d-flex column">

                <div className="d-flex row justify-content-center align-items-center p-0 pb-2 text-center">
                    <div>Login QR</div>
                    {loginQrContent && <QRCode value={loginQrContent} size={70} />}
                </div>
                <div className="d-flex row justify-content-center align-items-center p-0 pb-2 text-center">
                    <div>Exit QR</div>
                    {exitQrContent && <QRCode value={exitQrContent} size={70} />}
                </div>
            </div>
            <div className="col-2">
                <button className="btn hover-effect d-flex row justify-content-center align-items-center p-0 pb-2 text-center">
                    <div>Print QR Writer</div>
                    <div>
                        <img src={print} alt="print" className="img-fluid" style={{ height: '2rem' }} />
                    </div>
                </button>
            </div>
        </div>


    );
};

export default CreateSeatQr;
