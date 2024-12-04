import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import styles from "./gestionsorteos.module.css"



export const GestionSorteos = () => {
    const { store, actions } = useContext(Context);
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

    //Para obtener todas las entrevistas
    useEffect(() => {
        actions.obtenerSorteos();
    }, [])


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

    //Función para SUBIR FOTOS al input de imágenes en la entrevista
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
            setError("Error al guardar los datos de la entrevista")
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

    //Función para eliminar una entrevista por su id
    const eliminar_sorteo = async (idSorteo) => {

        try {
            const resultado = await actions.eliminarSorteo(idSorteo)
            console.log("Entrevista eliminada con éxito", resultado)
        } catch (error) {
            console.error("Error durante la eliminación de la entrevista:", error)
        }
    }




    return (
        <div className={styles.cuerpo_gestionSorteos}>
            {/* Sección para crear entrevistas */}
            <h2 className="text-center">Gestión de Sorteos</h2>
            <button className="btn btn-primary mb-5" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Crear nuevo SORTEO
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" style={{ color: "black" }} id="exampleModalLabel">Sorteo</h1>
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
                                    <input type="date" className="form-control" id="fechainicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fechafin" className="form-label">Fecha Fin</label>
                                    <input type="date" className="form-control" id="fechafin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fotos" className="form-label">Fotos</label>
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
                                    <button type="submit" className="btn btn-primary">Guardar datos</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección para mostrar entrevistas realizadas */}
            <h2>Sorteos realizados</h2>

            <div className="container d-flex m-3">
                {(Array.isArray(store.sorteos) ? store.sorteos : []).map((sorteo, index) => (
                    <div className="card" key={index} style={{ width: "18rem", backgroundColor: "PowderBlue" }}>
                        <div className="card-body">
                            <h3 className="card-title">{sorteo.sorNombre}</h3>
                            <h5 className="card-text mb-2">{sorteo.sorDescripcion}</h5>
                            <h6 className="card-text mb-2">{formatearFechaInicio(sorteo.sorFechaInicio)}</h6>
                            <h6 className="card-text mb-2">{formatearFechaFin(sorteo.sorFechaFin)}</h6>

                            {/* Abierto modal para editar el sorteo */}
                            <div >
                                <button className="btn btn-primary mb-5" data-bs-toggle="modal" data-bs-target="#editarEntrevista" onClick={() => abrirModalEditar(sorteo)}>
                                    <LuPencil />
                                </button>
                                <div className="modal fade" id="editarEntrevista" tabIndex="-1" aria-labelledby="editarEntrevistaLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="editarEntrevistaLabel">{nombreSorteo}</h1>
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
                                                        <input type="text" className="form-control" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="fechainicio" className="form-label">Fecha Inicio</label>
                                                        <input type="date" className="form-control" id="fechainicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="fechafin" className="form-label">Fecha Fin</label>
                                                        <input type="date" className="form-control" id="fechafin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
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
                            </div>

                            <div>

                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modaleliminarentrevista">
                                    <MdOutlineDelete />
                                </button>
                                <div className="modal fade" id="modaleliminarentrevista" tabIndex="-1" aria-labelledby="modaleliminarEntrevistaLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="modaleliminarEntrevistaLabel">Eliminar Entrevista</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                ¿Seguro que deseas eliminar esta entrevista?
                                            </div>
                                            <div className="modal-footer">

                                                <button type="button" data-bs-dismiss="modal" className="btn btn-primary" onClick={() => eliminar_sorteo(sorteo.sorId)}>Eliminar sorteo</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div >
    )
}