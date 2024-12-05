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
                                        } else if (recuentoImagenes === 2) {
                                            const cuerpo = entrevista.entCuerpoEntrevista;
                                            const splitIndex1 = Math.floor(cuerpo.length / 3); // Primer punto de corte
                                            const splitIndex2 = Math.floor((cuerpo.length * 2) / 3); // Segundo punto de corte

                                            // Divide el texto en tres partes
                                            const cuerpoParte1 = cuerpo.slice(0, splitIndex1);
                                            const cuerpoParte2 = cuerpo.slice(splitIndex1, splitIndex2);
                                            const cuerpoParte3 = cuerpo.slice(splitIndex2);
                                            return (
                                                <>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <p style={{ textAlign: 'justify' }}>{cuerpoParte1}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <img
                                                                alt="imagen promocional"
                                                                src={imagenesSeparadas[1]}
                                                                className="img-fluid mb-3"
                                                                style={{
                                                                    maxHeight: "500px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "10px",
                                                                    boxShadow: "15px 15px 10px rgba(0, 0, 0, 0.5)"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <p style={{ textAlign: 'justify' }}>{cuerpoParte2}</p>
                                                        <img
                                                            alt="imagen promocional"
                                                            src={imagenesSeparadas[0]}
                                                            className="img-fluid mb-3"
                                                            style={{
                                                                maxHeight: "300px",
                                                                objectFit: "cover",
                                                                borderRadius: "10px",
                                                                boxShadow: "15px 15px 10px rgba(0, 0, 0, 0.5)"
                                                            }}
                                                        />
                                                        <p style={{ textAlign: 'justify' }}>{cuerpoParte3}</p>
                                                    </div>

                                                </>
                                            )



                                        }
                                    })()
                                ) : (
                                    <></>
                                )}

                            </div>




                            {/* <div className="row">
                                <div className="col-md-6 ">
                                    <p className={styles.cuerpo_ent}>{entrevista.entCuerpoEntrevista}</p>
                                </div>


                                <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
                                    {entrevista.entImagen && entrevista.entImagen.length > 0 ? (
                                        (() => {
                                            const imagenesSeparadas = entrevista.entImagen
                                                .split(",")
                                                .map((img) => img.trim());
                                            const recuentoImagenes = imagenesSeparadas.length;

                                            if (recuentoImagenes === 1) {
                                                return (
                                                    <div>
                                                        <img
                                                            alt="imagen promocional"
                                                            src={imagenesSeparadas[0]}
                                                            className="img-fluid mb-3"
                                                            style={{
                                                                maxHeight: "450px",
                                                                objectFit: "cover",
                                                                borderRadius: "10px",
                                                                boxShadow: "15px 15px 10px rgba(0, 0, 0, 0.5)"
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            } else if (recuentoImagenes === 2) {
                                                return (
                                                    <div className="d-flex">
                                                        {imagenesSeparadas.map((img, imgIndex) => (
                                                            <img
                                                                key={imgIndex}
                                                                alt={`imagen promocional ${imgIndex + 1}`}
                                                                src={img}
                                                                className="img-fluid mb-3 me-2"
                                                                style={{
                                                                    width: "48%",
                                                                    height: "auto",
                                                                    objectFit: "cover",
                                                                    borderRadius: "10px",
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                );
                                            } else if (recuentoImagenes === 3) {
                                                return (
                                                    <div className="d-flex flex-wrap">
                                                        {imagenesSeparadas.map((img, imgIndex) => (
                                                            <img
                                                                key={imgIndex}
                                                                alt={`imagen promocional ${imgIndex + 1}`}
                                                                src={img}
                                                                className="img-fluid mb-3 me-2"
                                                                style={{
                                                                    width: imgIndex === 0 ? "100%" : "48%",
                                                                    height: "auto",
                                                                    objectFit: "cover",
                                                                    borderRadius: "10px",
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                );
                                            } else if (recuentoImagenes === 4) {
                                                return (
                                                    <div className="d-flex flex-wrap justify-content-between">
                                                        {imagenesSeparadas.map((img, imgIndex) => (
                                                            <img
                                                                key={imgIndex}
                                                                alt={`imagen promocional ${imgIndex + 1}`}
                                                                src={img}
                                                                className="img-fluid mb-3"
                                                                style={{
                                                                    width: "48%",
                                                                    height: "auto",
                                                                    objectFit: "cover",
                                                                    borderRadius: "10px",
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                );
                                            }
                                        })()
                                    ) : (<></>)
                                    }
                                </div>
                            </div> */}
                        </div>
                    ))
                ) : (
                    <p className="text-center">No hay entrevistas disponibles.</p>
                )}
            </div >





        </>

    )
}