import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";
import styles from "../Navbar/navbar.module.css"

export const Navbar = () => {

    const { store, actions } = useContext(Context);


    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">

                <a className="navbar-brand ml-3" href="/">Club Fans Oficial Sienna</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/quienesSienna">Quién es Sienna</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/objetivoscf">Objetivos CF</Link>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Multimedia
                            </a>
                            <ul className="dropdown-menu">

                                <li>
                                    <Link to="/multimediafotos" className="dropdown-item" >Fotos</Link>
                                </li>


                                <li>
                                    <Link to="/entrevistas" className="dropdown-item" >Entrevistas</Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/sorteos">Sorteos</Link>
                        </li>


                        <li className="nav-item">
                            <Link className="nav-link" to="/objetivoscf">Links de interés</Link>
                        </li>

                        {store.userData.role === 'admin' ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">ADMINISTRADOR</Link>
                            </li>
                        ) : (<></>)}



                    </ul>


                    {store.userData.token ?
                        <li className="dropdown">
                            <button type="button" className={`${styles.font_name} btn dropdown-toggle fs-5`} data-bs-toggle="dropdown" aria-expanded="false">
                                {store.userData.username}
                            </button>
                            <ul className="dropdown-menu">
                                <Link to="/perfilusuario" >
                                    <li className="dropdown-item">Mi perfil</li>
                                </Link>

                                <li className="dropdown-item"
                                // onClick={logout}
                                > Salir </li>

                            </ul>
                        </li>

                        :
                        <div className={`${styles.login_signup}`}>
                            <Link to="/inicioSesion" >
                                <button>INICIAR SESION</button>
                            </Link>

                            <Link to="/formularioregistro">
                                <button>REGÍSTRATE</button>
                            </Link>
                        </div>
                    }







                </div>
            </div>
        </nav>
    )
};
