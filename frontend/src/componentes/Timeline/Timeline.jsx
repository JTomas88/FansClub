import React, { useState } from "react";
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

  /**
   * Con esta función controlamos el contenido que queremos desplegar
   * @param {*} index
   */
  const handleDotClick = (index) => {
    setSelectedItem(selectedItem === index ? null : index);
  };

  /**
   * Objeto que se utiliza para almacenar la información de los discos
   */
  const timelineData = [
    { img: tragicoyfugaz, text: "2017 - Trágico y Fugaz" },
    { img: tiempos, text: "2020 - Tiempos de impacto" },
    { img: melancolic, text: "2021 - Melancolic" },
    { img: trance, text: "2024 - Trance" },
  ];

  return (
    <Timeline position="alternate">
      {timelineData.map((data, index) => (
        <TimelineItem key={index}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <TimelineDot
              onClick={() => handleDotClick(index)}
              sx={{
                cursor: "pointer",
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
                  width: 2,
                }}
              />
            )}
          </Box>
          <TimelineContent>
            <div
              className={`${styles.boxInfo} ${
                selectedItem === index ? styles.expanded : ""
              }`}
            >
              {selectedItem === index ? (
                <div className={styles.expandedContent}>
                  <img
                    src={data.img}
                    alt={`Portada ${index + 1}`}
                    className={styles.image}
                  />
                  <br />
                  <p>{data.text}</p>
                </div>
              ) : (
                <div>
                  <img
                    src={data.img}
                    alt={`Portada ${index + 1}`}
                    className={styles.mini_image}
                  ></img>
                  <p>{data.text}</p>
                </div>
              )}
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
