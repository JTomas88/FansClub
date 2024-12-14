import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/AppContext";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import styles from "./gestionentrevistas.module.css"

export const GestionEntrevistas = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [datoUsuario, setDatoUsuario] = useState({})
    const [fecha, setFecha] = useState('');
    const [titular, setTitular] = useState('')
    const [subtitulo, setSubtitulo] = useState('')
    const [cuerpo, setCuerpo] = useState('')
    const [imagen, setImagen] = useState([])
    const [entrevistaSeleccionada, setEntrevistaSeleccionada] = useState('');
    const [error, setError] = useState('')
    const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState(null)
    const [entrevistaAEliminar, setEntrevistaAEliminar] = useState('');
    const [miniaturas, setMiniaturas] = useState([]);
    const fileInputRef = useRef(null)

    const handleFotoChange = (evento) => {
        setImagen(Array.from(evento.target.files));;
    }


    //Para obtener todas las entrevistas
    useEffect(() => {
        actions.obtenerEntrevistas();
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


    //Para resetear el formulario
    const reseteoFormulario = () => {
        setFecha('');
        setTitular('');
        setSubtitulo('');
        setCuerpo('');
        setImagen([])
        setMiniaturas([])

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }


    //Función para añadir una entrevista nueva
    const anadir_entrevista = async (evento, fecha, titular, subtitulo, cuerpo, imagen) => {
        evento.preventDefault()
        reseteoFormulario()
        try {
            const imagenesConcat = imagen.length > 0 ? imagen.join(",") : "";
            await actions.admin_crearentrevista(fecha, titular, subtitulo, cuerpo, imagenesConcat)
            await actions.obtenerEntrevistas();
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

    //Función para editar la entrevista
    const editar_entrevista = async (evento) => {
        evento.preventDefault()

        if (!entrevistaSeleccionada || !entrevistaSeleccionada.entId) {
            console.error("No hay entrevista seleccionada para editar");
            setError("No se pudo identificar la entrevista a editar.");
            return;
        }

        const fechaFormateada = new Date(fecha).toISOString().split('T')[0]

        try {
            const imagenesConcat = imagen.length > 0 ? imagen.join(",") : "";
            await actions.editarEntrevista(
                entrevistaSeleccionada.entId,
                fechaFormateada,
                titular,
                subtitulo,
                cuerpo,
                imagenesConcat
            );
            await actions.obtenerEntrevistas();
            reseteoFormulario()
            setEntrevistaSeleccionada('')

        } catch (error) {
            console.error("Error al editar la entrevista", error)
            setError("Error al actualizar la entrevista")
        }
    }

    //Función para eliminar una entrevista por su id
    const eliminar_entrevista = async (idEntrevista) => {

        try {
            const resultado = await actions.eliminarEntrevista(idEntrevista)
            console.log("Entrevista eliminada con éxito", resultado)
            actions.obtenerEntrevistas()
        } catch (error) {
            console.error("Error durante la eliminación de la entrevista:", error)
        }
    }

    const eliminarImagen = async (evento, index) => {
        evento.preventDefault()
        console.log('evento: ', evento)
        // evento.stopPropagation()
        try {
            const imagenAEliminar = miniaturas[index]
            const nuevasMiniaturas = miniaturas.filter((_, i) => i !== index);
            setMiniaturas(nuevasMiniaturas);

            const nuevasImagenes = imagen.filter(img => img !== imagenAEliminar);
            setImagen(nuevasImagenes)

            if (entrevistaSeleccionada && entrevistaSeleccionada.entId) {
                const imagenesConcat = nuevasImagenes.join(",")
                actions.editarEntrevista(
                    entrevistaSeleccionada.id,
                    fecha,
                    titular,
                    subtitulo,
                    cuerpo,
                    imagenesConcat
                );
            }
            console.log("imagen eliminada con éxito")
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
        }

    };


    const abrirModalEditar = (entrevista) => {
        if (!entrevista) return;

        setEntrevistaSeleccionada(entrevista);

        // Formatear la fecha
        const fechaObj = new Date(entrevista.entFecha);
        const fechaFormateada = fechaObj.toISOString().split('T')[0];

        setFecha(fechaFormateada);
        setTitular(entrevista.entTitular);
        setSubtitulo(entrevista.entSubtitulo);
        setCuerpo(entrevista.entCuerpoEntrevista);

        const imagenesArray = entrevista.entImagen ? entrevista.entImagen.split(",") : [];
        setMiniaturas(imagenesArray);
        setImagen(imagenesArray);
    };

    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const day = String(fechaObj.getDate()).padStart(2, '0')
        const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const year = fechaObj.getFullYear();
        return `${day}/${month}/${year}`;
    }

    //Limpia el estado del modal cuando se cierra, para los valores no interfieran en la siguiente edición. 
    useEffect(() => {
        const modal = document.getElementById('exampleModal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', () => {
                setEntrevistaSeleccionada('');
                reseteoFormulario();
            });
        }
        return () => {
            if (modal) {
                modal.removeEventListener('hidden.bs.modal', () => {
                    setEntrevistaSeleccionada('');
                    reseteoFormulario();
                });
            }
        };
    }, []);



    return (
        <div className={styles.cuerpo_gestionentrevistas}>
            {/* Sección para crear entrevistas */}
            <h2 className="text-center">Gestión de Entrevistas</h2>
            <button className="btn btn-primary mb-5" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={reseteoFormulario}>
                Crear nueva entrevista
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" style={{ color: "black" }} id="exampleModalLabel">Entrevista</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        {/* Modal */}
                        <div className="modal-body">
                            <form onSubmit={(evento) => anadir_entrevista(evento, fecha, titular, subtitulo, cuerpo, imagen)} style={{ color: "black" }}>
                                <div className="mb-3" style={{ color: "black" }}>
                                    <label htmlFor="fecha" className="form-label" >Fecha</label>
                                    <input type="date" className="form-control" id="fecha" aria-describedby="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="titular" className="form-label">Titular</label>
                                    <input type="text" className="form-control" id="titular" value={titular} onChange={(e) => setTitular(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="subtitulo" className="form-label">Subtitular</label>
                                    <input type="text" className="form-control" id="subtitulo" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cuerpo" className="form-label">Entrevista</label>
                                    <textarea type="text" className="form-control" id="cuerpo" value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} rows={10} style={{ width: '100%' }} />
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
                                                    onClick={(evento) => eliminarImagen(evento, index)}
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
            <h2>Entrevistas realizadas</h2>
            <div className="container d-flex m-3">
                {(Array.isArray(store.entrevistas) ? store.entrevistas : []).map((entrevista, index) => (
                    <div className="card" key={index} style={{ width: "18rem", backgroundColor: "PowderBlue" }}>
                        <div className="card-body">
                            <h3 className="card-title">{entrevista.entTitular}</h3>
                            <h5 className="card-text mb-2">{entrevista.entSubtitulo}</h5>
                            <h6 className="card-text mb-2">{formatearFecha(entrevista.entFecha)}</h6>

                            {/* Boton para editar */}
                            <div >
                                <button className="btn btn-primary mb-5" data-bs-toggle="modal" data-bs-target="#editarEntrevista" onClick={() => abrirModalEditar(entrevista)}>
                                    <LuPencil />
                                </button>
                                <div className="modal fade" id="editarEntrevista" tabIndex="-1" aria-labelledby="editarEntrevistaLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-xl modal-dialog-scrollable">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="editarEntrevistaLabel">{titular}</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">

                                                <form >
                                                    <div className="mb-3" style={{ color: "black" }}>
                                                        <label htmlFor="fecha" className="form-label" >Fecha</label>
                                                        <input type="date" className="form-control" id="fecha" aria-describedby="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="titular" className="form-label">Titular</label>
                                                        <input type="text" className="form-control" id="titular" value={titular} onChange={(e) => setTitular(e.target.value)} />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="subtitulo" className="form-label">Subtitular</label>
                                                        <input type="text" className="form-control" id="subtitulo" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="cuerpo" className="form-label">Entrevista</label>
                                                        <textarea type="text" className="form-control" id="cuerpo" value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} rows={10} style={{ width: '100%' }} />
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
                                                                        onClick={(evento) => eliminarImagen(evento, index)}
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-primary" onClick={(evento) => editar_entrevista(evento, fecha, titular, subtitulo, cuerpo, imagen)} data-bs-dismiss="modal" >Guardar datos</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                {/* //Botón eliminar y modal para confirmar eliminación */}
                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modaleliminarentrevista" onClick={() => setEntrevistaAEliminar(entrevista.entId)}>
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

                                                <button type="button" data-bs-dismiss="modal" className="btn btn-primary" onClick={() => eliminar_entrevista(entrevistaAEliminar)}>Eliminar</button>
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