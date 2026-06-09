import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./calendario.module.css";

export const CalendarioPublicaciones = ({ fechasPublicaciones, onSelectFecha }) => {
  const [date, setDate] = useState(new Date());

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const fechaCalendario = date.toISOString().split("T")[0];

      if (fechasPublicaciones.includes(fechaCalendario)) {
        return styles.diaConPublicacion;
      }
    }
  };

  const handleDayClick = (value) => {
    const fechaFormateada = value.toISOString().split("T")[0];
    if (onSelectFecha) {
      onSelectFecha(fechaFormateada);
    }
  };

  return (
    <div className={styles.contenedorCalendario}>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={tileClassName}
        onClickDay={handleDayClick}
        locale="es-ES"
      />
    </div>
  );
};
