import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../store/AppContext";
import * as THREE from 'three';
import styles from "./agendaconciertos.module.css";
import Spinner from "../Spinner/Spinner";

export const AgendaConciertos = () => {
    const { store, actions } = useContext(Context);
    const mountRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await actions.admin_obtenereventos();
            setIsLoading(false);
        };

        fetchData();
    }, []);
    const formateoFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES', {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <>
            <h2 className={`titulo_movil ${styles.titulo}`}>Próximos conciertos</h2>

            <div className={`container mt-5 ${styles.fondo}`}>
                <div className={styles.tablaResponsiva}>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <table className={`table table-dark text-center ${styles.tabla}`}>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Población</th>
                                    <th>Provincia</th>
                                    <th>Lugar</th>
                                    <th>Hora</th>
                                    <th>Venta de entradas</th>
                                    <th>Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(store.eventos) ? store.eventos : []).map(
                                    (evento, index) => (
                                        <tr key={index} className={styles.tableRow}>
                                            <td>{formateoFecha(evento.evFecha)}</td>
                                            <td>{evento.evPoblacion}</td>
                                            <td>{evento.evProvincia}</td>
                                            <td>{evento.evLugar}</td>
                                            <td>{evento.evHora}</td>
                                            <td>
                                                {evento.evEntradas ? (
                                                    <a
                                                        style={{ color: "white" }}
                                                        href={evento.evEntradas}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Clicka aquí para comprar las entradas!
                                                    </a>
                                                ) : (
                                                    "No disponible"
                                                )}
                                            </td>
                                            <td>{evento.evObservaciones}</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};
