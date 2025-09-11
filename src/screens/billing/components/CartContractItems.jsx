import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from 'shared/utils/index';

import { removeFromCart } from '../actionCreators';
import { getCartItems, getLoading } from '../reducer';

const CartContractItems = () => {
  const dispatch = useDispatch();

  const loading = useSelector(getLoading);
  const cartItems = useSelector(getCartItems);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  return (
    <div className='cart-items mb-3 flex-grow-1' style={{ overflowY: 'auto' }}>
      {cartItems.map((item) => (
        <div key={item.id} className='card mb-2'>
          <div className='card-body py-2 px-3'>
            <div className='d-flex flex-column'>
              {/* Cabecera */}
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <div>
                  <h6 className='mb-0'>{item.description}</h6>
                </div>
                <div className='font-weight-bold'>
                  {formatCurrency(item.amount, item.currencyName || '$')}
                </div>
              </div>

              {/* Detalles de los espacios publicitarios */}
              {item.entityItems && item.entityItems.length > 0 && (
                <div className='mb-2'>
                  {item.entityItems.map((entityItem, index) => (
                    <div
                      key={`${item.id}-entity-${entityItem.id}-${index}`}
                      className='border-start border-3 border-primary ps-3 mb-2'
                    >
                      <div className='d-flex justify-content-between align-items-start'>
                        <div>
                          <small className='text-muted'>
                            {`${entityItem.quantity} ${entityItem.productAdvertisingSpaceName} - ${entityItem.advertisingSpaceLocationTypeName}`}
                          </small>
                        </div>
                        <div>
                          <small className='text-muted'>
                            {formatCurrency(
                              entityItem.total,
                              item.currencyName || '$'
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className='d-flex justify-content-between'>
                <div className='mb-1'>
                  <small className='text-primary'>
                    <strong>
                      {item.entityItems.reduce(
                        (total, i) => total + i.quantity,
                        0
                      )}{' '}
                      Espacios
                    </strong>
                  </small>
                </div>
                <button
                  className='btn btn-sm btn-outline-danger'
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={loading}
                  title='Eliminar contrato del carrito'
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContractItems;
