import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Context } from "../../store/AppContext";
import { GiMicrophone } from "react-icons/gi";



export const Carpetas = ({ setCarpetaSeleccionada }) => {
    const { store, actions } = useContext(Context);
    const [carpetaClicada, setCarpetaClicada] = useState(null);


    //Llamo a la función para mostrar las carpetas cuando el componente se cargue.
    useEffect(() => {
        actions.admin_mostrarCarpetas();
    }, []);


    const seleccionarCarpeta = (carpeta) => {
        setCarpetaSeleccionada(carpeta.name);
        setCarpetaClicada(carpeta.name)
    };

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", height: '6vh' }}>
                {Array.isArray(store.carpetasFotos) && store.carpetasFotos.length > 0 ? (
                    store.carpetasFotos.map((carpeta, index) => (
                        <div
                            key={index}
                            onClick={() => seleccionarCarpeta(carpeta)} //Click simple selecciona la carpeta
                            style={{
                                border: carpetaClicada === carpeta.name ? "5px solid purple" : "none",
                                padding: "10px",
                                margin: "10px",
                                textAlign: "center",
                                width: "120px",
                                cursor: "pointer",
                                color: "white",
                            }}


                        >
                            <GiMicrophone size={35} color="white" />
                            <p style={{ fontSize: '15px' }}>{carpeta.name}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ fontSize: '15px' }}>No hay carpetas creadas.</p>
                )}
            </div>
        </div>

    )
}