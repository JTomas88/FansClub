import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/AppContext";
import styles from "../Navbar/navbar.module.css"
import { BsExclamationTriangle } from "react-icons/bs";

export const Navbar = () => {

    const { store, actions } = useContext(Context);
    const [datoUsuario, setDatoUsuario] = useState('')

    const navigate = useNavigate();


    useEffect(() => {
        // setDatoUsuario(JSON.parse(localStorage.getItem('loginData')))
        setDatoUsuario(JSON.parse(localStorage.getItem('userData')))
    }, [store.userData])



    const logout = () => {
        actions.logOut();
        navigate('/')
    }

    const irLogin = () => {
        navigate("/inicioSesion")
    }

    const irRegistro = () => {
        navigate("/registro")
    }

    return (
        <nav className={`navbar navbar-expand-lg bg-body-tertiary ${styles.enlaces}`} style={{ fontSize: "26px" }}>
            <div className="container-fluid">

                <a className="navbar-brand" style={{ marginLeft: "5%", fontSize: "25px", fontWeight: "bold" }} href="/">Club Fans Sienna</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item" style={{ fontSize: "18px" }}>
                            <Link className="nav-link" to="/quienessienna">Quién es Sienna</Link>
                        </li>
                        <li className="nav-item" style={{ fontSize: "18px" }}>
                            <Link className="nav-link" to="/objetivoscf">Objetivos CF</Link>
                        </li>


                        {datoUsuario?.token ? (
                            <li className="nav-item dropdown" style={{ fontSize: "18px" }}>
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Multimedia
                                </a>
                                <ul className="dropdown-menu">

                                    <li>
                                        <Link to="/galeriasfotos" className="dropdown-item" style={{ fontSize: "18px" }}>Fotos</Link>
                                    </li>


                                    <li>
                                        <Link to="/entrevistas" className="dropdown-item" style={{ fontSize: "18px" }}>Entrevistas</Link>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item dropdown" style={{ fontSize: "18px" }}>
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Multimedia
                                    </a>
                                    <ul className="dropdown-menu">

                                        <li>
                                            <Link to="" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#advertenciaLogin" style={{ fontSize: "18px" }}>Fotos</Link>
                                        </li>
                                        <li>
                                            <Link to="" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#advertenciaLogin" style={{ fontSize: "18px" }}>Entrevistas</Link>
                                        </li>
                                    </ul>
                                </li>


                            </>
                        )}

                        {datoUsuario?.token ? (
                            <li className="nav-item" style={{ fontSize: "18px" }}>
                                <Link className="nav-link" to="/sorteos">Sorteos</Link>
                            </li>
                        ) : (
                            <li className="nav-item" style={{ fontSize: "18px" }}>
                                <Link className="nav-link" data-bs-toggle="modal" data-bs-target="#advertenciaLogin" to="">Sorteos</Link>
                            </li>
                        )}


                        <li className="nav-item" style={{ fontSize: "18px" }}>
                            <Link className="nav-link" to="/links">Links de interés</Link>
                        </li>



                        {datoUsuario?.rol === 'admin' ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin" style={{ color: 'red' }}>ADMINISTRADOR</Link>
                            </li>
                        ) : (<></>)}
                    </ul>


                    {datoUsuario?.token ? (
                        <li className="dropdown" style={{ color: "black", listStyle: 'none' }}>
                            <button type="button" className={`${styles.font_name} btn dropdown-toggle fs-5`} data-bs-toggle="dropdown" aria-expanded="false">
                                {datoUsuario.username}
                            </button>
                            <ul className="dropdown-menu">
                                <Link to="/completar-registro" className={styles.mi_perfil}>
                                    <li className="dropdown-item">Mi perfil</li>
                                </Link>

                                <li className="dropdown-item"
                                    onClick={() => logout()}
                                > Salir </li>

                            </ul>
                        </li>
                    ) : (
                        <div className={`${styles.login_signup}`}>
                            <Link to="/inicioSesion" >
                                <button>INICIA SESIÓN</button>
                            </Link>

                            <Link to="/registro">
                                <button>REGÍSTRATE</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>


            {/* Modal para redirigir al usuario si no esta registrado */}
            <>
                <div className="modal fade" id="advertenciaLogin" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header d-flex align-items-center">
                                <h1 className="modal-title text-dark" style={{ fontSize: '30px', marginLeft: '210px' }} id="exampleModalLabel"><BsExclamationTriangle /></h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-dark fs-5">
                                Para poder acceder a este contenido debes iniciar sesión o registrarte:
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button type="button" onClick={() => irLogin()} className="btn btn-primary" data-bs-dismiss="modal">Iniciar Sesion</button>
                                <button type="button" onClick={() => irRegistro()} className="btn btn-primary" data-bs-dismiss="modal">Registrarse</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>


        </nav>
    )
};
