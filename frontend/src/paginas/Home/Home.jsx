import Seo from "../../componentes/Seo/Seo";
import { useState, useMemo } from "react";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import imgJumbo from "../../assets/imagenes_jumbotron/JumboHome.png";
import { CuentaAtras } from "../../componentes/CuentaAtras/CuentaAtras";
import styles from "./home.module.css";
import { CalendarioPublicaciones } from "../../componentes/CalendarioPublicaciones/CalendarioPublicaciones";
import { ArchivoMeses } from "../../componentes/ArchivoMeses/ArchivoMeses";
import { TarjetaPublicacion } from "../../componentes/TarjetaPublicacion/TarjetaPublicacion";
import { PUBLICACIONES } from "../../data/publicaciones";


export const Home = () => {
  const mesActual = new Date().toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const [mesSeleccionado, setMesSeleccionado] = useState(mesActual);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    const publicacionesFiltradas = useMemo(() => {
    if (fechaSeleccionada) {
        return PUBLICACIONES.filter((pub) => pub.fecha === fechaSeleccionada);
    }

    if (!mesSeleccionado) return PUBLICACIONES;
    return PUBLICACIONES.filter((pub) => {
        const nombreMesAño = new Date(pub.fecha).toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
        });
        return nombreMesAño === mesSeleccionado;
    });
    }, [mesSeleccionado, fechaSeleccionada]);

  return (
    <>
      <Seo
        title="Home | Sienna Fans"
        description="Bienvenidx a la página de fans de Sienna."
      />

      <div className={styles.fondoContenido}>
        <div className={styles.homeContainer}>
          <main className={styles.mainContent}>
            <Jumbotron
              imagenFondo={{
                backgroundImage: `url(${imgJumbo})`,
                backgroundPosition: "center 10%",
              }}
              subtitulo={"Ya no se me para el tiempo"}
              referencia={"home"}
            />

            <div className="container pt-5">
              <CuentaAtras />
            </div>

            <section className="mt-5">
              {mesSeleccionado && (
                <h2 className="text-center mb-4">
                  Publicaciones de {mesSeleccionado}
                </h2>
              )}

              {publicacionesFiltradas.length > 0 ? (
                publicacionesFiltradas.map((pub) => (
                  <TarjetaPublicacion key={pub.id} item={pub} />
                ))
              ) : (
                <p className="text-center">No hay publicaciones en este mes.</p>
              )}
            </section>
          </main>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <h4>Últimas publicaciones</h4>
              <CalendarioPublicaciones
                fechasPublicaciones={PUBLICACIONES.map((p) => p.fecha)}
                onSelectFecha={(fecha) => {
                  setFechaSeleccionada(fecha);
                  setMesSeleccionado(null); // Desmarcamos el filtro de mes para ver el día
                }}
              />
              <ArchivoMeses
                publicaciones={PUBLICACIONES}
                onSelectMes={setMesSeleccionado}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};
