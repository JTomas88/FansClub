import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Admin/gestionusuarios.module.css";
import { Context } from "../../store/appContext";
import { MdDelete } from "react-icons/md";


export const GestionUsuarios = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    //Cargamos los usuarios al montar el componente
    useEffect(() => {
        actions.obtenerTodosLosUsuarios();
    }, []);


    const changeRole = async (id, newRole) => {
        try {
            await actions.admin_editar_rol(id, newRole);
            actions.obtenerTodosLosUsuarios();
        } catch (error) {
            setError("Error al obtener los datos")
        }
    }

    const deleteUser = async (id) => {
        const result = await actions.admin_eliminar_usuario_(id).then(
            navigate('/admin/gestionusuarios')
        )
    }



    return (
        <div className="container-fluid">
            <div className={styles.tabla}>
                <h2 className="text-center">Tabla de Usuarios</h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Teléfono</th>
                            <th>Pueblo</th>
                            <th>Provincia</th>
                            <th>Dirección</th>
                            <th>Rol</th>
                            <th className="bg-alert">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.usuarios.map((usuario) => (
                            <tr key={usuario?.usId} className={styles.tableRow}>
                                <td>{usuario?.usId}</td>
                                <td>{usuario.usEmail}</td>
                                <td>{usuario.usUsername}</td>
                                <td>{usuario.usNombre}</td>
                                <td>{usuario.usApellidos}</td>
                                <td>{usuario.usTelefono}</td>
                                <td>{usuario.usPueblo}</td>
                                <td>{usuario.usProvincia}</td>
                                <td>{usuario.usDireccion}</td>
                                <td>
                                    <select
                                        value={usuario.usRol}
                                        onChange={(e) => changeRole(usuario.usId, e.target.value)}
                                        className="form-select">
                                        <option value="usuario">Usuario</option>
                                        <option value="admin">Admin</option>
                                        <option value="moderador">Moderador</option>

                                    </select>
                                </td>
                                <td>
                                    <button type="button" data-bs-toggle="modal" data-bs-target="#botonEliminarUsuario">
                                        <MdDelete />
                                    </button>
                                    <div className="modal fade" id="botonEliminarUsuario" tabIndex="-1" aria-labelledby="botonEliminarUsuarioLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="botonEliminarUsuarioLabel">Eliminar Usuario</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    ¿Seguro que quieres eliminar a este usuario?
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => deleteUser(usuario.usId)}>Si, eliminar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}