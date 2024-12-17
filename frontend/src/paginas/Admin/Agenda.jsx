import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Admin/agenda.module.css";
import { Context } from "../../store/AppContext";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { IoIosSave } from "react-icons/io";


export const Agenda = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [datoUsuario, setDatoUsuario] = useState({})
    const [fecha, setFecha] = useState('')
    const [poblacion, setPoblacion] = useState('')
    const [provincia, setProvincia] = useState('')
    const [lugar, setLugar] = useState('')
    const [hora, setHora] = useState('')
    const [entradas, setEntradas] = useState('')
    const [observaciones, setObservaciones] = useState('')
    const [error, setError] = useState('')
    const [inputValue, setInputValue] = useState('');
    const [sugerencias, setSugerencias] = useState([]);
    const [idEditFila, setIdEditFila] = useState(null); //Almacena el Id de la fila que se está editando(
    const [filaEditada, setFilaEditada] = useState({}); // Almacenda los datos editados temporalmente.
    const [eventoAEliminar, setEventoAEliminar] = useState('')



    //Obtenemos todos los eventos al cargar la página
    useEffect(() => {
        actions.admin_obtenereventos();
        console.log(store.eventos);
    }, [])

    //Para que no se pueda acceder con un perfil diferente al de 'admin//
    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem('loginData'));
            if (!userData || !userData.token || !userData.email || userData.rol !== 'admin') {
                navigate('/home');
            } else {
                setDatoUsuario(userData);
            }
        } catch (error) {
            console.error('Error al obtener datos de localStorage:', error);
            navigate('/home');
        }
    }, []);


    /**PARA EDITAR CUALQUIER CAMPO DEL EVENTO
     * manejo del click del botón de editar
     * 
     * @param {setIdEditFila} Recoge el id del objeto seleccionado, en este caso el id de la fila. 
     *                        Se utiliza en el html, dentro del if, para pasar al modo edición.
     * @param {setFilaEditada} Agrega a la variable filaEditada los datos que recibe del obj 
     */
    const handleEditClick = (row) => {
        setIdEditFila(row.evId);
        setFilaEditada(row)
    }


    /**PARA EDITAR CUALQUIER DATO DEL EVENTO, SIN QUE SE PIERDA EL RESTO DE DATOS.
     * Recibe un evento (e).
     * Crea un objeto con name y value y le pasa lo que tenga el target. 
     * setFilaEditada crea una variable (datosYaguardados, lo que tenía antes de modificarlo), crea una copia
     * y le pasa lo que tenga value a name. (pasa lo que hayamos escrito a ese campo concreto)
     * @param {e} e 
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (idEditFila !== null) {
            setFilaEditada((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    /**GUARDA LOS CAMBIOS QUE YA HEMOS EDITADO. 
     * Crea fechaFormateada: en el campo fecha lo pasa formato a string y se queda con la fecha a secas
     * crea eventoParaGuardar: crea otra copia de filaEditada, y le pasa la fecha formateada al campo fecha en concreto
     */
    const handleClickGuardar = async () => {
        // Verifica si la fecha es válida
        const fechaObj = new Date(filaEditada.evFecha);

        const fechaFormateada = fechaObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        const eventoParaGuardar = {
            ...filaEditada,
            evFecha: fechaFormateada,
        }
        try {
            await actions.admin_editarevento(eventoParaGuardar, filaEditada.evId);
            setIdEditFila(null); // Finaliza la edición
            actions.admin_obtenereventos();
        } catch (error) {
            console.error('Error al guardar el evento:', error);
            setError('Hubo un problema al guardar el evento');
        }
    };


    const changeFecha = (evento) => {
        const fechaSelecc = evento.target.value;
        setFecha(fechaSelecc);
    }

    const changeLugar = (evento) => {
        const lugarSelecc = evento.target.value;
        setLugar(lugarSelecc)
    }

    const changeHora = (evento) => {
        const horaSelecc = evento.target.value;
        setHora(horaSelecc)
    }

    const changeEntradas = (evento) => {
        const entradasSelecc = evento.target.value;
        setEntradas(entradasSelecc)
    }

    const changeObservaciones = (evento) => {
        const eobservacionesSelecc = evento.target.value;
        setObservaciones(eobservacionesSelecc)
    }

    const reseteoFormulario = () => {
        setFecha('');
        setPoblacion('');
        setProvincia('');
        setLugar('');
        setHora('');
        setEntradas('');
        setObservaciones('');
        setError('');
        setSugerencias([])
    }

    // ----- PARA EDITAR EL INPUT DE LA POBLACIÓN- //
    /**
     * Crea un objeto con name y value y le pasa el contenido del target. 
     * setFilaEditada: crea una variable (prev), crea una copia para mantener los datos y le pasa
     * el value al campo correspondiente (name).
     * Si ese campo name es el de "población" y la longitud de lo que recibe es mayor que 2, 
     * entonces llama a la función de buscarlocalidad y le pasa el value y recibe la respuesta de
     * lo anterior se lo pasa a datos. Pasa a "sugerencias" el contenido de los datos recibidos.
     * @param {*} e 
     */
    const manejarCambio = async (e) => {
        const { name, value } = e.target;

        setFilaEditada((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (value.length > 2) {
            try {
                const respuesta = await actions.buscarlocalidad(value);
                const datos = await respuesta.json();
                setSugerencias(datos);
            } catch (error) {
                console.error("Error al buscar localidades:", error);
            }
        } else {
            setSugerencias([])
        }
    };


    // ----- PARA CREAR NUEVO EVENTO - afecta solo al campo "población" //
    /**
     * Crea una variable "valor" y le pasa lo que tenga el target. 
     * A población le pasa ese valor que haya recibido. 
     * Si la longitud del valor es 0 entonces la variable provincia se queda en blanco.
     * Si la longitud es mayot que 2 entonces, llama a buscar localidad  y le pasa el value y recibe la respuesta de
       * lo anterior se lo pasa a datos. Pasa a "sugerencias" el contenido de los datos recibidos.
     * 
     */
    const nuevoEvento = async (e) => {
        const valor = e.target.value;
        setPoblacion(valor);

        if (valor.length === 0) {
            setProvincia('')
        }
        if (valor.length > 2) {
            try {

                const respuesta = await actions.buscarlocalidad(valor);
                const datos = await respuesta.json();
                setSugerencias(datos);
            } catch (error) {
                console.error('Error al buscar localidades:', error);
            }
        } else {
            setSugerencias([]);
        }
    };


    // CUANDO CREAMOS UN EVENTO-- PARA DESCOMPONER LA INFORMACIÓN QUE LLEGA DEL BACKEND DEL CAMPO LOCALIDAD Y LA PROVINCIA //
    //REcoge lo que hay en la variable localidad y la descripcion la guarda en la variable "Población"
    //La variable población tiene mucha información, entonces la separaamos solo para quedarnos con el nombre de la población
    // y hace lo mismo con la provincia. 
    //Finalmente limpia las sugerencias.
    const nuevoevento_controlPoblacion = (localidad) => {
        const soloPoblacion = localidad.descripcion.split(",")[0].trim(); // Obtiene solo la primera parte y quita espacios

        setPoblacion(soloPoblacion); // Coloca la localidad seleccionada en el input
        setProvincia(localidad.provincia)
        setSugerencias([]); // Limpiar las sugerencias una vez seleccionada
    };


    // CUANDO EDITAMOS UN EVENTO-- PARA DESCOMPONER LA INFORMACIÓN QUE LLEGA DEL BACKEND DEL CAMPO LOCALIDAD Y LA PROVINCIA //
    /**
     * Crea una variable "soloPoblacion" para quedarse sólamente con el nombre de la localidad. 
     * setFilaEditada crea prev, hace una copia de lo que tenga. 
     * Le pasamos a población el contenido de "soloPoblacion", y a provincia le pasamos lo que tenga
     * localidad.provincia. 
     */
    const editarevento_controlPoblacion = (localidad) => {
        const soloPoblacion = localidad.descripcion.split(",")[0].trim();

        setFilaEditada((prev) => ({
            ...prev,
            evPoblacion: soloPoblacion,
            evProvincia: localidad.provincia
        }));
        setProvincia(localidad.provincia)
        setSugerencias([])

    };


    //Función para crear un evento nuevo
    const anadir_evento = async (evento, fecha, poblacion, provincia, lugar, hora, entradas, observaciones) => {
        evento.preventDefault()
        try {
            await actions.admin_crearevento(fecha, poblacion, provincia, lugar, hora, entradas, observaciones)
            await actions.admin_obtenereventos()

            const modalElement = document.querySelector('[data-bs-dismiss="modal"]');
            if (modalElement) {
                modalElement.click();
            }

            reseteoFormulario()

        } catch (error) {
            console.error("Error durante la llamada al servicio:", error);
            setError("Error al guardar los datos del evento")
        }
    };

    //Función para eliminar un evento. 
    const eliminar_evento = async (idEvento) => {

        try {
            const resultado = await actions.admin_eliminarevento(idEvento)
            console.log("Evento eliminado con exito", resultado)
            actions.admin_obtenereventos()

        } catch (error) {
            console.error("Error durante la eliminación del evento:", error)
        }
    }




    return (

        <div className="container-fluid">
            <div>
                {/* <!-- Button trigger modal --> */}
                <button type="button" className="btn btn-primary mt-3 mb-3" data-bs-toggle="modal" data-bs-target="#modalcrearEvento">
                    Añadir Evento
                </button>
            </div>

            {/* <!-- Modal --> */}
            <div className={`modal fade ${styles.form}`} id="modalcrearEvento" tabIndex="-1" aria-labelledby="modalcrearEventoLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Evento</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <form className={`${styles.form}`} onSubmit={(evento) => anadir_evento(evento, fecha, poblacion, provincia, lugar, hora, entradas, observaciones)}>

                                <div className="mb-3">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input type="date" className="form-control" id="fecha" aria-describedby="emailHelp" onChange={changeFecha} value={fecha}
                                    />
                                </div>

                                <div className="mb-3">
                                    <div>
                                        <label htmlFor="localidad" className="form-label">Localidad</label>
                                        <input
                                            type="text"
                                            value={poblacion}
                                            onChange={nuevoEvento}
                                            placeholder="Escribe una localidad..."
                                            className="form-control"
                                        />
                                        {sugerencias.length > 0 && (
                                            <ul className="list-group">
                                                {sugerencias.map((localidad, index) => (
                                                    <li key={index}
                                                        className="list-group-item" style={{ color: "black" }}
                                                        onClick={() => nuevoevento_controlPoblacion(localidad)}>
                                                        {localidad.descripcion}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="provincia" className="form-label">Provincia</label>
                                    <input className="form-control" disabled id="provincia" value={provincia}>
                                    </input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lugar" className="form-label">Lugar</label>
                                    <input type="text" className="form-control" id="lugar" onChange={changeLugar} value={lugar} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hora" className="form-label">Hora</label>
                                    <input type="text" className="form-control" id="hora" onChange={changeHora} value={hora} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="entradas" className="form-label">Venta de entradas</label>
                                    <input type="text" className="form-control" id="entradas" onChange={changeEntradas} value={entradas} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                                    <textarea type="text" className="form-control" id="observaciones" onChange={changeObservaciones} value={observaciones} />
                                </div>
                                <div className="modal-footer d-flex justify-content-center">
                                    <button type="submit" data-bs-dismiss="modal" className="btn btn-primary">Guardar Evento</button>
                                </div>

                            </form>

                        </div>

                    </div>
                </div>
            </div>



            <div className={styles.tabla}>
                <h2>Tabla de Conciertos y Agenda</h2>
                <table className="table table bordered">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Población</th>
                            <th>Provincia</th>
                            <th>Lugar</th>
                            <th>Hora</th>
                            <th>Venta de entradas</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(store.eventos) ? store.eventos : []).map((evento, index) => (
                            <tr key={index} className={styles.tableRow}>
                                <td>
                                    {idEditFila === evento.evId ? (
                                        <input type="date"
                                            name="evFecha"
                                            value={filaEditada.evFecha || ""}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        evento.evFecha
                                    )}
                                </td>

                                <td>
                                    {idEditFila === evento.evId ? (
                                        <>
                                            <input
                                                type="text"
                                                name="evPoblacion"
                                                value={filaEditada.evPoblacion || ""}
                                                onChange={manejarCambio}
                                                placeholder="Escribe una localidad..."
                                                className="form-control"
                                            />
                                            {sugerencias.length > 0 && (
                                                <ul className="list-group">
                                                    {sugerencias.map((localidad, index) => (
                                                        <li
                                                            key={index}
                                                            className="list-group-item"
                                                            onClick={() => editarevento_controlPoblacion(localidad)}
                                                        >
                                                            {localidad.descripcion}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        evento.evPoblacion
                                    )}
                                </td>

                                {/* se cambia automaticamente */}
                                <td>{evento.evProvincia}</td>

                                <td>
                                    {idEditFila === evento.evId ? (
                                        <input type="text"
                                            name="evLugar"
                                            value={filaEditada.evLugar || ""}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        evento.evLugar
                                    )}
                                </td>

                                <td>
                                    {idEditFila === evento.evId ? (
                                        <input type="text"
                                            style={{ width: "90px" }}
                                            name="evHora"
                                            value={filaEditada.evHora || ""}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        evento.evHora
                                    )}
                                </td>

                                <td>
                                    {idEditFila === evento.evId ? (
                                        <input type="text"
                                            step={{ width: "120px" }}
                                            name="evEntradas"
                                            value={filaEditada.evEntradas || ""}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        evento.evEntradas
                                    )}
                                </td>

                                <td>
                                    {idEditFila === evento.evId ? (
                                        <input type="text"
                                            name="evObservaciones"
                                            value={filaEditada.evObservaciones || ""}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        evento.evObservaciones
                                    )}
                                </td>

                                {/* Botnes para editar o eliminar */}
                                <td >
                                    {idEditFila === evento.evId ? (
                                        <button onClick={handleClickGuardar} className="me-3">
                                            <IoIosSave />
                                        </button>
                                    ) : (

                                        <button onClick={() => handleEditClick(evento)} className="me-3">
                                            <LuPencil />
                                        </button>
                                    )}



                                    {/* //Botón eliminar y modal para confirmar eliminación */}
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modaleliminarevento" onClick={() => setEventoAEliminar(evento.evId)}>
                                        <MdOutlineDelete />
                                    </button>
                                    <div className="modal fade" id="modaleliminarevento" tabIndex="-1" aria-labelledby="modaleliminareventoLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="modaleliminareventoLabel">Eliminar Evento</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    ¿Seguro que deseas eliminar este evento?
                                                </div>
                                                <div className="modal-footer">

                                                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary" onClick={(ev) => eliminar_evento(eventoAEliminar)}>Eliminar</button>
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
    )
}