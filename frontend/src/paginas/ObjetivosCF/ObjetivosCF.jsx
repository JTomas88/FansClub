import React from "react";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import styles from "./objetivoscf.module.css"
import Jumbo_Objetvos from "../../assets/imagenes_jumbotron/Jumbo_Objetivos.png"
import favicon2 from "../../assets/-Pendientes-/favicon2.png"


export const ObjetivosCF = () => {
    return (
        <div>
            <div>
                <Jumbotron
                    imagenFondo={{
                        backgroundImage: `url(${Jumbo_Objetvos})`,
                        backgroundPosition: 'center 25%',
                    }}
                    subtitulo={"Noto esa rabia que, joder, me va y me viene"}
                    referencia={'home'}
                />
            </div>

            <div className="container">
                <div className="row">
                    <div className={`text-center titulo_movil ${styles.titulo}`}>
                        QUIENES SOMOS
                    </div>
                    <div className={styles.quienes_somos}>
                        <p>
                            Como el propio nombre indica, somos un grupo de gente a la que nos gusta la música y letras que compone Sienna. <br />
                            No solo somos fans de sus canciones, de sus letras que expresan y las melodías que no podemos dejar de tararear, sino también de una forma de ser y de trabajar. <br />
                            Su persistencia y buen hacer en su profesión le están llevando a tener una carrera musical ascendente, calculando la mezcla exacta entre experimentar y no perder calidad musical.<br></br>
                            Por eso nació este espacio, para tener un punto común donde poder estar al tanto de su carrera musical y poder formar un núcleo duro de apoyo. <br /><br />

                        </p>
                    </div>


                </div>
                <div className="row">
                    <div className={`col-6 ${styles.columna}`}>
                        <div className={`text-center titulo_movil ${styles.titulo}`}>
                            ¿QUE HAREMOS?
                        </div>
                        <div className={styles.que_haremos}>
                            <ul  >
                                <li className={styles.decorador}>Dar a conocer la carrera musical de Sienna</li>
                                <li className={styles.decorador}>Organizar actividades que ayuden a conseguir el objetivos anterior</li>
                                <li className={styles.decorador}>Crear un servicio de información dirigido a los asociados</li>
                                <li className={styles.decorador}>Manter la página activa y en continua mejora</li>
                                <li className={styles.decorador}>Creación de actividades virtuales como encuestas o foros</li>
                                <li className={styles.decorador}>Organizar actividades de reunión de los asociados con la finalidad de apoyo a Sienna</li>
                            </ul>
                        </div>
                    </div>

                    <div className={`col-6 ${styles.columna}`}>
                        <div className={`text-center titulo_movil ${styles.titulo}`}>
                            ENTRE TODOS
                        </div>
                        <div className={styles.entre_todos}>
                            <ul>
                                <li className={styles.decorador}>Colaborar, en la medida de lo posible, en las actividades</li>
                                <li className={styles.decorador}>Mantenerse activo en la actividad de la web (encuestas, foros, sorteos)</li>
                                <li className={styles.decorador}>Mantener los datos del perfil actualizados</li>
                                <br />
                                <p style={{ fontSize: '16px' }}>...y sobre todo ! ! ! dar mucho apoyo al proyecto musical de Sienna</p>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

        </div >

    );
}