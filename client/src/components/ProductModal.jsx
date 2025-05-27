import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import print from "../assets/print.png";
import API from "../utils/utilRequest";

const ProductModal = ({ show, handleClose, allbarcodes }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [filteredBarcodes, setFilteredBarcodes] = useState([]);

    useEffect(() => {
        const formattedData = allbarcodes.map(barcode => ({
            productNo: barcode.split('.')[1],
            barcode
        }));
        setFilteredBarcodes(formattedData);
    }, [allbarcodes]);

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

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setFilteredBarcodes(
            allbarcodes.filter(barcode => barcode.includes(term)).map(barcode => ({
                productNo: barcode.split('.')[1],
                barcode
            }))
        );
    };

    const handleCheckboxChange = (productNo) => {
        setSelectedProducts(prev => prev.includes(productNo)
            ? prev.filter(id => id !== productNo)
            : [...prev, productNo]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(filteredBarcodes.map(product => product.productNo));
        } else {
            setSelectedProducts([]);
        }
    };

    const handlePrint = (barcode) => {
        let barcodearray = [barcode];
        printBarcodeRequest(barcodearray)
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Product Barcode Search</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3 d-flex flex-row justify-content-between">
                    <Form.Control
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Form.Group>

                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Barcode</th>
                                <th>Print Barcode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBarcodes.length > 0 ? (
                                filteredBarcodes.map((product, index) => (
                                    <tr key={`${product.productNo}-${index}`}>
                                        <td>{product.barcode}</td>
                                        <td className='d-flex flex-row justify-content-center gap-3'>
                                            <button className="btn btn-light" onClick={() => handlePrint(product.barcode)}>
                                                <img src={print} alt="print" style={{ height: "1.5rem" }} />
                                                <div style={{ fontSize: '0.75rem' }}>Print</div>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No Product Found
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

export default ProductModal;
