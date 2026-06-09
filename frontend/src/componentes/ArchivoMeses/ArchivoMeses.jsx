import React from "react";
import styles from "./archivo.module.css";

export const ArchivoMeses = ({ publicaciones, onSelectMes }) => {
  const mesesUnicos = [
    ...new Set(
      publicaciones.map((pub) => {
        const date = new Date(pub.fecha);
        return date.toLocaleString("es-ES", { month: "long", year: "numeric" });
      }),
    ),
  ];

  return (
    <div className={styles.contenedorArchivo}>
      <h3>Archivo</h3>
      <ul className={styles.listaMeses}>
        {mesesUnicos.map((mes) => (
          <li
            key={mes}
            onClick={() => onSelectMes(mes)}
            className={styles.itemMes}
          >
            {mes.charAt(0).toUpperCase() + mes.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};
