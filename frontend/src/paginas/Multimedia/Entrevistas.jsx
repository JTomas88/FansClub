import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/AppContext";
import { useNavigate } from "react-router-dom";
import styles from "./entrevistas.module.css";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import Jumbo_entrevistas from "../../assets/imagenes_jumbotron/Jumbo_entrevistas.png"


export const Entrevistas = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [datoUsuario, setDatoUsuario] = useState('')
    const [ocultar, setOcultar] = useState(false);


    useEffect(() => {
        actions.obtenerEntrevistas();
    }, [])

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
            <Jumbotron imagenFondo={{ backgroundImage: `url(${Jumbo_entrevistas})`, backgroundPosition: 'center 35%' }} subtitulo={"Se que no parará, no se puede frenar"} referencia={'foto'} ></Jumbotron>
            <div className="container justify-content-center align-items-center text-center">
                <div className={`${styles.titulo}`}>
                    <h1 className={`${styles.titulo}`}>ENTREVISTAS</h1>
                </div>
            </div >

            {/* Contenedor de entrevistas */}
            <div className="container d-flex flex-column align-items-start" style={{ color: "black" }}>
                {store.entrevistas && store.entrevistas.length > 0 ? (
                    store.entrevistas.map((entrevista, index) => (
                        <div
                            key={index}
                            className="p-5 mb-5"
                            style={{ width: "100%", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
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
                                                                maxHeight: "300px",
                                                                objectFit: "cover",
                                                                borderRadius: "10px",
                                                                boxShadow: "15px 15px 10px rgba(0, 0, 0, 0.5)",
                                                                marginBottom: "2%"
                                                            }}
                                                        />
                                                    </div>
                                                </>

                                            );
                                        } else {
                                            const cuerpo = entrevista.entCuerpoEntrevista;
                                            const parrafos = cuerpo.split("$")
                                            const totalImagenes = imagenesSeparadas.length;
                                            const totalParrafos = parrafos.length;
                                            const imagenesPorParrafo = Math.ceil(totalParrafos / totalImagenes);
                                            let imagenIndex = 0; // Para recorrer las imágenes
                                            return (
                                                <>
                                                    <div className="row" style={{ fontSize: '15px' }}>
                                                        {parrafos.map((parrafo, index) => {
                                                            // Verificamos si ya hemos asignado una imagen
                                                            const mostrarImagen = (index % imagenesPorParrafo === 0) && imagenIndex < totalImagenes;

                                                            return (
                                                                <div key={index} className="col-md-12 mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    {/* Párrafo con texto */}
                                                                    <p style={{ textAlign: 'justify' }}>{`\n${parrafo.trim()}\n`}</p>

                                                                    {/* Mostrar imagen solo si se debe mostrar */}
                                                                    {mostrarImagen && imagenIndex < totalImagenes && (
                                                                        <div className="d-flex justify-content-center">
                                                                            <img
                                                                                alt={`imagen-${imagenIndex}`}
                                                                                src={imagenesSeparadas[imagenIndex]}
                                                                                className="img-fluid"
                                                                                style={{
                                                                                    width: "30%",
                                                                                    height: "auto",
                                                                                    objectFit: "cover",
                                                                                    borderRadius: "10px",
                                                                                    marginBottom: "2%",
                                                                                    boxShadow: "15px 15px 10px rgba(0, 0, 0, 0.5)"
                                                                                }}
                                                                            />
                                                                        </div>

                                                                    )}

                                                                    {/* Asegurarse de incrementar el índice de la imagen cuando se haya mostrado una */}

                                                                    {(() => { imagenIndex++; return null; })()}

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