import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../FormRegistro/formregistroinicial.module.css";
import { Context } from "../../store/AppContext";

export const FormInicioSesion = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkActivo, setCheckActivo] = useState(false)


    useEffect(() => {
        actions.obtenerTodosLosUsuarios();
    }, [])


    const login = async (event, email, password) => {
        event.preventDefault();
        if (!email || !password) {
            setError("Por favor, complete todos los datos requeridos");
            return;
        }
        console.log('lista usuarios: ', store.usuarios);


        try {
            const datoUsuario = await actions.login(email, password);
            console.log('datoUsuario: ', datoUsuario)
            setError('')

            if (datoUsuario.rol && datoUsuario.email === email) {
                if (datoUsuario.token && datoUsuario.rol === "usuario") {
                    navigate('/')
                } else if (datoUsuario.token && datoUsuario.rol === "admin") {
                    navigate('/admin')
                }
            } else {
                setError("Los datos ingresados no coinciden con los de un usuario registrado")
            }



        } catch (error) {
            setError("Error al acceder")
        }

    }

    useEffect(() => {
        const emailGuardado = JSON.parse(localStorage.getItem("email"));
        const passwordGuardada = JSON.parse(localStorage.getItem("password"));

        if (emailGuardado && passwordGuardada) {
            setEmail(emailGuardado);
            setPassword(passwordGuardada)
            setCheckActivo(true)
        }
    }, [])

    const clickRecordar = async (evento) => {

        if (!checkActivo) {
            localStorage.setItem("email", JSON.stringify(email));
            localStorage.setItem("password", JSON.stringify(password));
        } else {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
        }
    }

    const handleCheckboxChange = () => {
        setCheckActivo(!checkActivo);
        clickRecordar();
    }




    return (
        <div className="container mb-5 mt-5" style={{ height: "auto" }}>
            <h3 className="justify-text-center">FORMULARIO DE INICIO DE SESIÓN</h3>
            <div className={`${styles.boxFormulario}`}>

                <form onSubmit={(event) => login(event, email, password)} >
                    {error && <div className="alert alert-danger" style={{ fontSize: '16px' }} role="alert">{error}</div>}
                    <div className="mb-3">
                        <label htmlFor="inputEmail" className="form-label text-white">Correo Electronico</label>
                        <input type="email"
                            className="form-control"
                            placeholder="Introduce tu correo electrónico"
                            onChange={(e) => setEmail(e.target.value)} value={email}

                            id="inputEmail" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="inputPassword" className="form-label text-white">Contraseña</label>
                        <input type="password"
                            className="form-control"
                            placeholder="Introduce tu contraseña"
                            onChange={(e) => setPassword(e.target.value)} value={password}
                            id="inputPassword" />
                    </div>

                    <div className="mb-3 form-check text-start">
                        <input type="checkbox" className="form-check-input " id="exampleCheck1" checked={checkActivo} onClick={handleCheckboxChange}
                        />
                        <label className="form-check-label text-white " htmlFor="exampleCheck1">Recordar mis datos</label>
                    </div>
                    <button type="submit" className="btn botones">Enviar</button>
                </form>
            </div>
        </div>
    )
}