import { useDispatch, useSelector } from 'react-redux';
import { SaveButton, DangerButton } from 'shared/components/Buttons';
import { formatCurrency } from 'shared/utils/index';

import { CONSTANTS } from '../constants';
import { clearCart, showInvoiceDialog } from '../actionCreators';
import {
  getLoading,
  getClientType,
  getEntityType,
  getCartItems,
  getCartTotal,
} from '../reducer';

import CartContractItems from './CartContractItems';
import CartOrderItems from './CartOrderItems';

const Cart = () => {
  const dispatch = useDispatch();

  const loading = useSelector(getLoading);
  const clientType = useSelector(getClientType);
  const entityType = useSelector(getEntityType);
  const cartItems = useSelector(getCartItems);
  const cartTotal = useSelector(getCartTotal);

  const getCartCurrency = () => {
    return cartItems.length > 0 ? cartItems[0].currencyName : '$';
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleProceedToInvoice = () => {
    dispatch(showInvoiceDialog());
  };

  const cartCurrency = getCartCurrency();
  return (
    <div
      className='card mb-4 sticky-top d-flex flex-column'
      style={{
        top: '1rem',
        height: 'calc(100vh - 2rem)',
        position: 'sticky',
      }}
    >
      <div className='card-header bg-primary text-white'>
        <h5 className='mb-0'>
          {entityType == CONSTANTS.CONTRACTS_CODE
            ? 'Contratos '
            : entityType == CONSTANTS.ORDERS_CODE
              ? 'Ordenes '
              : 'Items '}
          a facturar
        </h5>
        {clientType && (
          <small className='text-white-50'>
            Cliente{' '}
            {clientType === CONSTANTS.COMTUR_CODE
              ? CONSTANTS.COMTUR_CODE
              : CONSTANTS.ARGENTINA_CODE}
          </small>
        )}
      </div>
      <div
        className='card-body d-flex flex-column'
        style={{ overflow: 'hidden' }}
      >
        {cartItems.length === 0 ? (
          <p className='text-center text-muted flex-grow-1 d-flex align-items-center justify-content-center'>
            No hay
            {entityType == CONSTANTS.CONTRACTS_CODE
              ? ' contratos '
              : entityType == CONSTANTS.ORDERS_CODE
                ? ' ordenes '
                : ' items '}
            agregados
          </p>
        ) : (
          <div className='d-flex flex-column h-100'>
            {entityType === CONSTANTS.ORDERS_CODE ? (
              <CartOrderItems />
            ) : (
              <CartContractItems />
            )}

            <div className='border-top pt-3 mt-auto'>
              <div className='d-flex justify-content-between mb-3'>
                <h5>Total:</h5>
                <h5>{formatCurrency(cartTotal, cartCurrency)}</h5>
              </div>

              <div className='d-flex justify-content-between'>
                <DangerButton
                  onClickHandler={handleClearCart}
                  disabled={loading}
                >
                  Vaciar carrito
                </DangerButton>
                <SaveButton
                  onClickHandler={handleProceedToInvoice}
                  disabled={loading || cartItems.length === 0}
                >
                  Facturar
                  {entityType === CONSTANTS.ORDERS_CODE
                    ? ' ordenes'
                    : ' contratos'}
                </SaveButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
