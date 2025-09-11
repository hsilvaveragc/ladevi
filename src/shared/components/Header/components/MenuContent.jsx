import { Link } from 'react-router-dom';
import styled from 'styled-components';

import useUser from 'shared/security/useUser';

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
  const { userRol } = useUser();

  return (
    <MenuContentContainer>
      <Link to='/' onClick={menuToggler}>
        Home
      </Link>
      <Link to='/clientes' onClick={menuToggler}>
        Clientes
      </Link>
      <Link to='/contratos' onClick={menuToggler}>
        Contratos
      </Link>
      <Link to='/ordenes' onClick={menuToggler}>
        Órdenes de Publicación
      </Link>
      <Link to='/produccion' onClick={menuToggler}>
        Producción
      </Link>
      <Link to='/facturacion' onClick={menuToggler}>
        Facturación
      </Link>
      <Link to='/reportes' onClick={menuToggler}>
        Reportes
      </Link>
      {userRol.isAdmin && (
        <>
          <Link to='/usuarios' onClick={menuToggler}>
            Usuarios
          </Link>
          <Link to='/auditoria'>Auditoría</Link>
          <Link to='/configuracion' onClick={menuToggler}>
            Configuración
          </Link>
        </>
      )}
    </MenuContentContainer>
  );
}
