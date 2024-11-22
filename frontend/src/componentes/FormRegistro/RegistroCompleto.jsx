import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import styles from "../FormRegistro/registrocompleto.module.css";
import { IoMdConstruct } from "react-icons/io";

export const RegistroCompleto = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();


    //Variables para edición de datos personales//
    const [datosIniciales, setDatosIniciales] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        pueblo: '',
        provincia: '',
        direccion: ''
    })
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('')
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [pueblo, setPueblo] = useState("")
    const [provincia, setProvincia] = useState("")
    const [direccion, setDireccion] = useState("")

    const [sugerencias, setSugerencias] = useState([])

    //Variables para el cambio de contraseña//
    // const [password, setPassword] = useState('') //password actual
    // const [esValida, setEsValida] = useState(false);
    // const [nuevaPassword, setNuevaPassword] = useState('')
    // const [confNuevaPassword, setConfNuevaPassword] = useState('')



    const [error, setError] = useState(null)
    const [errorValidnuevapw, setErrorvalidnuevapw] = useState('')
    const [msjOK, setMsjOK] = useState(null)

    const [claseAlerta, setClaseAlerta] = useState("")




    const insertarPoblacion = async (evento) => {
        const valor = evento.target.value;
        setPueblo(valor)

        if (valor.length === 0) {
            setProvincia('')
        }

        if (valor.length > 2) {
            try {
                const respuesta = await actions.buscarlocalidad(valor)
                const datos = await respuesta.json()
                setSugerencias(datos)
            } catch (error) {
                console.error("Error al buscar localidades:", error)
            }
        } else {
            setSugerencias([])
        }
    }


    const changePueblo = async (evento) => {
        const { nombrePueblo, caracteres } = evento.target
        if (nombrePueblo === 'pueblo' && caracteres.length > 2) {
            try {
                const respuesta = await actions.buscarlocalidad(caracteres);
                const datos = await respuesta.json();
                setSugerencias(datos)
            } catch (error) {
                console.error("Error al buscar localidades:", error)
            }
        } else {
            setSugerencias([])
        }
    }


    const changeDireccion = (evento) => {
        const direccionUsu = evento.target.value;
        setDireccion(direccionUsu)
    }


    //Cargamos los datos del usuario si ya está registrado, si no se muestran los campos en blanco
    useEffect(() => {
        if (store.userData.us_id) {
            setNombre(store.userData.us_nombre || '');
            setApellidos(store.userData.us_apellidos || '');
            setTelefono(store.userData.us_telefono || '');
            setEmail(store.userData.us_email || '');
            setPueblo(store.userData.us_pueblo)
            setProvincia(store.userData.us_provincia || '');
            setDireccion(store.userData.us_direccion || '');

            //seteamos los valores: si ya los tiene o si los tiene en blanco. 
            setDatosIniciales({
                nombre: store.userData.us_nombre || '',
                apellidos: store.userData.us_apellidos || '',
                telefono: store.userData.us_telefono || '',
                email: store.userData.us_email || '',
                pueblo: store.userData.us_pueblo || '',
                provincia: store.userData.us_provincia || '',
                direccion: store.userData.us_direccion || ''
            });
        }
    }, [store.userData]);


    const hasChanges = (
        nombre !== datosIniciales.name ||
        apellidos !== datosIniciales.apellidos ||
        email !== datosIniciales.email ||
        telefono !== datosIniciales.telefono ||
        pueblo !== datosIniciales.pueblo ||
        provincia !== datosIniciales.provincia ||
        direccion !== datosIniciales.direccion
    );


    //
    useEffect(() => {
        if (store.userData.us_id) {
            actions.obtenerUsuarioPorId()
        }
    }, [store.userData.us_id, store.userData.token]);


    //
    const editarDatos = async (evento) => {
        evento.preventDefault();

        if (!nombre || !apellidos || !email || !telefono || !pueblo || !provincia || !direccion) {
            setError("Por favor, completa todos los campos");
            return
        }

        if (store.userData.us_id && store.userData.token) {
            await actions.editar_usuario(store.userData.us_id, store.userData.us_email, store.userData.us_nombre, store.userData.us_apellidos, store.userData.us_pueblo, store.userData.provincia, store.userData.us_direccion, nombre, apellidos, email, telefono, pueblo, provincia, direccion)
            setMsjOK("Has actualizado tus datos!");
            setError(null)
            setClaseAlerta(styles.alert_enter)

            setTimeout(() => {
                setClaseAlerta(styles.alert_enter_active);
            }, 50);

            setTimeout(() => {
                setClaseAlerta(styles.alert_exit_active);
            }, 3000);

            setTimeout(() => {
                setMsjOK(null);
                navigate("/");
            }, 3500);
        } else {
            console.error('No se ha encontrado al usuario')
        }
    };

    const editarPoblacion = (localidad) => {
        const poblacion = poblacion.descripcion.split(",")[0].trim();
        setSugerencias([])
    }

    // //Verificar contraseña actual: envía la contraseña actual al backend para comprobarla
    // const verifPassActual = async () => {
    //     const isValid = await actions.verificarpwactual(store.userData.id, password);
    //     setEsValida(isValid);
    //     if (!isValid) {
    //         setError('La contraseña actual no es correcta')
    //     } else {
    //         setError('')
    //     }
    // }

    //para mostrar un botón u otro. 
    // const validarPasswordNueva = (
    //     password !== store.userData.password &&
    //     nuevaPassword !== "" &&
    //     confNuevaPassword !== "" &&
    //     nuevaPassword === confNuevaPassword
    // )

    // const verificarnuevaPw = () => {
    //     if (nuevaPassword !== confNuevaPassword) {
    //         setErrorvalidnuevapw('La nueva contraseña no coincide')
    //     } else {
    //         setErrorvalidnuevapw('')
    //     }
    // }


    // //---CAMBIO DE CONTRASEÑA!!!!---
    // const handleClickCambioPw = async (evento) => {
    //     evento.preventDefault();
    //     try {
    //         await actions.cambiopassword(store.userData.id, nuevaPassword)

    //         await actions.getUserById()

    //     } catch (error) {
    //         console.error("Error al actualizar el password:", error)
    //     }
    // }






    return (
        <div>
            <form onSubmit={editarDatos} className="mb-4" style={{ color: "white" }}>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}

                <p>Aquí podrás completar tu perfil o editar los datos cuando lo necesites</p>
                <div className="row mt-4">
                    <div className="col-md-6">

                        <div className="mb-3">
                            <label htmlFor="nombre"
                                className="form-label">Nombre</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Escribe aquí tu nombre"
                                onChange={(e) => setNombre(e.target.value)}
                                value={nombre}
                                id="nombre" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="apellidos"
                                className="form-label">Apellidos</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Escribe aquí tus apellidos"
                                onChange={(e) => setApellidos(e.target.value)}
                                value={apellidos}
                                id="apellidos" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email"
                                className="form-label fs-5">Email</label>
                            <input type="email"
                                className="form-control"
                                value={store.userData.email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email" />

                        </div>
                        <div className="mb-3">
                            <label htmlFor="telefono"
                                className="form-label">Teléfono</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Aquí va tu número, por si tenemos que contactarte!"
                                onChange={(e) => setTelefono(e.target.value)}
                                value={telefono}
                                maxLength={9}
                                id="telefono" />
                        </div>
                    </div>

                    <div className="col-md-6  d-flex flex-column">
                        <div className="mb-3">
                            <label htmlFor="pueblo"
                                className="form-label">Localidad</label>
                            <input type="text"
                                className="form-control"
                                placeholder="¿Cuál es tu ciudad / pueblo?"
                                onChange={changePueblo}
                                value={insertarPoblacion}
                                id="pueblo"
                            />
                            {sugerencias.length > 0 && (
                                <ul className="list-group">
                                    {sugerencias.map((localidad, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item"
                                            onClick={() => editarPoblacion(localidad)}
                                        >
                                            {localidad.descripcion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="provincia" className="form-label fs-5">Provincia</label>
                            <input className="form-control" disabled id="provincia" value={provincia}>
                            </input>

                        </div>

                        <div className="mb-3">
                            <label htmlFor="direccion"
                                className="form-label">Dirección</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Aquí va tu dirección. Cuanto más completa, mejor!"
                                onChange={(e) => setDireccion(e.target.value)}
                                value={direccion}
                                id="direccion" />
                        </div>

                        <div className="d-flex justify-content-center mt-5">
                            {hasChanges ? (
                                <button type="submit" className="btn btn-outline-light" >Guardar datos</button>
                            ) : (
                                <button type="submit" className="btn btn-outline-light" disabled >Guardar datos</button>

                            )}
                        </div>
                    </div>

                </div>

            </form>

            {/* //Formulario para cambiar la contraseña */}
            {/* <form onSubmit={handleClickCambioPw}>
                <p className="mb-4">Aquí podrás cambiar tu contraseña</p>
                <div className="row">
                    <div className="col">
                        <div class="mb-3">
                            <label htmlFor="actualpassword" class="form-label">Escribe aquí tu contraseña actual:</label>
                            <input type="password"
                                class="form-control"
                                id="actualpassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={verifPassActual}
                            />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>

                        <div class="mb-3">
                            <label htmlFor="nuevapassword" class="form-label">Introduce tu nueva contraseña:</label>
                            <input type="password"
                                class="form-control"
                                id="nuevapassword"
                                onChange={handleChangeNPassword}
                                value={nuevaPassword}
                                required disabled={!esValida}
                            />
                        </div>
                        <div class="mb-3">
                            <label htmlFor="confnuevapassword" class="form-label">Confirma tu nueva contraseña:</label>
                            <input type="password"
                                class="form-control"
                                id="confnuevapassword"
                                onChange={handleChangeCNPassword}
                                value={confNuevaPassword}
                                required disabled={!esValida}
                                onBlur={verificarnuevaPw}
                            />
                            {errorValidnuevapw && <p style={{ color: 'red' }}>{errorValidnuevapw}</p>}
                        </div>
                    </div>
                    <div className="col">
                        <div className="align-content-center d-flex justify-content-start">

                            {validarPasswordNueva ? (
                                <button type="submit" className="btn btn-outline-light" >Cambiar contraseña</button>
                            ) : (
                                <button type="submit" className="btn btn-outline-light " disabled >Cambiar contraseña</button>

                            )}
                        </div>

                    </div>
                </div>

            </form> */}
        </div>
    );
};