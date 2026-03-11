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
                            key={isMidnight ? "nuevo" : "actual"}
                            initial={{ rotateX: 90, opacity: 0 }}
                            animate={{
                                rotateX: 0,
                                opacity: 1,
                                transition: { duration: 0.8, ease: "easeOut" }
                            }}
                            exit={{
                                rotateX: -90,
                                opacity: 0,
                                transition: {
                                    duration: 0.8,
                                    ease: "easeIn"
                                }
                            }}
                            style={{
                                originY: 1,
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                zIndex: isMidnight ? 5 : 10
                            }}
                            className={styles.face}
                        >
                            X
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            <span className={styles.texto_reloj}>{label}</span>
        </div>
    );
};