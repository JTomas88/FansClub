import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Entrada = () => {
    const navigate = useNavigate();

    const containerStyle = {
        backgroundColor: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const svgStyle = {
        width: "30%",
        height: "auto",
    };

    const sideStyle = (delay) => ({
        fill: "none",
        stroke: "#8F00FF",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeDasharray: "100",
        strokeDashoffset: "100",
        animation: `draw-side 2s ease-out forwards ${delay}s, blur-fade 2s ease-out forwards ${delay}s`,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/home");
        }, 7000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={containerStyle}>
            <svg viewBox="0 0 100 100" style={svgStyle}>

                {/* Lado 1 */}
                <path
                    style={sideStyle(0)} // Sin retraso
                    d="M 50 90 L 10 10"
                />

                {/* Lado 2 */}
                <path
                    style={sideStyle(2)} // Retraso de 2s
                    d="M 10 10 L 90 10"
                />

                {/* Lado 3 */}
                <path
                    style={sideStyle(4)} // Retraso de 4s
                    d="M 90 10 L 50 90"
                />
            </svg>
            <style>
                {`
          /* Animación para el dibujo de cada lado */
          @keyframes draw-side {
            to {
              stroke-dashoffset: 0; /* Lado completamente visible */
            }
          }

          /* Animación del efecto de desenfoque */
          @keyframes blur-fade {
            0% {
              filter: url(#blur-effect);
              opacity: 0.7;
            }
            100% {
              filter: none;
              opacity: 1;
            }
          }
        `}
            </style>
        </div>
    );
};
