import React from "react";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import Jumbo_InicioSesion from "../../assets/imagenes_jumbotron/Jumbotron_InicioSesion.png"
import { FormInicioSesion } from "../../componentes/FormInicioSesion/FormInicioSesion";

export const InicioSesion = () => {
    return (
        <div className="bg-color mb-3">
            <Jumbotron imagenFondo={{ backgroundImage: `url(${Jumbo_InicioSesion})`, backgroundPosition: 'center 29%' }} subtitulo={"Lo siento, no me arrepiento"} referencia={'registro'} />
            <div className="text-center align-items-center d-flex">
                <FormInicioSesion />
            </div>
        </div>
    )
}