import React from "react";
import { Quien } from "../../component/Quien/Quien";
import { Jumbotron } from "../../component/Jumbotron/Jumbotron";
import { Timeline } from "../../component/Timeline/Timeline";
import styles from "../QuienEsSienna/quienessienna.module.css"
import img from "../../../assets/20.jpg";

export const QuienEsSienna = () => {
    return (
        <div className="bg-color mb-3">
            <div>
                <Jumbotron imagenFondo={{ backgroundImage: `url(${img})`, backgroundPosition: 'center 23%' }} subtitulo={"Y sin embargo, solo te noto a ti"} referencia={'home'} ></Jumbotron>
            </div>
            <div>
                <Quien />
            </div>

            <div>
                <div className={`${styles.titTimeLine}`}> UNA CARRERA IMPARABLE !</div>
                <Timeline />
            </div>
        </div>

    )
}