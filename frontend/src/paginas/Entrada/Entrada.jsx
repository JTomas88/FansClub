import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./entrada.css";

export const Entrada = () => {
  const navigate = useNavigate();
  const [isBlinking, setIsBlinking] = useState(false);
  const [isScalingOut, setIsScalingOut] = useState(false);

  useEffect(() => {
    const timerBlink = setTimeout(() => {
      setIsBlinking(true);
    }, 5000);

    const timerNavigate = setTimeout(() => {
      setIsScalingOut(true); 
      setTimeout(() => {
        navigate("/");
      }, 500); 
    }, 7000);

    return () => {
      clearTimeout(timerBlink);
      clearTimeout(timerNavigate);
    };
  }, [navigate]);

  return (
    <div className="entrada-overlay">
      <div className={`inner-box ${isScalingOut ? "scale-out-center" : ""}`}>
        <svg className="svg" viewBox="0 0 100 100">
          <path
            d="M 50 90 L 10 10"
            className="side"
            style={{ animationDelay: "0s" }}
          />
          <path
            d="M 10 10 L 90 10"
            className="side"
            style={{ animationDelay: "2s" }}
          />
          <path
            d="M 90 10 L 50 90"
            className="side"
            style={{ animationDelay: "4s" }}
          />
        </svg>
        <div className={`text ${isBlinking ? "blink-1" : ""}`}>
          CLUB DE FANS SIENNA
        </div>
      </div>
    </div>
  );
};
