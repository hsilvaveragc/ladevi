import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import productosIcon from "shared/images/icon-productos.png";
import edicionesIcon from "shared/images/icon-ediciones.png";
import contablesIcon from "shared/images/icon-contables.png";
import espaciosIcon from "shared/images/icon-espacios.png";
import monedaIcon from "shared/images/moneda.png";

const SettingsPageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  .menu-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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

export default function SettingsPage() {
  return (
    <SettingsPageContainer>
      <div className="menu-container">
        <Link to="/configuracion/espacios">
          <img src={espaciosIcon} alt="Icono" />
          <span>Tipos de Espacio</span>
        </Link>
        <Link to="/configuracion/productos">
          <img src={productosIcon} alt="Icono" />
          <span>Productos</span>
        </Link>
        <Link to="/configuracion/ediciones">
          <img src={edicionesIcon} alt="Icono" />
          <span>Ediciones</span>
        </Link>
        <Link to="/configuracion/contables">
          <img src={contablesIcon} alt="Icono" />
          <span>Campos Contables</span>
        </Link>
        <Link to="/configuracion/monedas">
          <img src={monedaIcon} alt="Icono" />
          <span>Monedas</span>
        </Link>
      </div>
    </SettingsPageContainer>
  );
}
