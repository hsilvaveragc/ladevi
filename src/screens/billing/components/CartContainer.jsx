import { useSelector } from 'react-redux';

import { CONSTANTS } from '../constants';
import { getEntityType } from '../reducer';

import Cart from './Cart'; // Cart original para contratos
import CartForEditions from './CartForEditions'; // Nuevo cart para ediciones

/**
 * Componente contenedor que renderiza el carrito apropiado
 * según el tipo de entidad seleccionada (CONTRACTS vs EDITIONS/ORDERS)
 */
const CartContainer = () => {
  const entityType = useSelector(getEntityType);

  // Si el tipo de entidad es EDITIONS, usar el cart específico para ediciones
  // que agrupa las órdenes por cliente
  if (entityType === CONSTANTS.ORDERS_CODE) {
    return <CartForEditions />;
  }

  // Para CONTRACTS o cualquier otro caso, usar el cart original
  return <Cart />;
};

export default CartContainer;
