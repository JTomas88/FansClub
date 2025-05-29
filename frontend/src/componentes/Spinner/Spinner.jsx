import React from "react";
import styles from "./spinner.module.css";

const Spinner = () => {
    return (
        <div className={styles.spinnerWrapper}>
            <div className={styles.loader5}>
                <div className={styles["spinner-container-B"]}>
                    <div className={styles["spinner-3"]}>
                        {/* Cargando... */}
                        <div className={styles.side1}></div>
                        <div className={styles.side2}></div>
                        <div className={styles.side3}></div>
                        <div className={styles["spinner-container-B"]}>
                            <div className={styles["spinner-3"]}>
                                <div className={styles.side1}></div>
                                <div className={styles.side2}></div>
                                <div className={styles.side3}></div>
                                <div className={styles["spinner-container-B"]}>
                                    <div className={styles["spinner-3"]}>
                                        <div className={styles.side1}></div>
                                        <div className={styles.side2}></div>
                                        <div className={styles.side3}></div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        Cargando....
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Spinner;
