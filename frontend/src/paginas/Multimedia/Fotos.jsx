import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/AppContext";
import styles from "./fotos.module.css";
import { useNavigate } from "react-router-dom";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import Jumbo_fotos from "../../assets/imagenes_jumbotron/Jumbo_fotos.png"
import { Carpetas } from "../../componentes/MultimediaFotos/Carpetas";
import { VisorComponente } from "../../componentes/MultimediaFotos/VisorComponente";

export const Fotos = () => {
    const { store, actions } = useContext(Context);
    const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null); // Estado para la carpeta seleccionada
    const navigate = useNavigate();
    const [datoUsuario, setDatoUsuario] = useState('')



    //Para que no se pueda acceder con un perfil diferente al de 'admin//
    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData || !userData.token || !userData.email) {
                navigate('/');
            } else {
                setDatoUsuario(userData);
            }
        } catch (error) {
            console.error('Error al obtener datos de localStorage:', error);
            navigate('/');
        }
    }, []);


    return (
        <>
            <div>
                <Jumbotron imagenFondo={{ backgroundImage: `url(${Jumbo_fotos})`, backgroundPosition: 'center 30%' }} subtitulo={"¿Cómo has podido destrozar todo lo que vivimos?"} referencia={'foto'} ></Jumbotron>
            </div>
            <div className={`container justify-content-center align-items-center text-center ${styles.control_navbar}`}>
                <div className={`titulo_foto ${styles.titulo}`}>
                    <h1 className={`${styles.titulo}`}>FOTOS</h1>
                </div>
                <p className="text-center" style={{ fontSize: '15px' }}>Selecciona una carpeta para ver las fotos</p>

                {/* Pasamos la función setCarpetaSeleccionada a Carpetas para actualizar el estado */}
                <div>
                    <Carpetas setCarpetaSeleccionada={setCarpetaSeleccionada} />
                </div>

                {/* Pasamos la carpeta seleccionada a VisorFotos */}
                <div className="mb-5">
                    <VisorComponente carpetaSeleccionada={carpetaSeleccionada} style={{ height: '100vh' }} />
                </div>
            </div>
        </>
    )
}