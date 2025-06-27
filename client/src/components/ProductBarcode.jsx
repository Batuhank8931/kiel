
import React, { useEffect, useRef, useState } from 'react';
// Change the import to this line
import API from "../utils/utilRequest";
import print from "../assets/print.png";
import buyutec from "../assets/search.png";
import ProductModal from "./ProductModal"; // Import the modal component

const ProductBarcode = () => {
    const [allbarcodes, setAllBarcodes] = useState([]);
    const [barcodeNumber, setBarcodeNumber] = useState(1);
    const [showModal, setShowModal] = useState(false); // State to control modal

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const buttonStyle = { width: "50px", height: "50px" };
    const iconStyle = { height: "1.5rem" };

    const printBarcodeRequest = async (barcodearray) => {

        try {
            const response = await API.printBarcode({
                "barcodes": barcodearray
            }
            );

        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    const handlePrint = () => {
        if (barcodeNumber + 1 > allbarcodes.length) {
            // If going beyond array bounds, just exit
            return;
        }

        const start = barcodeNumber - 1;

        if (allbarcodes[start] === undefined) {
            alert("No more product to print.");
            return;
        }

        const barcodearray = [allbarcodes[start]];
        printBarcodeRequest(barcodearray);

        setBarcodeNumber(barcodeNumber + 1);
    };



    const handlePrintBreak = () => {

        printBarcodeRequest(["break01Pro"])

    };

    const handlePrintReset = () => {

        printBarcodeRequest(["resetpage01"])

    };

    const handlePrintFullscreen = () => {

        printBarcodeRequest(["fullpage01"])

    };

    const GetBarcodes = async () => {
        try {
            const response = await API.GetProductBarcodes();
            setAllBarcodes(response.data);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    useEffect(() => {
        GetBarcodes();
        const interval = setInterval(GetBarcodes, 3000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []); // Runs when id changes



    return (
        <div className="col-6 border d-flex row m-0">
            <div className="d-flex text-white fs-5 align-items-center justify-content-center h-20" style={{ backgroundColor: '#004081' }}>
                PRODUCT BARCODE GENERATOR
            </div>
            <div className="d-flex justify-content-between p-3 pb-0">
                <div className="w-100 p-2">
                    <div className="d-flex column py-2 align-items-center">
                        <div className="col-3 d-flex align-items-center flex-column">
                            <div className="d-flex text-start">
                                Product Number:
                            </div>
                        </div>
                        <div className="col-3 d-flex justify-content-center align-itmes-center">
                            <div
                                className="d-flex justify-content-center align-items-center text-white rounded pt-2"
                                style={{
                                    width: "100px", height: "100px", fontSize: "90px", backgroundColor: '#004081'

                                }}>
                                {barcodeNumber}
                            </div>
                        </div>
                        <div className="col-5">
                            <button
                                className="fs-4 btn border hover-effect"
                                style={{ borderRadius: "0" }}
                                onClick={() => handlePrint()}
                            ><img src={print} alt="print" className="img-fluid px-2" style={{ height: '2rem' }} />
                                PRINT SEAT QR
                            </button>

                        </div>
                        <div className='col-1 py-3'>
                            <button
                                className="btn btn-light d-flex flex-column align-items-center justify-content-center"
                                style={buttonStyle}
                                onClick={handleOpenModal}
                            >
                                <img src={buyutec} alt="search" className="img-fluid" style={iconStyle} />
                            </button>
                        </div>

                    </div>

                </div>



            </div>
            <div className='d-flex justify-content-center pb-2 gap-5'>
                <button
                    className="btn border hover-effect"
                    style={{ borderRadius: "0" }}
                    onClick={() => handlePrintBreak()}
                ><img src={print} alt="print" className="img-fluid px-1" style={{ height: '1.5rem' }} />
                    PRINT BREAK QR
                </button>
                <button
                    className="btn border hover-effect"
                    style={{ borderRadius: "0" }}
                    onClick={() => handlePrintReset()}
                ><img src={print} alt="print" className="img-fluid px-1" style={{ height: '1.5rem' }} />
                    PRINT RESET QR
                </button>
                <button
                    className="btn border hover-effect"
                    style={{ borderRadius: "0" }}
                    onClick={() => handlePrintFullscreen()}
                ><img src={print} alt="print" className="img-fluid px-1" style={{ height: '1.5rem' }} />
                    PRINT FULL.S QR
                </button>
            </div>

            <ProductModal show={showModal} handleClose={handleCloseModal} allbarcodes={allbarcodes} />
        </div >
    );
};

export default ProductBarcode;
