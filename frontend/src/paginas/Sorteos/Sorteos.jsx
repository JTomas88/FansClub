/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/AppContext";
import { useNavigate } from "react-router-dom";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import jumbo_sorteos from "../../assets/imagenes_jumbotron/Jumbo_sorteos.png";
import styles from "./sorteos.module.css";

export const Sorteos = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [datoUsuario, setDatoUsuario] = useState({});
  const [participaciones, setParticipaciones] = useState({});
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [sorteosConResultado, setSorteosConResultado] = useState([]);
  const [ganadores, setGanadores] = useState([]);
  const [sorteosCache, setSorteosCache] = useState([]);

  //Obtiene todos los sorteos
  useEffect(() => {
    actions.obtenerSorteos();
  }, []);

  useEffect(() => {
    const sorteos = JSON.parse(localStorage.getItem("sorteos"));
    setSorteosCache(sorteos);
  }, [store.sorteos]);

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("loginData"));
      if (!userData || !userData.token || !userData.email) {
        navigate("/home");
      } else {
        setDatoUsuario(userData);
      }
    } catch (error) {
      console.error("Error al obtener datos de localStorage:", error);
      navigate("/home");
    }
  }, []);

  const participarEnSorteo = async (sorteoID) => {
    const userID = datoUsuario?.id;
    try {
      const sorteo = store.sorteos.find((sorteo) => sorteo.sorId === sorteoID);
      if (!sorteo) {
        alert("El sorteo no existe o no se ha encontrado");
        return;
      }

      const fechaActual = new Date();
      const fechaInicio = new Date(sorteo.fechaInicio);
      const fechaFin = new Date(sorteo.fechaFin);
      if (fechaActual < fechaInicio || fechaActual > fechaFin) {
        alert("Este sorteo ya no está activo, no puedes participar");
      }

      await actions.participarEnSorteo(sorteoID, userID);
      await actions.obtenerSorteos();
      const sorteosActualizados = store.sorteos;
      // Comprobar si el usuario está en la lista de participantes del sorteo
      const sorteoActualizado = sorteosActualizados.find(
        (sorteo) => sorteo.id === sorteoID
      );
      const haParticipado = sorteoActualizado?.participantes?.includes(userID);
      // Actualizar el estado del botón o de las participaciones
      setParticipaciones((prev) => ({
        ...prev,
        [sorteoID]: haParticipado,
      }));
      alert("Se ha recibido tu participación en el sorteo!");
    } catch (error) {
      alert("Hay un problema con tu participación");
    }
  };

  useEffect(() => {
    const inicializarParticipaciones = () => {
      const participacionesIniciales = store.sorteos.reduce((acc, sorteo) => {
        acc[sorteo.sorId] =
          sorteo.participantes?.includes(datoUsuario?.id) || false;
        return acc;
      }, {});
      setParticipaciones(participacionesIniciales);
    };

    inicializarParticipaciones();
  }, [store.sorteos, datoUsuario]);

  // useEffect(() => {
  //   if (store?.sorteos) {
  //     const sorteos = store.sorteos;
  //     const hoy = new Date();
  //     const activos = sorteos.filter(sorteo => new Date(sorteo.sorFechaInicio) <= hoy && new Date(sorteo.sorFechaFin) >= hoy)
  //     console.log('Sorteos activos: ', activos)
  //     if (activos) {
  //       setMostrarBoton(true)
  //     } else { setMostrarBoton(false) }

  //   } else {
  //     alert('No se han encontrado sorteos')
  //   }
  // }, [])

  useEffect(() => {
    const cargarGanadores = async () => {
      if (store?.sorteos) {
        /**
         * Se filtran los sorteos para obtener solamente 
         * aquellos que tienen datos de resultados (Ganadores).
         */
        const sorteosConGanadores = store.sorteos.filter(
          (sorteo) => sorteo.sorResultado
        );

        /**
         * nuevosGanadores -> objeto temporal para mantener el estado 
         * de los ganadores y no perder datos anteriores.
         */
        const nuevosGanadores = {};

        for (const sorteo of sorteosConGanadores) {
          try {
            /** Se obtiene el id del ganador. */
            const ganadorData = await actions.obtenerUsuarioPorId(
              sorteo.sorResultado
            );
            if (ganadorData) {
              nuevosGanadores[sorteo.sorId] = ganadorData;
            }
          } catch (error) {
            console.error(
              `Error al obtener datos del ganador para sorteo ${sorteo.sorId}:`,
              error
            );
          }
        }

        /**
         * Se actualiza el estado de los ganadores.
         * Manteniendo el estado del ganador anterior para no perder los datos.
         * S
         */
        setGanadores((prevGanadores) => ({
          ...prevGanadores,
          ...nuevosGanadores,
        }));
      }
    };

    cargarGanadores();
  }, [store.sorteos, actions]);

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
        {sorteosCache && sorteosCache.length > 0 ? (
          sorteosCache.map((sorteo, index) => {
            const hoy = new Date();
            const fechaInicio = new Date(sorteo.sorFechaInicio);
            const fechaFin = new Date(sorteo.sorFechaFin);
            fechaFin.setDate(fechaFin.getDate() + 1); //suma un dia mas
            const esActivo = fechaInicio <= hoy && fechaFin >= hoy;
            const proximos = fechaInicio > hoy;
            const pasados = fechaFin < hoy;
            return (
              <div key={index} className={`${styles.contenedor} p-4 mb-5`}>
                <div className="row mb-3">
                  <div
                    className={` ${styles.col_6}`}
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
                    <h5>Periodo para participar</h5>
                    <p style={{ fontSize: "18px", marginBottom: "0px" }}>
                      <strong>Fecha Inicio: </strong>
                      {new Date(sorteo.sorFechaInicio).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: "18px" }}>
                      <strong>Fecha Fin: </strong>
                      {new Date(sorteo.sorFechaFin).toLocaleDateString()}
                    </p>

                    {/* Descripción del sorteo */}
                    <h5>Detalles del sorteo</h5>
                    <p className="text-muted">{sorteo.sorDescripcion}</p>
                  </div>

                  {/* IMAGENES */}
                  <div className={styles.col}>
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
                                className={`img-fluid mb-5 ${styles.box_imagen}`}
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
                                  className={`img-fluid mb-3 me-2 ${styles.box_imagen} ${styles.dos_img}`}
                                />
                              ))}
                            </div>
                          );
                        } else if (recuentoImagenes === 3) {
                          return (
                            <div className="d-flex flex-wrap justify-content-between">
                              {imagenesSeparadas.map((img, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  alt={`imagen promocional ${imgIndex + 1}`}
                                  src={img}
                                  className={`img-fluid mb-3  ${styles.box_imagen}`}
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
                                  className={`img-fluid mb-3 ${styles.box_imagen}`}
                                />
                              ))}
                            </div>
                          );
                        }
                      })()
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "300px" }}
                      >
                        <p className="text-muted ">
                          No hay imágenes disponibles
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {esActivo && (
                  <button
                    className={`btn ${
                      participaciones[sorteo.sorId]
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
                {proximos && (
                  <button
                    className={`btn ${`btn-warning ${styles.boton_inactivo}`}
                     ${styles.informativo}`}
                    disabled
                  >
                    Disponible próximamente
                  </button>
                )}
                {pasados && (
                  <button
                    className={`btn ${`btn-warning ${styles.boton_inactivo}`}
                     ${styles.informativo}`}
                    disabled
                  >
                    Este sorteo ya ha finalizado
                  </button>
                )}

                {pasados && sorteo.sorResultado && (
                  <div
                    className={`btn ${`btn-warning ${styles.boton_inactivo}`}
                      ${styles.ganador}`}
                    disabled
                  >
                    Ganador/a del sorteo:{" "}
                    {ganadores[sorteo.sorId]?.nombre || "Cargando..."}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center">No hay sorteos disponibles.</p>
        )}
      </div>
    </>
  );
};
