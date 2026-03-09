import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./diacalendario.module.css";

export const DiaCalendario = ({ isMidnight, label }) => {
    return (
        <div className={styles.container}>
            <div className={styles.blocWrapper}>
                {/* HOJA 1: Siempre estática (Primer dígito) */}
                <div className={styles.perspective}>
                    <div className={`${styles.face} ${styles.front}`}>X</div>
                </div>

                {/* HOJA 2: La que hace la transición (Segundo dígito) */}
                <div className={styles.perspective}>
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={isMidnight ? "nuevo" : "actual"} // El cambio de key dispara la animación
                            initial={{ rotateX: 0, opacity: 1 }}
                            animate={{ rotateX: 0, opacity: 1 }}
                            exit={{
                                rotateX: -160, // Aumentamos el ángulo para que se note más
                                opacity: 0,
                                transition: {
                                    duration: 0.8,
                                    ease: [0.23, 1, 0.32, 1.2] // Efecto de "rebote" al levantarse
                                }
                            }}
                            style={{
                                originY: 0,
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                zIndex: isMidnight ? 5 : 10
                            }}
                            className={styles.face}
                        >
                            X
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            <span className={styles.label}>{label}</span>
        </div>
    );
};