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

                                <div className="col-md-6 ">
                                    <p className={styles.cuerpo_ent}>{entrevista.entCuerpoEntrevista}</p>
                                </div>


                                <div className="col-md-6 d-flex flex-column align-items-center">
                                    {entrevista.entImagen && entrevista.entImagen.length > 0 ? (
                                        entrevista.entImagen.split(",").map((img, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                alt="imagen promocional"
                                                src={img}
                                                className="img-fluid mb-3"
                                                style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "10px" }}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted">No hay imágenes disponibles</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No hay entrevistas disponibles.</p>
                )}
            </div>





        </>

    )
}