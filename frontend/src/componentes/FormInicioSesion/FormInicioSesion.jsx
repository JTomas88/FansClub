import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "../FormRegistro/formregistroinicial.module.css";
import { Context } from "../../store/appContext";

export const FormInicioSesion = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const login = async (event, email, password) => {
        event.preventDefault();
        if (!email || !password) {
            setError("Por favor, complete todos los datos requeridos");
            return;
        }

        try {
            await actions.login(email, password);
            setTimeout(() => {
                if (store.userData.rol && store.userData.email === email) {
                    if (store.userData.token && store.userData.rol === "usuario") {
                        navigate('/')
                    } else if (store.userData.token && store.userData.rol === "admin") {
                        navigate('/')
                    }
                } else {
                    setError("Los datos ingresados no coinciden con los de un usuario registrado")
                }
            }, 600
            )


        } catch (error) {
            setError("Error al acceder")
        }

    }




    return (
        <div className="container mb-5 mt-5">
            <h3 className="justify-text-center">FORMULARIO DE INICIO DE SESIÓN</h3>
            <div className={`${styles.boxFormulario}`}>

                <form onSubmit={(event) => login(event, email, password)} >
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <div className="mb-3">
                        <label htmlFor="inputEmail" className="form-label">Correo Electronico</label>
                        <input type="email"
                            className="form-control"
                            placeholder="Introduce tu correo electrónico"
                            onChange={(e) => setEmail(e.target.value)} value={email}
                            id="inputEmail" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="inputPassword" className="form-label">Contraseña</label>
                        <input type="password"
                            className="form-control"
                            placeholder="Introduce tu contraseña"
                            onChange={(e) => setPassword(e.target.value)} value={password}
                            id="inputPassword" />
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Recordar mis datos</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Enviar</button>
                </form>
            </div>
        </div>
    )
}