import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/AppContext";
import styles from "./visorcomponente.module.css";

export const VisorComponente = ({ carpetaSeleccionada }) => {
    const { store, actions } = useContext(Context);

    const [fotos, setFotos] = useState([]);
    const [carpetaVacia, setCarpetaVacia] = useState("");
    const [mostrarCarrusel, setMostrarCarrusel] = useState(false); // Nuevo estado

    const scrollToCarousel = () => {
        setTimeout(() => {
            const carouselElement = document.getElementById("carrouselFotos");
            if (carouselElement) {
                carouselElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 100);
    };

    const handleOutsideClick = (e) => {
        if (mostrarCarrusel) {
            setMostrarCarrusel(false);
        }
    };

    const handleCarouselClick = (e) => {
        e.stopPropagation();
    };

    useEffect(() => {
        const obtenerFotos = async () => {
            if (carpetaSeleccionada) {
                const respuesta = await actions.mostrarImagenesCarpeta(carpetaSeleccionada);

                if (Array.isArray(respuesta)) {
                    if (respuesta.length <= 0) {
                        setCarpetaVacia("Esta carpeta no contiene imágenes");
                        setFotos([]);
                    } else {
                        setFotos(respuesta);
                        setCarpetaVacia("");
                        setMostrarCarrusel(true); // Muestra el carrusel
                        scrollToCarousel();
                    }
                } else {
                    console.error("La respuesta no es un array de fotos");
                }
            }
        };
        obtenerFotos();
    }, [carpetaSeleccionada, actions]);

    return (
        <div onClick={handleOutsideClick} style={{ position: "relative" }}>
            {fotos.length <= 0 && carpetaVacia ? (
                <p style={{ color: "red" }}>{carpetaVacia}</p>
            ) : (
                mostrarCarrusel && (
                    <div
                        id="carrouselFotos"
                        className="carousel slide"
                        data-bs-ride="carousel"
                        onClick={handleCarouselClick}
                        style={{
                            margin: "0 auto",
                            position: "relative",
                            zIndex: 10,
                            minHeight: '600px'
                        }}
                    >
                        {/* Indicadores */}
                        <div className="carousel-indicators">
                            {fotos.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    data-bs-target="#carrouselFotos"
                                    data-bs-slide-to={index}
                                    className={index === 0 ? "active" : ""}
                                    aria-current={index === 0 ? "true" : "false"}
                                    aria-label={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Contenedor de imágenes */}
                        <div className={`carousel-inner ${styles.carruinner}`}>
                            {fotos.map((foto, index) => (
                                <div
                                    key={index}
                                    className={`carousel-item  ${index === 0 ? "active" : ""}`}
                                >
                                    <img
                                        src={foto.secure_url}
                                        className={`d-block ${styles.carousel_image}`}
                                        alt={`Foto ${index}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Controles del carrusel */}
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#carrouselFotos"
                            data-bs-slide="prev"
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#carrouselFotos"
                            data-bs-slide="next"
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                )
            )}
        </div>
    );
};
