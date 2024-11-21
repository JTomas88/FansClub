import React, { useContext, useEffect } from "react";
import styles from "../Slider/sliderhome.module.css";
import slider1 from "../../assets/Slider/slider-1.jpg"
import slider2 from "../../assets/Slider/slider-2.jpg"
import slider3 from "../../assets/Slider/slider-3.jpg"
import slider4 from "../../assets/Slider/slider-4.png"
import slider5 from "../../assets/Slider/slider-5.jpg"
import slider6 from "../../assets/Slider/slider-6.jpg"
import slider7 from "../../assets/Slider/slider-7.jpg"
import slider8 from "../../assets/Slider/slider-8.jpg"
import slider9 from "../../assets/Slider/slider-9.jpg"


export const SliderHome = () => {
    return (
        <div className="containter d-flex align-items-center justify-content-center">
            <div id="carouselExampleRide" className="carousel slide " data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className={`${styles.carousel_item} carousel-item active `}>
                        <img src={slider1} className={`d-block w-40 ${styles.carousel_image}`} alt="..." />
                    </div>
                    <div className={`${styles.carousel_item} carousel-item`}>
                        <img src={slider2} className={`d-block w-40 ${styles.carousel_image}`} alt="..." />
                    </div>
                    <div className={`${styles.carousel_item} carousel-item`}>
                        <img src={slider3} className={`d-block w-40 ${styles.carousel_image}`} alt="..." />
                    </div>
                    <div className={`${styles.carousel_item} carousel-item`}>
                        <img src={slider4} className={`d-block w-40 ${styles.carousel_image}`} alt="..." />
                    </div>
                    <div className={`${styles.carousel_item} carousel-item`}>
                        <img src={slider5} className={`d-block w-40 ${styles.carousel_image}`} alt="..." />
                    </div>
                    <div className={`${styles.carousel_item} carousel-item`}>
                        <img src={slider6} className={`d-block w-40 ${styles.carousel_image}`} alt="..." />
                    </div>
                    <div className={`${styles.carousel_item} carousel-item`}>
                        <img src={slider7} className={`d-block w-40 ${styles.carousel_image}`} alt="..." />
                    </div>
                    <div className={`${styles.carousel_item} carousel-item`}>
                        <img src={slider8} className={`d-block w-40 ${styles.carousel_image}`} alt="..." />
                    </div>
                    <div className={`${styles.carousel_item} carousel-item`}>
                        <img src={slider9} className={`d-block w-40 ${styles.carousel_image}`} alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>

    );


}