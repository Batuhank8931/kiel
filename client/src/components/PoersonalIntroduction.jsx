import React, { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import UserModal from "./UserModal"; // Import the modal component
import API from "../utils/utilRequest";

import photo from "../assets/photo.png";
import personal from "../assets/personal.png";
import save from "../assets/save.png";
import buyutec from "../assets/search.png";
const PersonalIntroduction = () => {
    const [qrContent, setQrContent] = useState("-");
    const [showModal, setShowModal] = useState(false); // State to control modal
    const [userData, setUserData] = useState([]);

    const [fields, setFields] = useState({
        seriNo: "",
        name: "",
        surname: "",
    });

    const GetUsers = async () => {
        try {
            const response = await API.getUsers();
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    useEffect(() => {
        GetUsers();
    }, []);

    const handleInputChange = (field, value) => {
        const updatedFields = { ...fields, [field]: value };
        setFields(updatedFields);
        //const newQrContent = `serino: ${updatedFields.seriNo}, name: ${updatedFields.name}, surname: ${updatedFields.surname}`;
        const seriNo = updatedFields.seriNo;
        const name = updatedFields.name;
        const surname = updatedFields.surname;
        const namePrefix = name.slice(0, 2).toLowerCase();  
        const surnamePrefix = surname.slice(0, 2).toLowerCase();  
        const newQrContent =  `UN${seriNo}${namePrefix}${surnamePrefix}`;  
        setQrContent(newQrContent);
    };

    const handleSave = async () => {
        if (!fields.seriNo || !fields.name || !fields.surname) {
            alert("All fields are required!");
            return;
        }
    
        const data = {
            seriNo: fields.seriNo,
            name: fields.name,
            surname: fields.surname
        };
    
        try {
            const response = await API.putUsers(data);
            alert(response.data.message);
            GetUsers();
    
            // Clear the input fields after successful save
            setFields({
                seriNo: "",
                name: "",
                surname: ""
            });
    
            // Reset QR code content
            setQrContent("-");
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };
    


    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const buttonStyle = { width: "50px", height: "50px" };
    const iconStyle = { height: "1.5rem" };

    return (
        <div className="col-6 border d-flex flex-column m-0" style={{ height: "100%" }}>
            <div
                className="d-flex text-white fs-5 align-items-center justify-content-center"
                style={{ backgroundColor: "#004081", height: "20%" }}
            >
                PERSONAL INTRODUCTION
            </div>

            <div className="d-flex flex-grow-1 align-items-center justify-content-center p-3 m-0">
                <div className="col-2 p-0">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="p-2" style={{ backgroundColor: "rgba(0, 64, 129, 0.5)" }}>
                            <img src={photo} alt="photo" className="img-fluid" style={{ height: "3rem" }} />
                        </div>
                    </div>
                    <div className="pt-2 text-center">Personal Count</div>
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="px-2">
                            <img src={personal} alt="personal" className="img-fluid" style={{ height: "1rem" }} />
                        </div>
                    </div>
                    <div className="text-center">{userData.length}</div>
                </div>

                <div className="col-5">
                    <div className="row py-2">
                        <div className="col-4 d-flex align-items-center">No:</div>
                        <div className="col-8 d-flex align-items-center">
                            <input
                                type="text"
                                className="form-control bg-primary bg-opacity-25"
                                value={fields.seriNo}
                                onChange={(e) => handleInputChange("seriNo", e.target.value)}
                            />

                        </div>
                    </div>

                    <div className="row py-2">
                        <div className="col-4 d-flex align-items-center">Name:</div>
                        <div className="col-8 d-flex align-items-center">
                            <input
                                type="text"
                                className="form-control bg-primary bg-opacity-25"
                                value={fields.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row py-2">
                        <div className="col-4 d-flex align-items-center">Surname:</div>
                        <div className="col-8 d-flex align-items-center">
                            <input
                                type="text"
                                className="form-control bg-primary bg-opacity-25"
                                value={fields.surname}
                                onChange={(e) => handleInputChange("surname", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-5 d-flex flex-row justify-content-center align-items-center">
                    <div className="pe-4">{qrContent && <QRCode value={qrContent} size={150} />}</div>
                    <div className="d-flex gap-4 p-1 flex-column">
                        <button
                            className="btn btn-light d-flex flex-column align-items-center justify-content-center"
                            style={buttonStyle}
                            onClick={handleSave} // Attach event
                        >
                            <div style={{ fontSize: "0.75rem" }}>Save</div>
                            <img src={save} alt="save" className="img-fluid" style={iconStyle} />
                        </button>


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

            {/* Modal Component */}
            <UserModal show={showModal} handleClose={handleCloseModal} userData={userData} />
        </div>
    );
};

export default PersonalIntroduction;



