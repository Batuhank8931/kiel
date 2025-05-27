import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import API from "../utils/utilRequest";
import print from "../assets/print.png";
import del from "../assets/delete.png";

const UserModal = ({ show, handleClose, userData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userarray, setUserArray] = useState([]);

    const buttonStyle = { width: "50px", height: "50px" };
    const buttonAllStyle = { width: "150px", height: "40px" };
    const iconStyle = { height: "1.5rem" };

    useEffect(() => {
        setUserArray(userData);
    }, [userData]);

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



    const GetUsers = async () => {
        try {
            const response = await API.getUsers();
            setUserArray(response.data);
        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    const handleDelete = async (seriNo) => {
        try {
            const response = await API.deleteUsers(seriNo);
            alert(response.data.message);
            GetUsers();

        } catch (error) {
            console.error("Error fetching warrant:", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCheckboxChange = (seriNo) => {
        setSelectedUsers(prevSelected => {
            if (prevSelected.includes(seriNo)) {
                return prevSelected.filter(item => item !== seriNo);
            } else {
                return [...prevSelected, seriNo];
            }
        });
    };


    const handlePrint = (barcode) => {
        let barcodearray = [barcode];
        printBarcodeRequest(barcodearray)

    };

    const handlePrintAll = () => {
        // Log the barcodes of the selected users without duplicates
        const selectedUserBarcodes = [...new Set(
            userarray.filter(user =>
                selectedUsers.includes(user.seriNo)
            ).map(user => user.barcode)
        )];
        printBarcodeRequest(selectedUserBarcodes);

    };

    const handleDeleteAll = async () => {
        // Log the barcodes of the selected users without duplicates
        const selectedUserBarcodes = [...new Set(
            userarray.filter(user =>
                selectedUsers.includes(user.seriNo)
            ).map(user => user.seriNo)
        )];


        try {
            const responses = await Promise.all(selectedUserBarcodes.map(async (seriNo) => {
                const response = await API.deleteUsers(seriNo);
                return response.data.message;
            }));

            alert(responses.join("\n"));
            GetUsers();
        } catch (error) {
            console.error("Error deleting users:", error);
            alert("An error occurred while deleting users.");
        }
    };


    const filteredUserData = userarray.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.barcode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>User Search</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3 d-flex flex-row justify-content-between">
                    <div>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div>

                    </div>
                    <div className='d-flex flex-row gap-2'>
                        <button className="btn btn-light d-flex flex-row align-items-center justify-content-center gap-3" style={buttonAllStyle} onClick={handlePrintAll}>
                            <div className='' style={{ fontSize: '0.75rem' }}>Print All</div>
                            <img src={print} alt="print" className="img-fluid" style={iconStyle} />
                        </button>
                        <button className="btn btn-light d-flex flex-row align-items-center justify-content-center gap-3" style={buttonAllStyle} onClick={handleDeleteAll}>
                            <div className='' style={{ fontSize: '0.75rem' }}>Delete All</div>
                            <img src={del} alt="delete" className="img-fluid" style={iconStyle} />
                        </button>
                    </div>
                </Form.Group>

                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedUsers(filteredUserData.map(user => user.seriNo));
                                            } else {
                                                setSelectedUsers([]);
                                            }
                                        }}
                                        checked={selectedUsers.length === filteredUserData.length}
                                    />
                                </th>
                                <th>Seri No</th>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Barcode</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUserData.length > 0 ? (
                                filteredUserData.map((user, index) => (
                                    <tr key={`${user.seriNo}-${index}`}>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.seriNo)}
                                                onChange={() => handleCheckboxChange(user.seriNo)}
                                            />
                                        </td>
                                        <td>{user.seriNo}</td>
                                        <td>{user.name}</td>
                                        <td>{user.surname}</td>
                                        <td>{user.barcode}</td>
                                        <td className='d-flex flex-row justify-content-center gap-3'>
                                            <button className="btn btn-light d-flex flex-column align-items-center justify-content-center" style={buttonStyle} onClick={() => handleDelete(user.seriNo)}>
                                                <div style={{ fontSize: '0.75rem' }}>Delete</div>
                                                <img src={del} alt="delete" className="img-fluid" style={iconStyle} />
                                            </button>
                                            <button className="btn btn-light d-flex flex-column align-items-center justify-content-center" style={buttonStyle} onClick={() => handlePrint(user.barcode)}>
                                                <div style={{ fontSize: '0.75rem' }}>Print</div>
                                                <img src={print} alt="print" className="img-fluid" style={iconStyle} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserModal;
