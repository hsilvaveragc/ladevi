import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import useUser from "shared/security/useUser";
import espaciosIcon from "shared/images/icon-espacios.png";

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  .menu-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
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
export default function ReportsPage() {
  const { userRol } = useUser();

  return (
    <PageContainer>
      <div className="menu-container">
        {(userRol.isAdmin || userRol.isSupervisor) && (
          <Link to="/reportes/reportOPP">
            <img src={espaciosIcon} alt="Icono" />
            <span>Órdenes de publicación para producción</span>
          </Link>
        )}
        <Link to="/reportes/reportEPV">
          <img src={espaciosIcon} alt="Icono" />
          <span>Espacios publicados por vendedor</span>
        </Link>
        <Link
          to="/reportes/reportEPC"
          //to="#"
        >
          <img src={espaciosIcon} alt="Icono" />
          <span>Espacios publicados por cliente</span>
        </Link>
        <Link to="/reportes/reporteCPV">
          <img src={espaciosIcon} alt="Icono" />
          <span>Contratos pendientes por vendedor</span>
        </Link>
      </div>
    </PageContainer>
  );
}
