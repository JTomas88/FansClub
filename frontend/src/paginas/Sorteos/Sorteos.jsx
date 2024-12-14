/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/AppContext";
import { useNavigate } from "react-router-dom";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import jumbo_sorteos from "../../assets/imagenes_jumbotron/Jumbo_sorteos.png"
import styles from "./sorteos.module.css"


export const Sorteos = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [datoUsuario, setDatoUsuario] = useState({})
  const [participaciones, setParticipaciones] = useState({})
  const [mostrarBoton, setMostrarBoton] = useState(false)


  useEffect(() => {
    actions.obtenerSorteos();
  }, [])



  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.token || !userData.email) {
        navigate('/home');
      } else {
        setDatoUsuario(userData);
      }
    } catch (error) {
      console.error('Error al obtener datos de localStorage:', error);
      navigate('/home');
    }
  }, []);



  const participarEnSorteo = async (sorteoID) => {
    const userID = datoUsuario?.id;
    try {

      const sorteo = store.sorteos.find((sorteo) => sorteo.sorId === sorteoID)
      if (!sorteo) {
        alert('El sorteo no existe o no se ha encontrado')
        return
      }

      const fechaActual = new Date();
      const fechaInicio = new Date(sorteo.fechaInicio)
      const fechaFin = new Date(sorteo.fechaFin)
      if (fechaActual < fechaInicio || fechaActual > fechaFin) {
        alert('Este sorteo ya no está activo, no puedes participar')
      }

      await actions.participarEnSorteo(sorteoID, userID);
      await actions.obtenerSorteos()
      const sorteosActualizados = store.sorteos;
      // Comprobar si el usuario está en la lista de participantes del sorteo
      const sorteoActualizado = sorteosActualizados.find((sorteo) => sorteo.id === sorteoID);
      const haParticipado = sorteoActualizado?.participantes?.includes(userID);
      // Actualizar el estado del botón o de las participaciones
      setParticipaciones((prev) => ({
        ...prev,
        [sorteoID]: haParticipado,
      }));
      alert("Se ha recibido tu participación en el sorteo!");
    } catch (error) {
      alert('Hay un problema con tu participación')
    }
  }


  useEffect(() => {
    const inicializarParticipaciones = () => {
      const participacionesIniciales = store.sorteos.reduce((acc, sorteo) => {
        acc[sorteo.sorId] = sorteo.participantes?.includes(datoUsuario?.id) || false;
        return acc;
      }, {});
      setParticipaciones(participacionesIniciales);
    };

    inicializarParticipaciones();
  }, [store.sorteos, datoUsuario]);


  useEffect(() => {
    if (store?.sorteos) {
      const sorteos = store.sorteos;
      const hoy = new Date();
      const activos = sorteos.filter(sorteo => new Date(sorteo.sorFechaInicio) <= hoy && new Date(sorteo.sorFechaFin) >= hoy)
      console.log('Sorteos activos: ', activos)
      if (activos) {
        setMostrarBoton(true)
      } else { setMostrarBoton(false) }

    } else {
      alert('No se han encontrado sorteos')
    }
  }, [])



  return (
    <>
      <Jumbotron
        imagenFondo={{
          backgroundImage: `url(${jumbo_sorteos})`,
          backgroundPosition: "center 20%",
        }}
        subtitulo={"Tal vez sólo hay sombras y formas"}
        referencia={"foto"}
      ></Jumbotron>
      <div className="container justify-content-center align-items-center text-center">
        <div className={`${styles.titulo}`}>
          <h1 className={`${styles.titulo}`}>SORTEOS</h1>
        </div>
      </div>

      {/* Contenedor de sorteos */}
      <div
        className={`container d-flex flex-column align-items-start ${styles.tarjeta}`}
        style={{ color: "black" }}
      >
        {store.sorteos && store.sorteos.length > 0 ? (
          store.sorteos.map((sorteo, index) => {

            const hoy = new Date();
            const fechaInicio = new Date(sorteo.sorFechaInicio);
            const fechaFin = new Date(sorteo.sorFechaFin);
            const esActivo = fechaInicio <= hoy && fechaFin >= hoy;

            return (
              <div
                key={index}
                className={`${styles.contenedor} p-4 mb-5`}
                style={{
                  width: "80%",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  paddingBottom: "60px",
                }}
              >

                <div className="row mb-3">
                  <div
                    className="col-6"
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      overflowX: "hidden",
                      paddingRight: "10px",
                    }}
                  >
                    {/* Nombre sorteo */}
                    <h2 className={styles.titular}>{sorteo.sorNombre}</h2>
                    <hr></hr>

                    {/* Periodo participación */}
                    <h4>Periodo para participar</h4>
                    <p>
                      <strong>Fecha Inicio: </strong>
                      {new Date(sorteo.sorFechaInicio).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Fecha Fin: </strong>
                      {new Date(sorteo.sorFechaFin).toLocaleDateString()}
                    </p>

                    {/* Descripción del sorteo */}
                    <h4>Detalles del sorteo</h4>
                    <p className="text-muted">{sorteo.sorDescripcion}</p>
                  </div>

                  {/* IMAGENES */}
                  <div className="col">
                    {sorteo.sorImagen && sorteo.sorImagen.length > 0 ? (
                      (() => {
                        const imagenesSeparadas = sorteo.sorImagen
                          .split(",")
                          .map((img) => img.trim());
                        const recuentoImagenes = imagenesSeparadas.length;

                        if (recuentoImagenes === 1) {
                          return (
                            <div className="d-flex justify-content-center">
                              <img
                                alt="imagen promocional"
                                src={imagenesSeparadas[0]}
                                className="img-fluid mb-5"
                                style={{
                                  maxHeight: "400px",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                }}
                              />
                            </div>
                          );
                        } else if (recuentoImagenes === 2) {
                          return (
                            <div className="d-flex">
                              {imagenesSeparadas.map((img, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  alt={`imagen promocional ${imgIndex + 1}`}
                                  src={img}
                                  className="img-fluid mb-3 me-2"
                                  style={{
                                    width: "48%",
                                    height: "auto",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                  }}
                                />
                              ))}
                            </div>
                          );
                        } else if (recuentoImagenes === 3) {
                          return (
                            <div className="d-flex flex-wrap">
                              {imagenesSeparadas.map((img, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  alt={`imagen promocional ${imgIndex + 1}`}
                                  src={img}
                                  className="img-fluid mb-3 me-2"
                                  style={{
                                    width: imgIndex === 0 ? "100%" : "48%",
                                    height: "auto",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                  }}
                                />
                              ))}
                            </div>
                          );
                        } else if (recuentoImagenes === 4) {
                          return (
                            <div className="d-flex flex-wrap justify-content-between">
                              {imagenesSeparadas.map((img, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  alt={`imagen promocional ${imgIndex + 1}`}
                                  src={img}
                                  className="img-fluid mb-3"
                                  style={{
                                    width: "48%",
                                    height: "auto",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                  }}
                                />
                              ))}
                            </div>
                          );
                        }
                      })()
                    ) : (
                      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                        <p className="text-muted ">No hay imágenes disponibles</p>
                      </div>

                    )}
                  </div>
                </div>
                {esActivo && (
                  <button
                    className={`btn ${participaciones[sorteo.sorId]
                      ? `btn-secondary ${styles.boton_inactivo}`
                      : "btn-primary"
                      } ${styles.flotante}`}
                    onClick={() => participarEnSorteo(sorteo.sorId)}
                    disabled={participaciones[sorteo.sorId]} // Deshabilitar si ya participó
                  >
                    {participaciones[sorteo.sorId]
                      ? "Estás participando en este sorteo"
                      : "Participar"}
                  </button>
                )}
              </div>
            )
          })
        ) : (
          <p className="text-center">No hay sorteos disponibles.</p>
        )}
      </div>
    </>
  );
}