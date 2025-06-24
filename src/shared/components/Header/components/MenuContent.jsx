import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MenuContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0f609b;
  a {
    padding: 1rem;
    color: #fff;
    &:hover {
      background-color: #186faf;
      text-decoration: none;
    }
  }
`;

export default function MenuContent({ menuToggler }) {
  const userRole = localStorage.getItem("loggedUser");
  const isAdmin = userRole == "Administrador";
  const isSeller =
    userRole == "Vendedor Nacional" || userRole == "Vendedor COMTUR";

  return (
    <MenuContentContainer>
      <Link to="/" onClick={menuToggler}>
        Home
      </Link>
      <Link to="/clientes" onClick={menuToggler}>
        Clientes
      </Link>
      <Link to="/contratos" onClick={menuToggler}>
        Contratos
      </Link>
      <Link to="/ordenes" onClick={menuToggler}>
        Órdenes de Publicación
      </Link>
      <Link to="/reportes" onClick={menuToggler}>
        Reportes
      </Link>
      {isAdmin && (
        <>
          <Link to="/usuarios" onClick={menuToggler}>
            Usuarios
          </Link>
          <Link to="/auditoria">Auditoría</Link>
          <Link to="/configuracion" onClick={menuToggler}>
            Configuración
          </Link>
        </>
      )}
    </MenuContentContainer>
  );
}
