import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/AppContext";
import styles from "../Contacto/contacto.module.css"
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import Jumbo_contacto from "../../assets/imagenes_jumbotron/Jumbo_contacto.png"

export const Contacto = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [asunto, setAsunto] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [aceptado, setAceptado] = useState(false)


    const resetForm = () => {
        setNombre('');
        setEmail('');
        setAsunto('')
        setMensaje('')
        setAceptado(false)
    }

    const enviarDatos = async (evento, nombre, email, asunto, mensaje) => {
        evento.preventDefault()

        if (!nombre || !email || !asunto || !mensaje) {
            alert("Se deben completar todos los datos")
            return
        }
        try {
            const respuesta = actions.send_email(nombre, email, asunto, mensaje);
            resetForm();
            alert("Se ha enviado tu mensaje. Recibirás respuesta en tu correo electrónico")
            return

        } catch (error) {
            console.error("Error: ", error)
        }
    }

    const checkeado = async () => {
        if (aceptado) {
            alert("Debes aceptar la política de datos")
        } else {
            setAceptado(true)
        }

    }

    return (
        <div className="bg-color mb-3">
            <Jumbotron imagenFondo={{ backgroundImage: `url(${Jumbo_contacto})`, backgroundPosition: 'center 26%' }} subtitulo={"Malditas alas que nos robaron"} referencia={'registro'} />

            <div>
                <div className="d-flex justify-content-center align-items-center">
                    <h1 className={`${styles.titulo}`}>CONTACTO</h1>
                </div>
            </div>
            <div className="container">
                <p style={{ fontSize: '16px' }}>Puedes hacernos llegar tus sugerencias completando los siguientes datos</p>
            </div>

            <form className="container" onSubmit={(evento) => enviarDatos(evento, nombre, email, asunto, mensaje)}  >
                <div className="row">
                    <div className="col">
                        <div className="mb-3">
                            <label htmlFor="nombre" className={`form-label fs-5 ${styles.labels}`} style={{ color: 'white', fontSize: '16px' }}>Nombre</label>
                            <input type="text" className="form-control" id="nombre" placeholder="Escribe tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                    </div>
                    <div className="col">
                        <div className="mb-3">
                            <label htmlFor="email" className={`form-label fs-5 ${styles.labels}`} style={{ color: 'white', fontSize: '16px' }}>Email</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Escribe tu correo electrónico" />
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="asunto" className={`form-label fs-5 ${styles.labels}`} style={{ color: 'white', fontSize: '16px' }}>Asunto</label>
                    <input type="text" className="form-control" id="asunto" placeholder="Asunto" onChange={(e) => setAsunto(e.target.value)} value={asunto} />
                </div>

                <div className="mb-3">
                    <label htmlFor="mensaje" className={`form-label fs-5 ${styles.labels}`} >Mensaje</label>
                    <textarea type="text" cols={30} rows={5} className="form-control" id="mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Escribe aquí tu sugerencia" />
                </div>

                <div className="mb-3 text-center">
                    <input type="checkbox" className="form-check-input me-2" id="CheckPrivacidad" onClick={() => checkeado()} checked={aceptado} />
                    <label className="form-check-label" style={{ color: 'white', fontSize: '16px' }}>
                        <span className={`fs-5 ${styles.labels}`} >Acepto la política de privacidad de datos</span>
                    </label>
                </div>
                {aceptado ? (
                    <div className="text-center">
                        <button type="submit" className={`${styles.botonEnviar} btn fs-5`} >Enviar</button>
                    </div>

                ) : (
                    <div className="text-center">
                        <button type="submit" disabled className={`${styles.botonEnviar} btn fs-5`} >Enviar</button>
                    </div>
                )
                }



            </form >

        </div >
    )
}