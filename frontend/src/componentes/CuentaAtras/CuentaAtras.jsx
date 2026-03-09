import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiaCalendario } from "../DiaCalendario/DiaCalendario";

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
            <div style={{ height: "7rem", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "100px" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={value}
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        style={{
                            fontSize: "clamp(3.5rem, 12vw, 7rem)",
                            fontWeight: "900",
                            fontFamily: "monospace",
                            color: "#fff",
                            textShadow: "0 0 15px rgba(255,255,255,0.5)",
                        }}
                    >
                        {value}
                    </motion.div>
                </AnimatePresence>
            </div>
            <span style={{ color: "#444", letterSpacing: "4px", fontSize: "0.75rem", display: "block", fontWeight: "bold" }}>
                {label}
            </span>
        </div>
    );

    return (
        /* Envolvemos todo en un div principal para que no de error */
        <div className="text-center w-100">
            <div className="d-flex justify-content-center align-items-center flex-wrap py-5">
                <DiaCalendario isMidnight={isMidnight} label="DÍAS" />

                <div style={{ fontSize: "2.5rem", color: "#111", alignSelf: "center", marginTop: "-30px" }}>:</div>

                <TimeBlock value={hours} label="HORAS" />
                <div style={{ fontSize: "2.5rem", color: "#111", alignSelf: "center", marginTop: "-30px" }}>:</div>

                <TimeBlock value={minutes} label="MINUTOS" />
                <div style={{ fontSize: "2.5rem", color: "#111", alignSelf: "center", marginTop: "-30px" }}>:</div>

                <TimeBlock value={seconds} label="SEGUNDOS" />
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