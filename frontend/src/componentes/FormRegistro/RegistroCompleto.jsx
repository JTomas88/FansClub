import React, { useContext, useEffect, useState } from "react";
import styles from "./registrocompleto.module.css"
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/AppContext";
import logo from "../../assets/-Pendientes-/logo.png"

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
    const [token, setToken] = useState("")
    const [sugerencias, setSugerencias] = useState([])
    const [datoUsuario, setDatoUsuario] = useState('')



    const [error, setError] = useState(null)
    const [errorValidnuevapw, setErrorvalidnuevapw] = useState('')
    const [msjOK, setMsjOK] = useState(null)

    const [claseAlerta, setClaseAlerta] = useState("")



    useEffect(() => {
        if (datoUsuario.id) {
            actions.obtenerUsuarioPorId(datoUsuario.id)
            setEmail(datoUsuario.email)
        }
    }, [datoUsuario?.id, datoUsuario?.token]);


    useEffect(() => {
        setDatoUsuario(JSON.parse(localStorage.getItem('userData')))
    }, [store.userData])


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



    //Cargamos los datos del usuario si ya está registrado, si no se muestran los campos en blanco
    useEffect(() => {
        if (datoUsuario.id) {
            setToken(datoUsuario.token || "");
            setNombre(datoUsuario.nombre || '');
            setApellidos(datoUsuario.apellidos || '');
            setTelefono(datoUsuario.telefono || '');
            setEmail(datoUsuario.email || '');
            setPueblo(datoUsuario.pueblo)
            setProvincia(datoUsuario.provincia || '');
            setDireccion(datoUsuario.direccion || '');

            //seteamos los valores: si ya los tiene o si los tiene en blanco. 
            setDatosIniciales({
                token: datoUsuario.token || '',
                nombre: datoUsuario.nombre || '',
                apellidos: datoUsuario.apellidos || '',
                telefono: datoUsuario.telefono || '',
                email: datoUsuario.email || '',
                pueblo: datoUsuario.pueblo || '',
                provincia: datoUsuario.provincia || '',
                direccion: datoUsuario.direccion || ''
            });
        }
    }, [datoUsuario]);


    //Para manejar el estado del botón
    const hasChanges = (
        nombre !== datosIniciales.nombre ||
        apellidos !== datosIniciales.apellidos ||
        email !== datosIniciales.email ||
        telefono !== datosIniciales.telefono ||
        pueblo !== datosIniciales.pueblo ||
        provincia !== datosIniciales.provincia ||
        direccion !== datosIniciales.direccion
    );


    const editarDatos = async (evento) => {
        evento.preventDefault();

        if (!nombre || !apellidos || !email || !telefono || !pueblo || !provincia || !direccion) {
            setError("Por favor, completa todos los campos");
            return
        }

        if (datoUsuario.id && datoUsuario.token) {
            await actions.editar_usuario(datoUsuario.id, token, email, nombre, apellidos, telefono, pueblo, provincia, direccion)
            setMsjOK("Has actualizado tus datos!");
            setError(null)
            navigate('/')
        } else {
            console.error('No se ha encontrado al usuario')
        }
    };

    const editarPoblacion = (localidad) => {
        const poblacion = localidad.descripcion.split(",")[0].trim();
        setPueblo(poblacion)
        setProvincia(localidad.provincia)
        setSugerencias([])
    }

    //Variables para el cambio de contraseña//
    const [password, setPassword] = useState('') //password actual
    const [esValida, setEsValida] = useState(false);
    const [nuevaPassword, setNuevaPassword] = useState('')
    const [confNuevaPassword, setConfNuevaPassword] = useState('')
    const handleChangeNPassword = (e) => setNuevaPassword(e.target.value) //para introducir la 1ª vez la nueva contraseña
    const handleChangeCNPassword = (e) => setConfNuevaPassword(e.target.value) //para confirmar la nueva contraseña. 
    const [cambioOK, setCambioOK] = useState('')


    //Verificar contraseña actual: envía la contraseña actual al backend para comprobarla
    const verifPassActual = async () => {
        const isValid = await actions.verificarpwactual(datoUsuario.id, password, datoUsuario.email);
        setEsValida(isValid);
        if (!isValid) {
            setError('La contraseña actual no es correcta')
        } else {
            setError('')
        }
    }

    // Cambio de contraseña: para mostrar un botón u otro. 
    const validarPasswordNueva = (
        password !== datoUsuario.password &&
        nuevaPassword !== "" &&
        confNuevaPassword !== "" &&
        nuevaPassword === confNuevaPassword
    )

    const verificarnuevaPw = () => {
        if (nuevaPassword !== confNuevaPassword) {
            setErrorvalidnuevapw('La nueva contraseña no coincide')
        } else {
            setErrorvalidnuevapw('')
        }
    }


    //---CAMBIO DE CONTRASEÑA!!!!---
    const handleClickCambioPw = async (evento) => {
        evento.preventDefault();
        try {
            const respuesta = await actions.cambiopassword(datoUsuario.id, nuevaPassword)
            console.log(respuesta);

            if (respuesta) {
                setCambioOK('El cambio se ha realizado correctamente')
            } else {
                setError('NO se ha realizado')
            }


            await actions.obtenerUsuarioPorId()
            setPassword('')
            setNuevaPassword('');
            setConfNuevaPassword('');

        } catch (error) {
            console.error("Error al actualizar el password:", error)
        }
    }


    return (
        <div>
            <form onSubmit={editarDatos} className="mb-4">
                {error && <div className="alert alert-danger" role="alert">{error}</div>}

                <p>Aquí podrás completar tu perfil o editar los datos cuando lo necesites</p>
                <div className={styles.advertencia}>
                    <p style={{ backgroundColor: 'orange', display: 'flex', alignItems: 'center', padding: '1%', borderRadius: '10px' }}>
                        Todos los datos son requeridos para particpar en sorteos
                    </p>
                </div>
                <div className="row mt-4">
                    <div className="col-md-6">

                        <div className="mb-3">
                            <label htmlFor="nombre"
                                className="form-label text-white">Nombre</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Escribe aquí tu nombre"
                                onChange={(e) => setNombre(e.target.value)}
                                value={nombre}
                                id="nombre" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="apellidos"
                                className="form-label text-white">Apellidos</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Escribe aquí tus apellidos"
                                onChange={(e) => setApellidos(e.target.value)}
                                value={apellidos}
                                id="apellidos" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email"
                                className="form-label fs-5 text-white">Email</label>
                            <input type="email"
                                className="form-control"
                                disabled
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email" />

                        </div>
                        <div className="mb-3">
                            <label htmlFor="telefono"
                                className="form-label text-white">Teléfono</label>
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
                                className="form-label text-white">Localidad</label>
                            <input type="text"
                                className="form-control"
                                placeholder="¿Cuál es tu ciudad / pueblo?"
                                onChange={insertarPoblacion}
                                value={pueblo}
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
                            <label htmlFor="provincia" className="form-label fs-5 text-white">Provincia</label>
                            <input className="form-control" disabled id="provincia" value={provincia}>
                            </input>

                        </div>

                        <div className="mb-3">
                            <label htmlFor="direccion"
                                className="form-label text-white">Dirección</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Aquí va tu dirección. Cuanto más completa, mejor!"
                                onChange={(e) => setDireccion(e.target.value)}
                                value={direccion}
                                id="direccion" />
                        </div>

                        <div className="d-flex justify-content-center mt-5">
                            {hasChanges ? (
                                <button type="submit" className="btn botones" >Guardar datos</button>
                            ) : (
                                <button type="submit" className="btn btn-outline-light" disabled >Guardar datos</button>

                            )}
                        </div>
                    </div>

                </div>

            </form>

            <div className="d-flex justify-content-center align-items-center">
                <img src={logo} className={styles.logo}></img>
            </div>

            {/* //Formulario para cambiar la contraseña */}
            <form onSubmit={handleClickCambioPw}>
                <p className="mb-1">Aquí podrás cambiar tu contraseña</p>
                <div className="row">
                    <div className="col-6">
                        <div className="mb-3">
                            {/* Campo para introducir la contraseña actual */}
                            <label htmlFor="actualpassword" className="form-label text-white">Escribe aquí tu contraseña actual:</label>
                            <input type="password"
                                className="form-control"
                                id="actualpassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={verifPassActual}
                            />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>

                        {/* Campos para nueva contraseña y confirmación de nueva contraseña */}
                        <div className="mb-3">
                            <label htmlFor="nuevapassword" className="form-label text-white">Introduce tu nueva contraseña:</label>
                            <input type="password"
                                className="form-control"
                                id="nuevapassword"
                                onChange={handleChangeNPassword}
                                value={nuevaPassword}
                                required disabled={!esValida}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confnuevapassword" className="form-label text-white">Confirma tu nueva contraseña:</label>
                            <input type="password"
                                className="form-control"
                                id="confnuevapassword"
                                onChange={handleChangeCNPassword}
                                value={confNuevaPassword}
                                required disabled={!esValida}
                                onBlur={verificarnuevaPw}
                            />
                            {errorValidnuevapw && <p style={{ color: 'red' }}>{errorValidnuevapw}</p>}
                        </div>


                        <div className="align-content-center d-flex justify-content-center">

                            {validarPasswordNueva ? (
                                <button type="submit" className="btn btn-outline-light" >Cambiar contraseña</button>
                            ) : (
                                <button type="submit" className="btn btn-outline-light " disabled >Cambiar contraseña</button>

                            )}

                        </div>
                        {cambioOK && <p style={{ color: 'white', fontSize: '15px', textAlign: 'center' }}>{cambioOK}</p>}
                    </div>

                </div>

            </form>
        </div>
    );
};