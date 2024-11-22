import React, { useContext, useEffect, useState } from "react";
import styles from "../Videos/videos.module.css"
import img from "../../assets/Videos/15.png"

export const Videos = () => {
    const [enlaces, setEnlaces] = useState('');
    const [mostrarVideo, setMostrarVideo] = useState(false)
    const [esPantallaMovil, setEsPantallaMovil] = useState(false)

    const seleccionClick = (enlace) => {
        setEnlaces(enlace)
        setMostrarVideo(true);
    }

    /**
     * comprobarEsMovil: recibe el tamaño de una pantalla, concretamente si la pantalla es menor o igual a 768px
     * Devuelve true si la condición anterior se cumple
     * Se ejecuta comprobarEsMovil() se llama a sí mismo para obtener el tamaño de la pantalla cada vez que se ejecute el componente. 
     * window.addEventListener("resize", comprobarEsMovil) --> está pendiente de si se cambia el tamaño de la pantalla para volver a ejecutar lo anterior. 
     * return () => window.removeEventListener("resize", comprobarEsMovil) --> se elimina la escucha del addEventListener para que deje de estar pendiente
     * cuando el componente ya está cargado y sabe en qué tipo de pantalla estamos. 
     */



    useEffect(() => {
        const comprobarEsMovil = () => setEsPantallaMovil(window.matchMedia("(max-width: 768px").matches)
        comprobarEsMovil()
        window.addEventListener("resize", comprobarEsMovil)

        return () => window.removeEventListener("resize", comprobarEsMovil)
    }, [])





    return (
        <div className="container text-white mt-5">

            <div className={`${styles.tranceVideos} justify-content-center align-items-center d-flex mb-2`} >
                TRANCE VIDEOS
            </div>

            {/* Acceso para pantalla móvil */}
            {esPantallaMovil ? (
                <div className={`container ${styles.vistaMovil}`}>
                    <div className="row" style={{ fontSize: "14px" }}>
                        <div className="col">
                            <a onClick={() => seleccionClick('https://www.youtube.com/embed/0qEnQmvJ_nY?si=TIC5jR2Y1AcAbOag')}> Creí que era eterno || </a>
                            <a onClick={() => seleccionClick("https://www.youtube.com/embed/oe53HQUuLOo?si=MfD7LBouYOhtTG22")}> Como un animal  <br></br> </a>
                            <a onClick={() => seleccionClick("https://www.youtube.com/embed/CQ6MuTnah64?si=sZimXX6BvR_TllmU")}> Tu fiel jodida mitad || </a>
                            <a onClick={() => seleccionClick("https://www.youtube.com/embed/XEE7iUa_UjQ?si=_1ofSyCUyIAm1wSz")}> Esto no es el cielo <br></br></a>
                            <a onClick={() => seleccionClick("https://www.youtube.com/embed/IFongdRgrF0?si=9pezlhz8JtAIJN2E")}> No se puede frenar || </a>
                            <a onClick={() => seleccionClick('https://www.youtube.com/embed/lFThDfOLfuw?si=UvrO6EztR7PP5rpd')}> Fuera (x3) <br></br></a>
                            <a onClick={() => seleccionClick("https://www.youtube.com/embed/nLTVNPHoeaQ?si=RydnWjv24We3tnBz")}> Cristales en mi mente ||</a>
                            <a onClick={() => seleccionClick("https://www.youtube.com/embed/duwFCGCozJM?si=_OBZCMzIVAHhfEbT")}> Un poco cabrón <br></br></a>
                            <a onClick={() => seleccionClick("https://www.youtube.com/embed/1oE3gFWVvUc?si=uov33rNB80BTl7A8")}> Tengo que soltar ||</a>
                            <a onClick={() => seleccionClick("https://www.youtube.com/embed/MvCpIp4_2XE?si=rMsVFcciiMfP6O3H")}> Siempre es lo mismo  </a>
                        </div>
                    </div>

                    <div className="col-6">
                        {!mostrarVideo ? (
                            <div style={{ margin: '20px 0' }} className="d-flex justify-content-center align-items-center">
                                <img src={img} style={{ width: "390", height: "219px" }}></img>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center" style={{ margin: '20px 0' }}>
                                <iframe width="860" height="315" src={`${enlaces}?vq=hd1080`}
                                    title="Hola" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                            </div>
                        )}
                    </div>
                </div>

            ) : (

                <>
                    {/* Acceso para pantalla escritorio */}
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-4 text-center" style={{ fontSize: "15px" }}>
                            <ul>
                                <li> <a onClick={() => seleccionClick('https://www.youtube.com/embed/0qEnQmvJ_nY?si=TIC5jR2Y1AcAbOag')}> Creí que era eterno </a></li>
                                <li> <a onClick={() => seleccionClick("https://www.youtube.com/embed/oe53HQUuLOo?si=MfD7LBouYOhtTG22")}> Como un animal </a></li>

                            </ul>
                        </div>
                    </div>
                    <div className="row d-flex align-items-center justify-content-center" style={{ fontSize: "15px" }}>
                        <div className="col-3">
                            <ul>
                                <li> <a onClick={() => seleccionClick("https://www.youtube.com/embed/CQ6MuTnah64?si=sZimXX6BvR_TllmU")}> Tu fiel jodida mitad </a></li>
                                <li> <a onClick={() => seleccionClick("https://www.youtube.com/embed/XEE7iUa_UjQ?si=_1ofSyCUyIAm1wSz")}> Esto no es el cielo </a></li>
                                <li> <a onClick={() => seleccionClick("https://www.youtube.com/embed/IFongdRgrF0?si=9pezlhz8JtAIJN2E")}> No se puede frenar </a></li>
                            </ul>
                        </div>

                        {/* Contenedor imagen fondo // reproductor */}
                        <div className="col-6">
                            {!mostrarVideo ? (
                                <div style={{ margin: '20px 0' }} className="d-flex justify-content-center align-items-center">
                                    <img src={img} style={{ width: "860", height: "315px" }}></img>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center align-items-center" style={{ margin: '20px 0' }}>
                                    <iframe width="860" height="315" src={`${enlaces}?vq=hd1080`}
                                        title="Hola" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                </div>
                            )}
                        </div>

                        <div className="col-3" >
                            <ul>
                                <li> <a onClick={() => seleccionClick('https://www.youtube.com/embed/lFThDfOLfuw?si=UvrO6EztR7PP5rpd')}> Fuera (x3) </a></li>
                                <li> <a onClick={() => seleccionClick("https://www.youtube.com/embed/nLTVNPHoeaQ?si=RydnWjv24We3tnBz")}> Cristales en mi mente</a></li>
                                <li> <a onClick={() => seleccionClick("https://www.youtube.com/embed/duwFCGCozJM?si=_OBZCMzIVAHhfEbT")}> Un poco cabrón </a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="row d-flex align-items-center justify-content-center" style={{ fontSize: "15px" }}>
                        <div className="col-4 text-center">
                            <ul>
                                <li> <a onClick={() => seleccionClick("https://www.youtube.com/embed/1oE3gFWVvUc?si=uov33rNB80BTl7A8")}> Tengo que soltar </a></li>
                                <li> <a onClick={() => seleccionClick("https://www.youtube.com/embed/MvCpIp4_2XE?si=rMsVFcciiMfP6O3H")}> Siempre es lo mismo </a></li>
                            </ul>
                        </div>
                    </div>
                </>
            )}






        </div>
    )
}