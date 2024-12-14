import React, { useState, useEffect } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Box } from "@mui/material";
import styles from "../Timeline/timeline.module.css";
import tragicoyfugaz from "../../assets/portadas_discos/portadatragicoyfugaz.jpg";
import melancolic from "../../assets/portadas_discos/portadamelancolic.jpeg";
import tiempos from "../../assets/portadas_discos/portadatiemposdeimpacto.jpg";
import trance from "../../assets/portadas_discos/portadatrance.jpg";

export const TimelineComponent = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  // Detectar el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Cambiar este valor según tus necesidades
    };

    handleResize(); // Comprobar el tamaño al inicio
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  /**
   * Con esta función controlamos el contenido que queremos desplegar
   * @param {*} index
   */
  const handleDotClick = (index) => {
    if (!isMobile) { // Solo permitir expansión en pantallas grandes
      setSelectedItem(selectedItem === index ? null : index);
    }
  };

  /**
   * Objeto que se utiliza para almacenar la información de los discos
   */
  const timelineData = [
    { img: tragicoyfugaz, titulo: "2017 - Trágico y Fugaz", texto: "Sienna hace su debut con el álbum Trágico y fugaz" },
    { img: tiempos, titulo: "2020 - Tiempos de impacto", texto: "Sienna ya forma parte del panorama musical en España" },
    { img: melancolic, titulo: "2021 - Melancolic", texto: "Se lanza Melancolic, una introspección a los sentimientos" },
    { img: trance, titulo: "2024 - Trance", texto: "Se publica Trance: un disco con nuevos sonidos donde se suelta la rabia más humana" },
  ];



  return (
    <Timeline position="alternate">
      {timelineData.reverse().map((data, index) => {
        const indexPar = index % 2 === 0;
        return (
          <TimelineItem key={index}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <TimelineDot
                onClick={() => handleDotClick(index)}
                sx={{
                  cursor: isMobile ? "default" : "pointer",
                  backgroundColor: selectedItem === index ? "blue" : "grey",
                  transition: "background-color 0.3s ease",
                  width: "20px",
                  height: "20px",
                }}
              />
              {index < timelineData.length - 1 && (
                <TimelineConnector
                  sx={{
                    bgcolor: selectedItem === index ? "blue" : "secondary.main",
                    width: 5,
                  }}
                />
              )}
            </Box>
            <TimelineContent >
              <div
                className={`${indexPar ? styles.pares : styles.impares} 
          ${selectedItem === index ? (indexPar ? styles.expanded_right : styles.expanded_left) : ''}`}
              >
                {selectedItem === index ? (
                  <div className={styles.expandedContent}>
                    <img
                      src={data.img}
                      alt={`Portada ${index + 1}`}
                      className={styles.image}
                    />
                    <br />
                    <p><strong>{data.titulo}</strong></p>
                    <p>{data.texto}</p>
                  </div>
                ) : (
                  <div>
                    <img
                      src={data.img}
                      alt={`Portada ${index + 1}`}
                      className={styles.mini_image}
                    ></img>
                    <p>{data.titulo}</p>
                    <p>{data.texto}</p>
                  </div>
                )}
              </div>
              <div className={`${indexPar ? styles.arrow_left : styles.arrow_right
                }`} />
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};
