import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import styles from "./links.module.css"
import jumbo_links from "../../assets/imagenes_jumbotron/jumbo_links.png"
import { FaInstagram } from "react-icons/fa";
import { TbTriangleInverted } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaSpotify } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import Seo from "../../componentes/Seo/Seo";



export const Links = () => {
  return (
    <>
      <Seo
        title="Links | Sienna Fans"
        description="Accede a cualquier red del propio Sienna o del club de fans."
      />
      <Jumbotron
        imagenFondo={{
          backgroundImage: `url(${jumbo_links})`,
          backgroundPosition: "center 68%",
        }}
        subtitulo={"Sigo buscando al niño que solía brillar"}
        referencia={"home"}
      ></Jumbotron>

      <div className="container-fluid bg-black" style={{ height: "100vh" }}>
        <div className="row">
          {/* Columna para los links oficiales de Sienna */}
          <div className="col-12 col-md-6 order-0 order-md-1">
            <div className={`text-center ${styles.titulo}`}>
              PERFILES OFICIALES DE SIENNA
            </div>
            <div className="row mt-3">
              <div className="col d-flex flex-column align-items-center">
                <a href="https://www.siennaoficial.com" target="_blank" >
                  <TbTriangleInverted fontSize={"35"} color="#8f00ff" />
                </a>
                <p>Web Oficial</p>
              </div>
            </div>
            <div className="row">
              <div className="col d-flex flex-column align-items-center">
                <a
                  href="https://www.instagram.com/siennamusica/"
                  target="_blank"
                >
                  <FaInstagram fontSize={"30"} color="#8f00ff" />
                </a>
                <p>Instagram</p>
              </div>
              <div className="col d-flex flex-column align-items-center">
                <a
                  href="https://www.tiktok.com/@sienna.musica"
                  target="_blank"
                >
                  <FaTiktok fontSize={"30"} color="#8f00ff" />
                </a>
                <p>TikTok</p>
              </div>
            </div>

            <div className="row">
              <div className="col d-flex flex-column align-items-center">
                <a href="https://twitter.com/siennamusica" target="_blank">
                  <FaXTwitter fontSize={"30"} color="#8f00ff" />
                </a>
                <p>Twitter / X</p>
              </div>
              <div className="col d-flex flex-column align-items-center">
                <a
                  href="https://www.facebook.com/siennamusica"
                  target="_blank"
                >
                  <FaFacebook fontSize={"30"} color="#8f00ff" />
                </a>
                <p>Facebook</p>
              </div>
            </div>

            <div className="row">
              <div className="col d-flex flex-column align-items-center">
                <a href="https://youtube.com/@siennamusica" target="_blank">
                  <FaYoutube fontSize={"30"} color="#8f00ff" />
                </a>
                <p>Youtube</p>
              </div>
              <div className="col d-flex flex-column align-items-center">
                <a
                  href="https://open.spotify.com/intl-es/artist/4PSNWFX3rYscMdKRp59uYA?si=hZEyrlKYQcGZN6wTPZaoFg"
                  target="_blank"
                >
                  <FaSpotify fontSize={"30"} color="#8f00ff" />
                </a>
                <p>Spotify</p>
              </div>
            </div>
          </div>

          {/* Columna para los links del Club de Fans */}
          <div className="col-12 col-md-6 order-1 order-md-1 ">
            <div className="row">
              <div className={`text-center ${styles.titulo}`}>
                PERFILES DEL CLUB DE FANS
              </div>
              <div className="row mt-3">
                <div className="col d-flex flex-column align-items-center">
                  <a href="https://t.me/+meErawrgpUtmNmI8" target="_blank">
                    <FaTelegram fontSize={"30"} color="#8f00ff" />
                  </a>
                  <p>Grupo de Telegram SiennaCharts</p>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col d-flex flex-column align-items-center">
                  <a
                    href="https://www.instagram.com/siennacharts/"
                    target="_blank"
                  >
                    <FaInstagram fontSize={"30"} color="#8f00ff" />
                  </a>
                  <p>Instagram Team Sienna</p>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col d-flex flex-column align-items-center">
                  <a
                    href="https://www.tiktok.com/@sienna.charts"
                    target="_blank"
                  >
                    <FaTiktok fontSize={"30"} color="#8f00ff" />
                  </a>
                  <p>TikTok Sienna.Charts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}