import React, { useState } from "react";
import styles from "./fotos.module.css";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import Jumbo_fotos from "../../assets/imagenes_jumbotron/Jumbo_fotos.png"
import { Carpetas } from "../../componentes/MultimediaFotos/Carpetas";
import { VisorComponente } from "../../componentes/MultimediaFotos/VisorComponente";

export const Fotos = () => {
    const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null); // Estado para la carpeta seleccionada

    return (
        <>
            <div>
                <Jumbotron imagenFondo={{ backgroundImage: `url(${Jumbo_fotos})`, backgroundPosition: 'center 30%' }} subtitulo={"Tal vez sólo hay sombras y formas"} referencia={'foto'} ></Jumbotron>
            </div>
            <div className="container justify-content-center align-items-center text-center">
                <div className={`${styles.titulo}`}>
                    <h1 className={`${styles.titulo}`}>FOTOS</h1>
                </div>
                <p className="text-center">Selecciona una carpeta para ver las fotos</p>

                {/* Pasamos la función setCarpetaSeleccionada a Carpetas para actualizar el estado */}
                <div>
                    <Carpetas setCarpetaSeleccionada={setCarpetaSeleccionada} />
                </div>

                {/* Pasamos la carpeta seleccionada a VisorFotos */}
                <div>
                    <VisorComponente carpetaSeleccionada={carpetaSeleccionada} />
                </div>



            </div>
        </>
    )
}