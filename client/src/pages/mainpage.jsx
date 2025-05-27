import React from "react";
import axios from "axios";
import API from "../utils/utilRequest.js";


import GenerateReport from "../components/GenereateReport.jsx";
import PersonalIntroduction from "../components/PoersonalIntroduction.jsx";
import ProductBarcode from "../components/ProductBarcode.jsx";
import CreateSeatQr from "../components/CreateSeatQr.jsx";
import Product from "../components/Product.jsx";
import Menu from "../components/menu.jsx";

function MainPage() {


    return (
        <div className="d-flex flex-column vh-100">
            <div className="h-40">
                <Menu />
                <GenerateReport />
            </div>
            <div className="d-flex h-50">
                <PersonalIntroduction />
                <ProductBarcode />
            </div>
            <div className="h-5 d-flex align-items-center justify-content-center p-1 text-white fs-5" style={{ backgroundColor: '#004081' }}>
                PRODUCTION
            </div>
            <div className=" h-20">
                <Product />
            </div>

        </div>

    );
}

export default MainPage;
