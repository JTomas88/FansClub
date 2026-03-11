import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiaCalendario } from "../DiaCalendario/DiaCalendario";
import styles from "./cuentaatras.module.css"

export const CuentaAtras = () => {
    const getSecondsUntilMidnight = () => {
        const ahora = new Date();
        const mañana = new Date(ahora);
        mañana.setDate(ahora.getDate() + 1);
        mañana.setHours(0, 0, 0, 0);
        return Math.floor((mañana - ahora) / 1000);
    };

    const [timeLeft, setTimeLeft] = useState(getSecondsUntilMidnight());
    const [isMidnight, setIsMidnight] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const segundosRestantes = getSecondsUntilMidnight();
            setTimeLeft(segundosRestantes);

            if (segundosRestantes <= 1) {
                setIsMidnight(true);
            } else {
                setIsMidnight(false);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (time) => {
        const totalSeconds = Math.max(0, time);
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");
        return { hours, minutes, seconds };
    };

    const { hours, minutes, seconds } = formatTime(timeLeft);

    const TimeBlock = ({ value, label }) => (
        <div className="d-inline-block mx-2 mx-md-4 text-center">
            <div className={`${styles.horas_min_seg}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={value}
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className={`${styles.numeros_reloj}`}
                    >
                        {value}
                    </motion.div>
                </AnimatePresence>
            </div>
            <span className={`${styles.texto_reloj}`}>
                {label}
            </span>
        </div>
    );

    return (
        <div className="text-center w-100">

            <div className={`${styles.container_reloj}`}>

                {/* Bloque de Días (se verá arriba en móvil) */}
                <div className={`${styles.seccion_dias}`}>
                    <DiaCalendario isMidnight={isMidnight} label="DÍAS" />
                </div>



                <div className={`${styles.seccion_tiempo}`}>
                    <TimeBlock value={hours} label="HORAS" />
                    <div className={`${styles.separador}`}>:</div>

                    <TimeBlock value={minutes} label="MINUTOS" />
                    <div className={`${styles.separador}`}>:</div>

                    <TimeBlock value={seconds} label="SEGUNDOS" />
                </div>
            </div>

            {/* Botón para pasar pagina */}
            {/* <button
                onClick={() => setIsMidnight(!isMidnight)}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                }}
            >
                Probar pasar página
            </button> */}
        </div>
    );
};