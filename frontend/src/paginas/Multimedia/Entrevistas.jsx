import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/AppContext";
import styles from "./entrevistas.module.css";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import Jumbo_entrevistas from "../../assets/imagenes_jumbotron/Jumbo_entrevistas.png"


export const Entrevistas = () => {
    const { store, actions } = useContext(Context);


    useEffect(() => {
        actions.obtenerEntrevistas();
    }, [])



    return (
        <>
            <Jumbotron imagenFondo={{ backgroundImage: `url(${Jumbo_entrevistas})`, backgroundPosition: 'center 35%' }} subtitulo={"Tal vez sólo hay sombras y formas"} referencia={'foto'} ></Jumbotron>
            <div className="container justify-content-center align-items-center text-center">
                <div className={`${styles.titulo}`}>
                    <h1 className={`${styles.titulo}`}>ENTREVISTAS</h1>
                </div>
            </div >

            {/* Contenedor de entrevistas */}
            <div className={`container d-flex flex-column align-items-start ${styles.tarjeta}`} style={{ color: "black" }}>
                {store.entrevistas && store.entrevistas.length > 0 ? (
                    store.entrevistas.map((entrevista, index) => (
                        <div
                            key={index}
                            className={`${styles.contenedor} p-4 mb-5`}
                            style={{ width: "80%", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                        >
                            {/* Fila 1: Fecha */}
                            <div className="row mb-3">
                                <div className="col text-muted text-start">
                                    <small>{new Date(entrevista.entFecha).toLocaleDateString()}</small>
                                </div>
                            </div>

                            {/* Fila 2: Titular */}
                            <div className="row mb-3">
                                <div className="col">
                                    <h2 className={styles.titular}>{entrevista.entTitular}</h2>
                                </div>
                            </div>

                            {/* Fila 3: Subtítulo */}
                            <div className="row mb-4">
                                <div className="col">
                                    <h4 className="text-muted">{entrevista.entSubtitulo}</h4>
                                </div>
                            </div>

                            <div className="row">

                                {entrevista.entImagen && entrevista.entImagen.length > 0 ? (
                                    (() => {
                                        const imagenesSeparadas = entrevista.entImagen
                                            .split(",")
                                            .map((img) => img.trim());
                                        const recuentoImagenes = imagenesSeparadas.length;
                                        if (recuentoImagenes === 1) {
                                            return (
                                                <>
                                                    <div className="col-md-6">
                                                        <p style={{ textAlign: 'justify' }}>{entrevista.entCuerpoEntrevista}</p>
                                                    </div>
                                                    <div className="col-md-6 justify-content-center d-flex align-items-center">
                                                        <img
                                                            alt="imagen promocional"
                                                            src={imagenesSeparadas[0]}
                                                            className="img-fluid mb-3"
                                                            style={{
                                                                maxHeight: "500px",
                                                                objectFit: "cover",
                                                                borderRadius: "10px",
                                                                boxShadow: "15px 15px 10px rgba(0, 0, 0, 0.5)"
                                                            }}
                                                        />
                                                    </div>
                                                </>

                                            );
                                        } else {
                                            const cuerpo = entrevista.entCuerpoEntrevista;
                                            const parrafos = cuerpo.split(/\r?\n/)
                                            const totalImagenes = imagenesSeparadas.length;
                                            const totalParrafos = parrafos.length;
                                            const imagenesPorParrafo = Math.ceil(totalParrafos / totalImagenes);
                                            let imagenIndex = 0; // Para recorrer las imágenes
                                            return (
                                                <>
                                                    <div className="row">
                                                        {parrafos.map((parrafo, index) => {
                                                            // Verificamos si ya hemos asignado una imagen
                                                            const mostrarImagen = (index % imagenesPorParrafo === 0) && imagenIndex < totalImagenes;

                                                            return (
                                                                <div key={index} className="col-md-12 mb-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                    {/* Párrafo con texto */}
                                                                    <p style={{ textAlign: 'justify' }}>{parrafo}</p>

                                                                    {/* Mostrar imagen solo si se debe mostrar */}
                                                                    {mostrarImagen && imagenIndex < totalImagenes && (
                                                                        <img
                                                                            alt={`imagen-${imagenIndex}`}
                                                                            src={imagenesSeparadas[imagenIndex]}
                                                                            className="img-fluid"
                                                                            style={{
                                                                                width: "48%",
                                                                                height: "auto",
                                                                                objectFit: "cover",
                                                                                borderRadius: "10px",
                                                                                boxShadow: "15px 15px 10px rgba(0, 0, 0, 0.5)"
                                                                            }}
                                                                        />
                                                                    )}

                                                                    {/* Asegurarse de incrementar el índice de la imagen cuando se haya mostrado una */}
                                                                    {mostrarImagen && imagenIndex++}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )
                                        }

                                    })()
                                ) : (
                                    <></>
                                )}

                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No hay entrevistas disponibles.</p>
                )}
            </div >





        </>

    )
}