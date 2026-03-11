import React from "react";
import styles from "./jumbotron.module.css";

export const Jumbotron = ({ imagenFondo, subtitulo, referencia }) => {
    return (
        <>
            {
                <div className={`${styles.jumbotron_edit_home}`}>
                    <div className={`jumbotron-content ${styles.jumbotron_content_edit}`}>
                        <div className="container d-flex justify-content-center">
                            <h1 className={`display-1 fw-bold  ${styles.titulo_jumbo}`}>SiEnNa</h1>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}