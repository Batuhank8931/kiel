import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import print from "../assets/print.png";
import API from "../utils/utilRequest";

const ProductModal = ({ show, handleClose, allbarcodes }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [filteredBarcodes, setFilteredBarcodes] = useState([]);
    const buttonStyle = { width: "50px", height: "50px" };
    const buttonAllStyle = { width: "150px", height: "40px" };
    const iconStyle = { height: "1.5rem" };
    useEffect(() => {
        const formattedData = allbarcodes.map(barcode => ({
            productNo: barcode.split('.')[1],
            barcode
        }));
        setFilteredBarcodes(formattedData);
    }, [allbarcodes]);

    const printBarcodeRequest = async (barcodearray) => {
        try {
            await API.printBarcode({
                barcodes: barcodearray
            });
        } catch (error) {
            console.error("Error printing barcode:", error);
        }
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = allbarcodes
            .filter(barcode => barcode.includes(term))
            .map(barcode => ({
                productNo: barcode.split('.')[1],
                barcode
            }));
        setFilteredBarcodes(filtered);
    };

    const handleCheckboxChange = (barcode) => {
        setSelectedProducts(prev =>
            prev.includes(barcode)
                ? prev.filter(b => b !== barcode)
                : [...prev, barcode]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const all = filteredBarcodes.map(product => product.barcode);
            setSelectedProducts(all);
        } else {
            setSelectedProducts([]);
        }
    };

    const handlePrint = (barcode) => {
        printBarcodeRequest([barcode]);
    };

    const handlePrintSelected = () => {
        if (selectedProducts.length > 0) {
            printBarcodeRequest(selectedProducts);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Product Barcode Search</Modal.Title>
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
                    <button className="btn btn-light d-flex flex-row align-items-center justify-content-center gap-3" style={buttonAllStyle} onClick={handlePrintSelected}>
                        <div className='' style={{ fontSize: '0.75rem' }}>Print All</div>
                        <img src={print} alt="print" className="img-fluid" style={iconStyle} />
                    </button>
                </Form.Group>

                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={
                                            filteredBarcodes.length > 0 &&
                                            filteredBarcodes.every(p => selectedProducts.includes(p.barcode))
                                        }
                                    />
                                </th>
                                <th>Barcode</th>
                                <th>Print Barcode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBarcodes.length > 0 ? (
                                filteredBarcodes.map((product, index) => (
                                    <tr key={`${product.productNo}-${index}`}>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.barcode)}
                                                onChange={() => handleCheckboxChange(product.barcode)}
                                            />
                                        </td>
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
                                    <td colSpan="3" className="text-center">
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
