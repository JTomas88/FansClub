import React from "react";
import { Quien } from "../../componentes/Quien/Quien";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import { TimelineComponent } from "../../componentes/Timeline/Timeline";
import styles from "../QuienEsSienna/quienessienna.module.css"
import img from "../../assets/imagenes_jumbotron/Jumbotron_Quien.jpg";

export const QuienEsSienna = () => {
    return (
      <div className="bg-color mb-3">
        <div>
          <Jumbotron
            imagenFondo={{
              backgroundImage: `url(${img})`,
              backgroundPosition: "center 50%",
            }}
            subtitulo={"Y sin embargo, solo te noto a ti"}
            referencia={"home"}
          ></Jumbotron>
        </div>
        <div>
          <Quien />
        </div>

        <div>
          <div className={`${styles.titTimeLine}`}>
            {" "}
            UNA CARRERA IMPARABLE !
          </div>
          <TimelineComponent />
        </div>
      </div>
    );
}