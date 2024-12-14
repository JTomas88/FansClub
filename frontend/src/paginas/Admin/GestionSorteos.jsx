import React, { useState, useContext, useEffect, useNavigate, useRef } from "react";
import { Context } from "../../store/AppContext";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import styles from "./gestionsorteos.module.css"



export const GestionSorteos = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [datoUsuario, setDatoUsuario] = useState({})
    const [nombreSorteo, setNombreSorteo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [imagen, setImagen] = useState('')
    const [resultado, setResultado] = useState('')
    const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState(null)
    const [miniaturas, setMiniaturas] = useState([]);
    const [sorteoSeleccionado, setSorteoSeleccionado] = useState('');
    const [error, setError] = useState('')
    const [sorteoAEliminar, setSorteoAEliminar] = useState('')
    const fileInputRef = useRef(null)
    const hoy = new Date().toISOString().split('T')[0];
    const [errorFecha, setErrorFecha] = useState('')
    const [ganador, setGanador] = useState('')
    const [filtro, setFiltro] = useState('activos')
    const [selectedItem, setSelectedItem] = useState(1);
    const [spinner, setSpinner] = useState(false)


    //Para obtener todos los sorteos
    useEffect(() => {
        actions.obtenerSorteos();
    }, [])

    //Para que no se pueda acceder con un perfil diferente al de 'admin//
    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
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


    // Función para manejar la selección de archivos
    const manejarArchivos = async (e) => {
        setImagenesSeleccionadas(e.target.files);
        const archivos = Array.from(e.target.files);
        if (archivos.length > 0) {
            const minifotos = archivos.map((file) => URL.createObjectURL(file))

            await subirFoto_entrevista(archivos)
            setMiniaturas(prev => [...prev, ...minifotos]);
        } else {
            console.error('No se se seleccionaron archivos')
        }

    };

    //Función para SUBIR FOTOS al input de imágenes en la sorteo
    const subirFoto_entrevista = async (archivos) => {
        const formData = new FormData();
        archivos.forEach(file => {
            formData.append('files', file);
        });
        const respuesta = await actions.admin_subirfoto_entrevista(formData)
        setImagen(prev => [...prev, ...respuesta.urls])
    }

    const eliminarImagen = async (index) => {
        try {
            const imagenAEliminar = miniaturas[index]
            const nuevasMiniaturas = miniaturas.filter((_, i) => i !== index);
            setMiniaturas(nuevasMiniaturas);

            const nuevasImagenes = imagen.filter(img => img !== imagenAEliminar);
            setImagen(nuevasImagenes)

            if (sorteoSeleccionado && sorteoSeleccionado.id) {
                const imagenesConcat = nuevasImagenes.join(",")
                await actions.editar_sorteo(
                );
            }
            console.log("imagen eliminada con éxito")
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
        }

    };

    //Función para añadir un sorteo nuevo
    const anadir_sorteo = async (evento, nombre, descripcion, fechaInicio, fechaFin, imagen) => {
        evento.preventDefault()
        try {
            const imagenesConcat = imagen.length > 0 ? imagen.join(",") : "";
            await actions.crear_sorteo(nombre, descripcion, fechaInicio, fechaFin, imagenesConcat)
            await actions.obtenerSorteos();
            const modalElement = document.querySelector('[data-bs-dismiss="modal"]');
            if (modalElement) {
                modalElement.click();
            }
            reseteoFormulario()

        } catch (error) {
            console.error("Error durante la llamada al servicio:", error);
            setError("Error al guardar los datos de la sorteo")
        }
    };

    //Función para editar el sorteo
    const editar_sorteo = async (evento) => {
        evento.preventDefault()

        if (!sorteoSeleccionado || !sorteoSeleccionado.sorId) {
            console.error("No hay sorteo seleccionada para editar");
            setError("No se pudo identificar el sorteo a editar.");
            return;
        }

        const fechaFormateadaInicio = new Date(fechaInicio).toISOString().split('T')[0]
        const fechaFormateadaFin = new Date(fechaFin).toISOString().split('T')[0]


        try {
            const imagenesConcat = imagen.length > 0 ? imagen.join(",") : "";
            await actions.editar_sorteo(
                sorteoSeleccionado.sorId,
                nombreSorteo,
                descripcion,
                fechaFormateadaInicio,
                fechaFormateadaFin,
                imagenesConcat
            );
            await actions.obtenerSorteos();
            reseteoFormulario()
            setSorteoSeleccionado('')

        } catch (error) {
            console.error("Error al editar el sorteo", error)
            setError("Error al actualizar el sorteo")
        }
    }

    //Para resetear el formulario
    const reseteoFormulario = () => {
        setNombreSorteo('');
        setDescripcion('');
        setFechaInicio('');
        setFechaFin('');
        setImagen("")
        setMiniaturas([])

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const formatearFechaInicio = (fecha) => {
        const fechaObj = new Date(fecha);
        const day = String(fechaObj.getDate()).padStart(2, '0')
        const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const year = fechaObj.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const formatearFechaFin = (fecha) => {
        const fechaObj = new Date(fecha);
        const day = String(fechaObj.getDate()).padStart(2, '0')
        const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const year = fechaObj.getFullYear();
        return `${day}/${month}/${year}`;
    }


    const abrirModalEditar = (sorteo) => {
        if (!sorteo) return;

        setSorteoSeleccionado(sorteo);

        // Formatear la fecha
        const fechaInicio = new Date(sorteo.sorFechaInicio);
        const fechaFormateadaInicio = fechaInicio.toISOString().split('T')[0];

        const fechaFin = new Date(sorteo.sorFechaFin);
        const fechaFormateadaFin = fechaFin.toISOString().split('T')[0];

        setFechaInicio(fechaFormateadaInicio);
        setFechaFin(fechaFormateadaFin)
        setNombreSorteo(sorteo.sorNombre);
        setDescripcion(sorteo.sorDescripcion);

        const imagenesArray = sorteo.sorImagen ? sorteo.sorImagen.split(",") : [];
        setMiniaturas(imagenesArray);
        setImagen(imagenesArray);
    };

    //Función para eliminar una sorteo por su id
    const eliminar_sorteo = async (idSorteo) => {

        try {
            await actions.eliminarSorteo(idSorteo)
            await actions.obtenerSorteos()
        } catch (error) {
            console.error("Error durante la eliminación del sorteo:", error)
        }
    }

    const onChangeFechaInicio = (evento) => {
        const nuevaFecha = evento.target.value;
        setFechaInicio(nuevaFecha); // Actualizamos el estado con lo que el usuario escribe
        setErrorFecha(''); // Limpiamos el error si el usuario está escribiendo
    };

    const onBlurFechaInicio = () => {
        // Comprobamos si la fecha tiene el formato correcto
        if (fechaInicio.length === 10) {
            const hoy = new Date().toISOString().split('T')[0]; // Fecha actual en formato yyyy-mm-dd
            if (fechaInicio < hoy) {
                setErrorFecha('La fecha de inicio no puede ser menor que hoy');
            } else {
                setErrorFecha(''); // Limpiamos cualquier error si la fecha es válida
            }
        } else {
            setErrorFecha('Por favor, ingresa una fecha válida en formato yyyy-mm-dd');
        }
    };


    const onChangeFechaFin = (evento) => {
        const nuevaFecha = evento.target.value;
        setFechaFin(nuevaFecha); // Actualizamos el estado con lo que el usuario escribe
        setErrorFecha(''); // Limpiamos el error si el usuario está escribiendo
    };

    const onBlurFechaFin = () => {
        // Comprobamos si la fecha tiene el formato correcto
        if (fechaFin.length === 10) {
            const hoy = new Date().toISOString().split('T')[0]; // Fecha actual en formato yyyy-mm-dd
            if (fechaFin < hoy) {
                setErrorFecha('La fecha de inicio no puede ser menor que hoy');
            } else {
                setErrorFecha(''); // Limpiamos cualquier error si la fecha es válida
            }
        } else {
            setErrorFecha('Por favor, ingresa una fecha válida en formato yyyy-mm-dd');
        }
    };

    const sortear = async (idSorteo) => {
        const sorteosActualizados = store.sorteos;
        const sorteoSeleccionado = sorteosActualizados.find((sorteo) => sorteo.sorId === idSorteo);
        if (!sorteoSeleccionado || !sorteoSeleccionado.participantes || sorteoSeleccionado.participantes.length === 0) {
            alert('No hay participantes en este sorteo, o el sorteo no existe')
            return
        }
        const ganadorIndex = Math.floor(Math.random() * sorteoSeleccionado.participantes.length);
        const ganadorId = sorteoSeleccionado.participantes[ganadorIndex];
        const datosGanador = await actions.obtenerUsuarioPorId(ganadorId)
        console.log('Datos Ganador: ', datosGanador);
        if (datosGanador) {
            setGanador(datosGanador);
            await anadir_resultado(idSorteo, datosGanador.id)
            await actions.obtenerSorteos()
        }
    }

    // Función para añadir resultado (componente, flux y backend) - pasarle id del sorteo e id ganador
    const anadir_resultado = async (idSorteo, ganador) => {
        try {
            await actions.anadirResultado(idSorteo, ganador);
        } catch (error) {
            console.error('Error al anadir el resultado')
        }
    }


    const buscarSorteo = async (idSorteo) => {
        try {
            const datosSorteo = await actions.obtenerSorteoPorId(idSorteo)
            const datosGanador = await actions.obtenerUsuarioPorId(datosSorteo.resultado)
            await actions.obtenerSorteos()
            setGanador(datosGanador)
        } catch (error) {
            console.error('Error')
        }
    }

    const clasificarSorteos = (sorteos) => {
        try {
            const hoy = new Date();
            const proximos = sorteos.filter(sorteo => new Date(sorteo.sorFechaInicio) > hoy)
            const activos = sorteos.filter(sorteo => new Date(sorteo.sorFechaInicio) <= hoy && new Date(sorteo.sorFechaFin) >= hoy)
            console.log('Sorteos activos: ', activos)
            const pasados = sorteos.filter(sorteo => new Date(sorteo.sorFechaFin) < hoy)

            switch (filtro) {
                case 'proximos':
                    return proximos;
                case 'activos':
                    return activos;
                case 'pasados':
                    return pasados;
                case 'todos':
                    return store.sorteos
                default:
                    return activos;
            }
        } catch (error) {
            return []
        }

    }




    const handleDotClick = (index) => {
        setSelectedItem(selectedItem === index ? null : index);
    };





    return (
        <div className={styles.cuerpo_gestionSorteos}>
            {/* Sección para crear sorteos */}
            <h2 className="text-center">Gestión de Sorteos</h2>
            <button className="btn btn-primary m-2" data-bs-toggle="modal" data-bs-target="#crearSorteo">
                Crear nuevo SORTEO
            </button>
            <div className="modal fade" id="crearSorteo" tabIndex="-1" aria-labelledby="crearSorteoLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" style={{ color: "black" }} id="crearSorteoLabel">Sorteo</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        {/* Modal */}
                        <div className="modal-body">
                            <form onSubmit={(evento) => anadir_sorteo(evento, nombreSorteo, descripcion, fechaInicio, fechaFin, imagen)}>

                                <div className="mb-3" style={{ color: "black" }}>
                                    <label htmlFor="nombresorteo" className="form-label" >Nombre Sorteo</label>
                                    <input type="text" className="form-control" id="nombresorteo" aria-describedby="nombresorteo" value={nombreSorteo} onChange={(e) => setNombreSorteo(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label">Descripcion</label>
                                    <textarea type="text" className="form-control" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="fechainicio" className="form-label">Fecha Inicio</label>
                                    <input type="date" className="form-control" id="fechainicio" value={fechaInicio} min={hoy} onChange={onChangeFechaInicio} onBlur={onBlurFechaInicio} />
                                    {errorFecha && <div className="alert alert-danger" role="alert">{errorFecha}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fechafin" className="form-label">Fecha Fin</label>
                                    <input type="date" className="form-control" id="fechafin" value={fechaFin} min={hoy} onChange={onChangeFechaFin} onBlur={onBlurFechaFin} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fotos" className="form-label">Fotos</label>
                                    <input className="form-control" type="file" id="fotos" multiple onChange={manejarArchivos} ref={fileInputRef} />
                                </div>
                                <div className="mb-3 d-flex flex-wrap">
                                    {miniaturas.map((url, index) => (
                                        <div key={index} style={{ position: 'relative', margin: '5px' }}>
                                            <img
                                                src={url}
                                                alt={`miniatura-${index}`}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                            <div className={styles.div_boton_flotante}>
                                                <button
                                                    className={styles.boton_flotante}
                                                    onClick={() => eliminarImagen(index)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" >Guardar datos</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección para mostrar sorteos realizados*/}
            <div className="container-fluid">
                <h2>Sorteos realizados</h2>
                <div className="d-flex mb-4">
                    <button className={`btn m-2 ${selectedItem === 0 ? 'btn-success' : 'btn-secondary'}`} onClick={() => { setFiltro('pasados'); handleDotClick(0) }}>
                        Sorteos pasados
                    </button>

                    <button className={`btn m-2 ${selectedItem === 1 ? 'btn-success' : 'btn-secondary'}`} onClick={() => { setFiltro('activos'); handleDotClick(1) }}>
                        SORTEOS ACTIVOS
                    </button>

                    <button className={`btn m-2 ${selectedItem === 2 ? 'btn-success' : 'btn-secondary'}`} onClick={() => { setFiltro('proximos'); handleDotClick(2) }}>
                        Proximos sorteos
                    </button>

                    <button className={`btn m-2 ${selectedItem === 3 ? 'btn-success' : 'btn-secondary'}`} onClick={() => { setFiltro('todos'); handleDotClick(3) }}>
                        Todos los sorteos
                    </button>

                </div>

                {spinner ? (
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    <div className="container d-flex m-3 flex-wrap">
                        {(Array.isArray(clasificarSorteos(store.sorteos)) ? clasificarSorteos(store.sorteos) : []).map((sorteo, index) => (
                            <div className="card mb-4 me-4" key={index} style={{ width: "18rem", backgroundColor: "PowderBlue" }}>
                                <div className="card-body">
                                    <h3 className="card-title">{sorteo.sorNombre}</h3>
                                    <h6 className="card-text mb-2">{formatearFechaInicio(sorteo.sorFechaInicio)}</h6>
                                    <h6 className="card-text mb-2">{formatearFechaFin(sorteo.sorFechaFin)}</h6>

                                    {/* Abierto modal para editar el sorteo */}
                                    <div>
                                        <button className={`btn btn-primary p-2 ${styles.espacio_botones}`} data-bs-toggle="modal" data-bs-target="#editarSorteo" onClick={() => abrirModalEditar(sorteo)}>
                                            <LuPencil />
                                        </button>
                                        <div className="modal fade" id="editarSorteo" tabIndex="-1" aria-labelledby="editarSorteoLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="editarSorteoLabel">{nombreSorteo}</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">

                                                        <form >
                                                            <div className="mb-3" style={{ color: "black" }}>
                                                                <label htmlFor="nombreSorteo" className="form-label" >Nombre sorteo</label>
                                                                <input type="text" className="form-control" id="fecnombreSorteoha" aria-describedby="nombreSorteo" value={nombreSorteo} onChange={(e) => setNombreSorteo(e.target.value)} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="descripcion" className="form-label">Descripcion</label>
                                                                <textarea type="text" className="form-control" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={8} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="fechainicio" className="form-label">Fecha Inicio</label>
                                                                <input type="date" className="form-control" id="fechainicio" value={fechaInicio} min={hoy} onChange={onChangeFechaInicio} onBlur={onBlurFechaInicio} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="fechafin" className="form-label">Fecha Fin</label>
                                                                <input type="date" className="form-control" id="fechafin" value={fechaFin} min={hoy} onChange={onChangeFechaFin} onBlur={onBlurFechaFin} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="fotos" className="form-label">Imagenes sorteo</label>
                                                                <input className="form-control" type="file" id="fotos" multiple onChange={manejarArchivos} />
                                                            </div>
                                                            <div className="mb-3 d-flex flex-wrap">
                                                                {miniaturas.map((url, index) => (
                                                                    <div key={index} style={{ position: 'relative', margin: '5px' }}>
                                                                        <img
                                                                            src={url}
                                                                            alt={`miniatura-${index}`}
                                                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                                        />
                                                                        <div className={styles.div_boton_flotante}>
                                                                            <button
                                                                                className={styles.boton_flotante}
                                                                                onClick={() => eliminarImagen(index)}
                                                                            >
                                                                                X
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-primary" onClick={(evento) => editar_sorteo(evento, nombreSorteo, descripcion, fechaInicio, fechaFin, imagen)} data-bs-dismiss="modal" >Guardar datos</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Para eliminar un sorteo */}
                                        <button className="btn btn-primary p-2" data-bs-toggle="modal" data-bs-target="#modaleliminarSorteo" onClick={() => setSorteoAEliminar(sorteo.sorId)}>
                                            <MdOutlineDelete />
                                        </button>
                                        <div className="modal fade" id="modaleliminarSorteo" tabIndex="-1" aria-labelledby="modaleliminarSorteoLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="modaleliminarSorteoLabel">Eliminar sorteo</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        ¿Seguro que deseas eliminar este sorteo?
                                                    </div>
                                                    <div className="modal-footer">

                                                        <button type="button" data-bs-dismiss="modal" className="btn btn-primary" onClick={() => eliminar_sorteo(sorteoAEliminar)}>Eliminar sorteo</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        {!sorteo.sorResultado && <button type="button " className="btn btn-danger" onClick={() => sortear(sorteo.sorId)}>Realizar sorteo</button>
                                        }
                                    </div>
                                    <div className="row mt-4">
                                        {sorteo.sorResultado && <button type="button" onClick={() => buscarSorteo(sorteo.sorId)} className="btn btn-success" data-bs-toggle="modal" data-bs-target="#datosGanador" >Ver ganador</button>
                                        }
                                    </div>


                                </div>
                            </div>
                        ))}

                        {/*  Modal para mostrar datos del ganador */}
                        <div class="modal fade" id="datosGanador" tabindex="-1" aria-labelledby="datosGanadorLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="datosGanadorLabel">Datos ganador sorteo</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Nombre: {ganador.nombre}</p>
                                        <p>Apellidos: {ganador.apellidos}</p>
                                        <p>Email: {ganador.email}</p>
                                        <p>Teléfono: {ganador.telefono}</p>
                                        <p>Población: {ganador.pueblo}</p>
                                        <p>Provincia: {ganador.provincia}</p>
                                        <p>Dirección: {ganador.direccion}</p>

                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>


        </div >
    )
}