import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/AppContext";
import styles from "../Admin/gestiongalerias.module.css"
import { FaFolder, FaPlus, FaImage } from "react-icons/fa";

export const GestionGalerias = () => {
    const { store, actions } = useContext(Context);
    const [nombreCarpeta, setNombreCarpeta] = useState('');
    const [foto, setFoto] = useState('');
    const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null);
    const [carpetaAbierta, setCarpetaAbierta] = useState(null)
    const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState(null)


    //Llamo a la función para mostrar las carpetas cuando el componente se cargue.
    useEffect(() => {
        actions.admin_mostrarCarpetas();
    }, []);

    //Función para crear carpetas vacías 
    const crearCarpeta = async () => {
        if (!nombreCarpeta.trim()) {
            alert("Por favor, ingresa un nombre de carpeta");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("folder", nombreCarpeta);
            const respuesta = await actions.admin_crearCarpeta(formData)
            actions.admin_mostrarCarpetas();
            console.log("carpeta creada:", respuesta)

        } catch (error) {
            console.error("error al crear la carpeta:", error)
            return null;
        }
        setNombreCarpeta('');
    };

    //Función para seleccionar la carpeta donde incluir imágenes
    const seleccionarCarpeta = (carpeta) => {
        setCarpetaSeleccionada(carpeta.name);
        setCarpetaAbierta(null)
    };

    //Función para abrir una carpeta haciendo doble click
    const abrirCarpeta = (carpeta) => {
        setCarpetaAbierta(carpeta.name);
        setCarpetaSeleccionada(null)
    }

    // Función para manejar la selección de archivos
    const manejarArchivos = (e) => {
        setImagenesSeleccionadas(e.target.files);
    };

    const subirFoto = async () => {
        if (!carpetaAbierta) {
            alert("Por favor seleccione una carpeta");
            return
        }

        if (!imagenesSeleccionadas || imagenesSeleccionadas.length === 0) {
            alert("Seleccionar al menos un archivo para subir");
            return
        }

        const formData = new FormData();

        for (let i = 0; i < imagenesSeleccionadas.length; i++) {
            formData.append('files', imagenesSeleccionadas[i])
        }
        formData.append('folder', carpetaAbierta);

        try {
            const respuesta = await actions.admin_subirfoto(formData);
            console.log("Imágenes subidas a la carpeta ", carpetaAbierta, "respuesta", respuesta)
            alert("Imágenes subidas correctamente")
            setImagenesSeleccionadas(null);
            document.getElementById('file-input').value = ''
        } catch (error) {
            console.error("Error al subir imágenes:", error)
        }
    }



    return (
        <div className={styles.bodyPage}>
            <h2 className="text-center"
                style={{ color: 'black' }}
            >
                Gestión de galerías fotográficas
            </h2>

            {/* Parte superior: Crear nueva carpeta */}
            <div style={{ marginBottom: '20px' }}>
                <h4 className="mb-2" style={{ color: 'black' }}>Crear nueva carpeta</h4>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de la carpeta"
                    value={nombreCarpeta}
                    onChange={(e) => setNombreCarpeta(e.target.value)}
                    style={{ width: '500px' }}
                />
                <button className="btn btn-primary mt-2" onClick={crearCarpeta}>
                    <FaPlus /> Crear Carpeta
                </button>
            </div>

            {/* Parte inferior: Mostrar carpetas creadas */}
            <hr />
            <h3>Carpetas disponibles</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {Array.isArray(store.carpetasFotos) && store.carpetasFotos.length > 0 ? (
                    store.carpetasFotos.map((carpeta, index) => (
                        <div
                            key={index}
                            style={{
                                border: carpetaSeleccionada === carpeta.name ? "3px solid blue" : "1px solid #ccc",
                                padding: "10px",
                                margin: "10px",
                                fontSize: "15px",
                                textAlign: "center",
                                width: "120px",
                                cursor: "pointer",
                                color: "black",
                                backgroundColor: carpetaAbierta === carpeta.name ? "#f0f8ff" : "white", // Cambiar color si está abierta

                            }}
                            onClick={() => seleccionarCarpeta(carpeta)} //Click simple selecciona la carpeta
                            onDoubleClick={() => abrirCarpeta(carpeta)} // Doble click abre la carpeta

                        >
                            <FaFolder size={50} color="#FFC107" />
                            <p>{carpeta.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay carpetas creadas.</p>
                )}
            </div>

            {/* Mostrar input de subir imagen si hay una carpeta seleccionada */}
            {carpetaAbierta && (
                <div>
                    <h4>Subir imagen a: {carpetaAbierta}</h4>
                    <input
                        type="file"
                        id='file-input'
                        className="form-control"
                        multiple
                        onChange={manejarArchivos}
                    />
                    <button className="btn btn-success mt-2" onClick={subirFoto}>
                        <FaImage /> Subir Imágenes
                    </button>

                    {/* Mostrar la URL de la imagen subida */}
                    {foto && (
                        <p>
                            Imagen subida:{" "}
                            <a href={foto} target="_blank" rel="noopener noreferrer">
                                {foto}
                            </a>
                        </p>
                    )}
                </div>
            )}
        </div>

    )
}