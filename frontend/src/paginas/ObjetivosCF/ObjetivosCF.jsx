import React from "react";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import styles from "./objetivoscf.module.css"
import Jumbo_Objetvos from "../../assets/imagenes_jumbotron/Jumbo_Objetivos.png"


export const ObjetivosCF = () => {
    return (
        <div className="container-fluid">
            <div>
                <Jumbotron imagenFondo={{ backgroundImage: `url(${Jumbo_Objetvos})`, backgroundPosition: 'center 25%' }} subtitulo={"Noto esa rabia que, joder, me va y me viene"} referencia={'home'} ></Jumbotron>
            </div>
            <div className="row">
                <div className="col">
                    <div className={`text-center ${styles.titulocol}`}>
                        QUIENES SOMOS
                    </div>
                    <div className={`${styles.texto}`}>
                        <p> Como el propio nombre indica, somos un grupo de gente a la que nos gusta la música y letras que compone Sienna. <br></br>
                            No solo somos fans de sus canciones, de sus letras que expresan y las melodías que no podemos dejar de tararear, sino también de una forma de ser y de trabajar. <br></br>
                            Su persistencia y buen hacer en su profesión le están llevando a tener una carrera musical ascendente, calculando la mezcla exacta entre experimentar y no perder calidad musical.
                            Por eso nació este espacio, para tener un punto común donde poder estar al tanto de su carrera musical y poder formar un núcleo duro de apoyo. <br></br> <br></br>
                            Tom y Daniel
                        </p>
                    </div>
                    {/* <div className="d-flex justify-content-center mt-5">
                        <img src={foto} className={`${styles.foto}`} alt="foto"></img>
                    </div> */}

                </div>

                <div className="col">
                    <div className="row">
                        <div className={`text-center ${styles.titulocol}`}>
                            ¿QUE HAREMOS?
                        </div>
                        <div className={`container-fluid ${styles.texto}`}>
                            <ul style={{ cursor: 'default' }}>
                                <li style={{ cursor: 'default' }}>Dar a conocer la carrera musical de Sienna</li>
                                <li style={{ cursor: 'default' }}>Organizar actividades que ayuden a conseguir el objetivos anterior</li>
                                <li style={{ cursor: 'default' }}>Crear un servicio de información dirigido a los asociados</li>
                                <li style={{ cursor: 'default' }}>Manter la página activa y en continua mejora</li>
                                <li style={{ cursor: 'default' }}>Creación de actividades virtuales como encuestas o foros</li>
                                <li style={{ cursor: 'default' }}>Organizar actividades de reunión de los asociados con la finalidad de apoyo a Sienna</li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className={`text-center ${styles.titulocol}`}>
                            ENTRE TODOS
                        </div>
                        <div className={`container ${styles.texto}`}>
                            <ul style={{ cursor: 'default' }}>
                                <li style={{ cursor: 'default' }}>Colaborar, en la medida de lo posible, en las actividades</li>
                                <li style={{ cursor: 'default' }}>Mantenerse activo en la actividad de la web (encuestas, foros)</li>
                                <li style={{ cursor: 'default' }}>Mantener los datos del perfil actualizados </li>
                                <br></br>
                                <p>...y sobre todo ! ! !  dar mucho apoyo al proyecto musical de Sienna</p>
                            </ul>
                        </div>

                    </div>

                </div>

            </div>

        </div>







        // </div>
    )
}