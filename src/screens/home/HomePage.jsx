import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Footer from "shared/components/Footer";
import usuariosIcon from "shared/images/icon-usuarios.png";
import contratosIcon from "shared/images/icon-contratos.png";
import clientesIcon from "shared/images/icon-clientes.png";
import ordenesIcon from "shared/images/icon-ordenes.png";
import reportesIcon from "shared/images/icon-reportes.png";
import configuracionIcon from "shared/images/icon-configuracion.png";
import auditoriaIcon from "shared/images/auditoria.png";

export default function HomePage() {
  const userRole = localStorage.getItem("loggedUser");
  const isSeller =
    userRole == "Vendedor Nacional" || userRole == "Vendedor COMTUR";
  const isAdmin = userRole == "Administrador";

  /* ${isAdmin
    ? "1fr 1fr 1fr 1fr 1fr 1fr 1fr"
    : "1fr 1fr 1fr 1fr"
  }; */

  const HomePageContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    .menu-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;
      a {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #000;
        &:hover {
          text-decoration: none;
        }
        img {
          height: 5rem;
          width: 5rem;
        }
      }
    }
  `;

  return (
    <>
      <HomePageContainer>
        <div className="menu-container">
          <Link to="/clientes">
            <img src={clientesIcon} alt="Icono" />
            <span>Clientes</span>
          </Link>
          <Link to="/contratos">
            <img src={contratosIcon} alt="Icono" />
            <span>Contratos</span>
          </Link>
          <Link to="/ordenes">
            <img src={ordenesIcon} alt="Icono" />
            <span>Órdenes de Publicación</span>
          </Link>
          <Link to="/reportes">
            <img src={reportesIcon} alt="Icono" />
            <span>Reportes</span>
          </Link>
          {isAdmin && (
            <>
              <Link to="/usuarios">
                <img src={usuariosIcon} alt="Icono" />
                <span>Usuarios</span>
              </Link>
              <Link to="/auditoria">
                <img src={auditoriaIcon} alt="Icono" />
                <span>Auditoría</span>
              </Link>
              <Link to="/configuracion">
                <img src={configuracionIcon} alt="Icono" />
                <span>Configuración</span>
              </Link>
            </>
          )}
        </div>
      </HomePageContainer>
      <Footer />
    </>
  );
}
