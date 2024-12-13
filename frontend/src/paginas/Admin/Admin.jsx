import React from "react";
import { Link } from "react-router-dom";
import styles from "../Admin/admin.module.css";


export const Admin = () => {
    return (
        <div>
            <div className={`cointainer row ${styles.body_admin}`}>
                <h3 className="text-dark text-center"><strong> PERFIL DE ADMINISTRADOR</strong></h3>

                <Link className="d-flex justify-content-center align-items-center" to="/admin/gestionusuarios">
                    <button type="button" className="btn btn-light">Gestión de usuarios</button>
                </Link>

                <Link className="d-flex justify-content-center align-items-center" to="/admin/agenda">
                    <button type="button" className="btn btn-light">Agenda (Gira y conciertos)</button>
                </Link>

                <Link className="d-flex justify-content-center align-items-center" to="/admin/gestiongalerias">
                    <button type="button" className="btn btn-light">Fotografías</button>
                </Link>

                <Link className="d-flex justify-content-center align-items-center" to="/admin/gestionentrevistas">
                    <button type="button" className="btn btn-light">Entrevistas</button>
                </Link>

                <Link className="d-flex justify-content-center align-items-center" to="/admin/gestionsorteos">
                    <button type="button" className="btn btn-light">Sorteos</button>
                </Link>



            </div>
        </div>

    )
}