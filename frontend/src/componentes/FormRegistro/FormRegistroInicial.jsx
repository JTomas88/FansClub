import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./formregistroinicial.module.css";
import { Context } from "../../store/AppContext";

export const FormRegistroInicial = () => {

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const registro = async (event, email, username, password) => {
        event.preventDefault();

        if (!email || !password || !username) {
            setError("Por favor, complete todos los datos requeridos");
            return;
        }

        store.usuarios.map((usuario) => {

            if (usuario.email === email) {
                setError("Este correo electrónico ya existe.Accede en Iniciar Sesion")
            }

        })
        await actions.crear_usuario(email, username, password);
        navigate('/completar-registro')

    }



    return (
        <div className="container mb-5 mt-5">
            <h3 className="justify-text-center">FORMULARIO DE REGISTRO</h3>
            <div className={`${styles.boxFormulario}`}>

                <form onSubmit={(event) => registro(event, email, username, password)} >
                    {error && <div className="alert alert-danger" style={{ fontSize: '16px' }} role="alert">{error}</div>}
                    <div className="mb-3">
                        <label htmlFor="inputEmail" className="form-label text-white">Correo Electronico</label>
                        <input type="email"
                            className="form-control"
                            id="inputEmail"
                            placeholder="Introduce tu correo electrónico"
                            onChange={(e) => setEmail(e.target.value)} value={email}>
                        </input>

                    </div>

                    <div className="mb-3">
                        <label htmlFor="inputUsuario" className="form-label text-white ">Nombre de usuario</label>
                        <input type="text"
                            className="form-control"
                            id="inputUsuario"
                            placeholder="Introduce un nombre de usuario"
                            onChange={(e) => setUsername(e.target.value)} value={username}>
                        </input>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="inputPassword" className="form-label text-white">Contraseña</label>
                        <input type="password"
                            className="form-control"
                            id="inputPassword"
                            onChange={(e) => setPassword(e.target.value)} value={password}>
                        </input>
                    </div>

                    <div className="mb-3 form-check text-start">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label text-white" htmlFor="exampleCheck1">Recordar mis datos</label>
                    </div>
                    <button type="submit" className="btn botones">Enviar</button>
                    <p className="text-secondary fst-italic pt-2">¿Ya tienes una cuenta?<Link to="/inicioSesion"><button className="btn text-primary fw-bold">¡Inicia sesión!</button></Link></p>
                </form>
            </div>
        </div>
    )
}