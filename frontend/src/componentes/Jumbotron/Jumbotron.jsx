import React from "react";
import styles from "./jumbotron.module.css";

export const Jumbotron = ({ imagenFondo, subtitulo, referencia }) => {
    return (
        <>
            {
                referencia == 'home' ? (
                    <div className={`p-5 bg-body-tertiary ${styles.jumbotron_edit_home}`}>
                        <div className={`jumbotron-content ${styles.jumbotron_content_edit}`}>
                            <div className="container">
                                <h1 className={`display-1 fw-bold  ${styles.titulo_jumbo}`}>GaRrA</h1>
                                {/* <p className="col">{subtitulo}</p> */}
                            </div>
                        </div>
                    </div>
                ) : referencia == 'foto' ? (
                    <div className={`p-5 bg-body-tertiary text-center ${styles.jumbotron_edit_foto}`} style={imagenFondo}>
                        <div className={`jumbotron-content ${styles.jumbotron_content_edit}`}>
                            <div className="container">
                                <h1 className="display-5 fw-bold ">Sienna Fans Club</h1>
                                <p className="col fs-4 text-start">{subtitulo}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`p-5 bg-body-tertiary text-center ${styles.jumbotron_edit}`} style={imagenFondo}>
                        <div className={`jumbotron-content ${styles.jumbotron_content_edit}`}>
                            <div className="container">
                                <h1 className="display-5 fw-bold ">Sienna Fans Club</h1>
                                <p className="col fs-4 text-start">{subtitulo}</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}