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
  const [filtro, setFiltro] = useState('activos')
  const [selectedItem, setSelectedItem] = useState(1);
  const [spinner, setSpinner] = useState(false)

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
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || !userData.token || !userData.email) {
        navigate("/");
      } else {
        setDatoUsuario(userData);
      }
    } catch (error) {
      console.error("Error al obtener datos de localStorage:", error);
      navigate("/");
    }
  }, []);

  const participarEnSorteo = async (sorteoID) => {
    const userID = datoUsuario?.id;
    const sorteos = JSON.parse(localStorage.getItem("sorteos"));
    try {
      const sorteo = sorteos.find((sorteo) => sorteo.sorId === sorteoID);
      if (!sorteo) {
        alert("El sorteo no existe o no se ha encontrado");
        return;
      }
      if (!datoUsuario.nombre) {
        alert('nombre vacio, rellena tus datos para poder participar en sorteos')
        return
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



  useEffect(() => {
    const sorteos = JSON.parse(localStorage.getItem("sorteos"));
    const cargarGanadores = async () => {
      if (sorteos) {
        /**
         * Se filtran los sorteos para obtener solamente 
         * aquellos que tienen datos de resultados (Ganadores).
         */
        const sorteosConGanadores = sorteos.filter(
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
            const ganadorData = await actions.obtenerGanador(
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
  }, [store.sorteos]);


  const handleDotClick = (index) => {
    setSelectedItem(selectedItem === index ? null : index);
  };


  const clasificarSorteos = (sorteos) => {
    try {
      const hoy = new Date();

      // Ajusta la fecha del día actual para que sea a las 23:59:59
      const finHoy = new Date(hoy);
      finHoy.setHours(23, 59, 59, 999);

      const activos = sorteos.filter(sorteo => {
        const inicio = new Date(sorteo.sorFechaInicio);
        const fin = new Date(sorteo.sorFechaFin);

        // Ajusta la fecha de fin del sorteo para incluir el día completo
        fin.setHours(23, 59, 59, 999);

        return inicio >= hoy || (inicio <= hoy && fin >= hoy);
      });

      const pasados = sorteos.filter(sorteo => {
        const fin = new Date(sorteo.sorFechaFin);

        // Ajusta la fecha de fin del sorteo para incluir el día completo
        fin.setHours(23, 59, 59, 999);

        return fin < hoy;
      });

      console.log("Sorteos activos: ", activos);

      switch (filtro) {
        case "activos":
          return activos;
        case "pasados":
          return pasados;
        default:
          return activos;
      }
    } catch (error) {
      console.error("Error clasificando sorteos:", error);
      return [];
    }
  };

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
      <div className={styles.advertencia} >
        <p style={{ backgroundColor: 'orange', display: 'flex', alignItems: 'center', padding: '1%', borderRadius: '10px' }}>
          Sólo es posible participar si los datos en "Mi perfil" están completos
        </p>
      </div>

      <div className="d-flex justify-content-center mb-3">
        <button type="button" className="btn botones btn-sm d-flex" data-bs-toggle="modal" data-bs-target="#basesSorteos">
          Bases de sorteos
        </button>
      </div >




      {/* Modal bases sorteos */}
      <div className="modal fade" id="basesSorteos" tabindex="-1" aria-labelledby="basesSorteosLabel" aria-hidden="true" style={{ color: 'black' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="basesSorteosLabel">Bases de los sorteos</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ul>
                <li style={{ listStyleType: 'disc', textAlign: 'justify' }}> Para participar en los sorteos deben estar todos los datos del perfil completados </li>
                <li style={{ listStyleType: 'disc', textAlign: 'justify' }}> El sorteo se realizará a las 48 horas de la fecha de finalización. </li>
                <li style={{ listStyleType: 'disc', textAlign: 'justify' }}> El resultado del sorteo se realizará de forma aleatoria entre los usuarios que hayan participado. </li>
                <li style={{ listStyleType: 'disc', textAlign: 'justify' }}> Se contactará con el ganador/a mediante correo electrónico (importante revisar spam) para confirmar los datos</li>
                <li style={{ listStyleType: 'disc', textAlign: 'justify' }}> En el caso de no obtener respuesta se realizará un segundo sorteo entre los participantes, con el mismo procedimiento de contacto </li>
                <li style={{ listStyleType: 'disc', textAlign: 'justify' }}>Al participar en un sorteo se dan por conocidas y aceptadas estas bases</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div >


      <div className="d-flex d-flex justify-content-center">
        <p>Filtrar sorteos por: </p>
      </div>

      <div className="d-flex mb-4 d-flex justify-content-center">

        <button className={`btn m-2 ${selectedItem === 0 ? 'btn-success' : 'btn-secondary'}`} onClick={() => { setFiltro('pasados'); handleDotClick(0) }}>
          Sorteos pasados
        </button>

        <button className={`btn m-2 ${selectedItem === 1 ? 'btn-success' : 'btn-secondary'}`} onClick={() => { setFiltro('activos'); handleDotClick(1) }}>
          Sorteos Vigentes / Futuros
        </button>
      </div>

      {/* Contenedor de sorteos */}
      <div
        className={`container d-flex flex-column align-items-start ${styles.tarjeta}`}
        style={{ color: "black" }}
      >
        {sorteosCache && sorteosCache.length > 0
          ? clasificarSorteos(sorteosCache).map((sorteo, index) => {
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
                  <div className="d-flex justify-content-center">
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
                  </div>

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
          }
          ) : (
            <p className="text-center">No hay sorteos disponibles.</p>
          )}
      </div>
    </>
  );
};
