import React, { useContext, useEffect } from "react";
import styles from "./footer.module.css";
import { FaInstagram } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";
import { BsTiktok } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ModalProteccionDatos } from "./ModalProteccionDatos";
import { ModalUsoCookies } from "./ModalUsoCookies";
import { PiTelegramLogoLight } from "react-icons/pi";

export const Footer = () => {
    return (
        <div className="footer-content bg-body-tertiary" style={{ height: "auto" }}>
            <div className="container">
                <div className="row text-center justify-content-center">
                    <div className="col-1">
                        <a href="https://www.instagram.com/siennacharts/" target="_blank">
                            <FaInstagram fontSize={"20"} />
                        </a>
                    </div>
                    <div className="col-1">
                        <a href="https://t.me/+meErawrgpUtmNmI8" target="_blank">
                            <PiTelegramLogoLight fontSize={"20"} />
                        </a>
                    </div>
                    <div className="col-1">
                        <a href="https://www.tiktok.com/@sienna.charts" target="_blank">
                            <BsTiktok fontSize={"20"} />
                        </a>
                    </div>
                </div>

                <div className="row text-center">
                    <div className="col">
                        <a data-bs-toggle="modal" data-bs-target="#modalProteccionDatos" style={{ color: 'black', fontSize: "15px" }}>
                            Protección de datos
                        </a>
                        <div className="modal fade" id="modalProteccionDatos" tabIndex="-1" aria-labelledby="modalProteccionDatosLabel" aria-hidden="true" >
                            <ModalProteccionDatos />
                        </div>
                        <a data-bs-toggle="modal" data-bs-target="#modalUsoCookies" style={{ color: 'black', fontSize: "15px", marginLeft: "1%" }} >
                            Uso de cookies
                        </a>
                        <div className="modal fade" id="modalUsoCookies" tabIndex="-1" aria-labelledby="modalUsoCookiesLabel" aria-hidden="true">
                            <ModalUsoCookies />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}