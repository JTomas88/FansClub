import React, { useContext, useEffect, useRef } from "react";
import { Context } from "../../store/appContext";
import * as THREE from 'three';
import styles from "./agendaconciertos.module.css";

export const AgendaConciertos = () => {
    const { store, actions } = useContext(Context);
    const mountRef = useRef(null);

    // Llamar admin_obtenereventos una sola vez
    useEffect(() => {
        actions.admin_obtenereventos(); // Llamada directa
    }, []); // Sin dependencias para ejecutarse solo una vez

    useEffect(() => {
        let camera, scene, renderer;
        let smokeParticles = [];
        const clock = new THREE.Clock();

        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(
                95,
                window.innerWidth / window.innerHeight,
                1,
                10000
            );
            camera.position.z = 1000;

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.height = '236px';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.zIndex = '-1';
            mountRef.current.appendChild(renderer.domElement);

            const smokeTexture = new THREE.TextureLoader().load(
                'https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png'
            );
            const smokeMaterial = new THREE.MeshLambertMaterial({
                color: 0x01dddd,
                map: smokeTexture,
                transparent: true,
            });
            const smokeGeo = new THREE.PlaneGeometry(300, 300);

            for (let p = 0; p < 150; p++) {
                const particle = new THREE.Mesh(smokeGeo, smokeMaterial);
                particle.position.set(
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                    Math.random() * 1000 - 100
                );
                particle.rotation.z = Math.random() * 360;
                scene.add(particle);
                smokeParticles.push(particle);
            }

            const light = new THREE.DirectionalLight(0xffffff,);
            light.position.set(0, -1, 1);
            scene.add(light);

            const animate = () => {
                requestAnimationFrame(animate);
                const delta = clock.getDelta();
                smokeParticles.forEach((particle) => {
                    particle.rotation.z += delta * 0.6;
                });
                renderer.render(scene, camera);
            };

            animate();
        };

        init();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
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
            <h2 className={styles.tit_agenda}>Próximos conciertos</h2>

            <div
                ref={mountRef}
                style={{ position: "relative", width: "100%", height: "40vh" }}
            >
                <div className="container mt-5">

                    <div className={styles.tablaResponsiva}>
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
                                            <td >
                                                {evento.evEntradas ? (
                                                    <a style={{ color: "white" }}
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
                    </div>
                </div>
            </div>
        </>

    );
};
