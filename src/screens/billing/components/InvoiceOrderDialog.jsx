import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SaveButton, DangerButton } from 'shared/components/Buttons';
import InputSelectFieldSimple from 'shared/components/InputSelectFieldSimple';
import InputTextAreaFieldSimple from 'shared/components/InputTextAreaFieldSimple';
import { formatCurrency } from 'shared/utils/index';

import { CONSTANTS } from '../constants';
import { hideInvoiceDialog, sendMultipleToXubioInit } from '../actionCreators';
import {
  getShowInvoiceDialog,
  getCartItems,
  getCurrentXubioProducts,
  getCurrentXubioGenericProduct,
  getLoading,
} from '../reducer';

const InvoiceOrderDialog = () => {
  const dispatch = useDispatch();
  const showDialog = useSelector(getShowInvoiceDialog);
  const cartItems = useSelector(getCartItems);
  const loading = useSelector(getLoading);
  const xubioProducts = useSelector(getCurrentXubioProducts);
  const xubioGenericProduct = useSelector(getCurrentXubioGenericProduct);

  const [invoiceMode, setInvoiceMode] = useState('separate');
  const [consolidatedXubioProductCode, setConsolidatedXubioProductCode] =
    useState('');
  const [groupedByClient, setGroupedByClient] = useState({});

  // Agrupar items por cliente cuando es flujo de ediciones
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const grouped = {};
      cartItems.forEach((item) => {
        const clientKey = `${item.clientId}_${item.clientName}`;
        const xubioProduct = xubioProducts.find(
          (p) => (p.code || p.Code) === item.xubioProductCode
        );
        if (!grouped[clientKey]) {
          grouped[clientKey] = {
            clientId: item.clientId,
            clientName: item.clientName,
            items: [],
            totals: { amount: 0, quantity: 0 },
            invoiceObservations: '',
          };
        }
        item = {
          article: xubioProduct.name,
          ...item,
        };
        grouped[clientKey].items.push(item);
        grouped[clientKey].totals.amount += item.amount || item.total || 0;
        grouped[clientKey].totals.quantity += item.quantity || 1;
      });
      setGroupedByClient(grouped);
    }
  }, [cartItems]);

  // Generar opciones para consolidación
  const getConsolidationOptions = () => {
    const options = [xubioGenericProduct]; //Inicializar con pauta plataforma;
    if (cartItems && cartItems.length > 0) {
      const product = xubioProducts.find(
        (p) => p.code === cartItems[0].xubioProductCode
      );
      if (product) {
        options.push(product);
      }
    }
    return options;
  };

  const cartCurrency =
    cartItems && cartItems.length > 0 ? cartItems[0].currencyName : null;

  // Contar la cantidad total de items individuales
  const getTotalItemsCountByContractCart = () => {
    let count = 0;
    cartItems.forEach((cartItem) => {
      if (cartItem.type === CONSTANTS.CONTRACT_CODE && cartItem.entityItems) {
        count += cartItem.entityItems.length;
      } else if (cartItem.type === CONSTANTS.ORDER_CODE) {
        count += 1;
      }
    });
    return count;
  };

  const totalItemsCountByContractCart = getTotalItemsCountByContractCart();
  const someMoreOneItemInOrderCart = Object.values(groupedByClient).some(
    (clientGroup) => clientGroup.items.length > 1
  );

  // Reset form when dialog opens
  useEffect(() => {
    if (showDialog) {
      setInvoiceMode('separate');
      setConsolidatedXubioProductCode('');
    }
  }, [showDialog]);

  const handleClose = () => {
    dispatch(hideInvoiceDialog());
  };

  const handleInvoiceModeChange = (e) => {
    setInvoiceMode(e.target.value);
    if (e.target.value === 'separate') {
      setConsolidatedXubioProductCode('');
    }
  };

  const handleXubioProductChange = (product) => {
    setConsolidatedXubioProductCode(product.code || product.Code);
  };

  const handleClientObservationsChange = (clientKey, value) => {
    setGroupedByClient((prev) => ({
      ...prev,
      [clientKey]: {
        ...prev[clientKey],
        invoiceObservations: value,
      },
    }));
  };

  const handleSendToXubio = () => {
    // Facturación múltiple
    const invoicesData = Object.values(groupedByClient).map((clientGroup) => {
      const items = clientGroup.items.map((item) => ({
        id: item.id,
        xubioProductCode: item.xubioProductCode,
        amount: item.amount || item.total,
        totalTaxes: item.totalTaxes || 0,
        observations: item.observations || item.description,
        quantity: item.quantity || 1,
        price: (item.amount || item.total) / (item.quantity || 1),
        unitPriceWithDiscounts: item.unitPriceWithDiscounts,
      }));

      return {
        clientId: clientGroup.clientId,
        globalObservations: clientGroup.invoiceObservations || '',
        entityType: CONSTANTS.ORDER_CODE,
        isConsolidated: false,
        items: items,
      };
    });

    dispatch(sendMultipleToXubioInit(invoicesData));
  };

  const getInvoiceTableData = () => {
    const effectiveMode =
      someMoreOneItemInOrderCart === 1 ? 'separate' : invoiceMode;

    if (effectiveMode === 'consolidated') {
      // Para órdenes consolidadas por cliente
      return Object.values(groupedByClient).map((clientGroup) => {
        const xubioProduct = xubioProducts.find(
          (p) => p.code === consolidatedXubioProductCode
        );

        const amount = getConsolidatedAmountForClient(clientGroup);

        return {
          clientId: clientGroup.clientId,
          clientName: clientGroup.clientName,
          totals: clientGroup.totals,
          items: [
            {
              article:
                xubioProduct?.name ||
                xubioProduct?.Name ||
                'Producto no especificado',
              description: getConsolidatedObservationsForClient(clientGroup),
              amount: amount,
              unitPriceWithDiscounts: amount,
              quantity: 1,
              currencyName: cartCurrency,
            },
          ],
        };
      });
    } else {
      return groupedByClient;
    }
  };

  const getConsolidatedObservationsForClient = (clientGroup) => {
    return clientGroup.items
      .map((item) => `* ${item.quantity} ${item.productAdvertisingSpaceName}`)
      .join('\n');
  };

  const getConsolidatedAmountForClient = (clientGroup) => {
    return clientGroup.items.reduce(
      (total, item) => total + (item.amount || 0),
      0
    );
  };

  const invoiceTableData = getInvoiceTableData();
  const consolidationOptions = getConsolidationOptions();

  if (!showDialog) {
    return null;
  }

  return (
    <Modal isOpen={showDialog} toggle={handleClose} size='xl'>
      <ModalHeader toggle={handleClose}>
        Resumen de facturación por edición
      </ModalHeader>
      <ModalBody>
        <div className='alert alert-info'>
          Se generarán {Object.keys(groupedByClient).length} facturas, una por
          cada cliente.
        </div>

        <div>
          {/* Opciones de facturación */}
          {someMoreOneItemInOrderCart && (
            <div className='form-group mb-4'>
              <label className='form-label'>
                <strong>Método de facturación:</strong>
              </label>
              <div className='d-flex'>
                <div className='form-check mr-5'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='invoiceMode'
                    id='separate'
                    value='separate'
                    checked={invoiceMode === 'separate'}
                    onChange={handleInvoiceModeChange}
                  />
                  <label className='form-check-label' htmlFor='separate'>
                    Facturar ordenes por separados
                  </label>
                </div>
                <div className='form-check ms-4'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='invoiceMode'
                    id='consolidated'
                    value='consolidated'
                    checked={invoiceMode === 'consolidated'}
                    onChange={handleInvoiceModeChange}
                  />
                  <label className='form-check-label' htmlFor='consolidated'>
                    Facturar todo junto (consolidado)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Selección de producto para consolidación */}
          {invoiceMode === 'consolidated' && someMoreOneItemInOrderCart && (
            <div className='form-group mb-4'>
              <label className='form-label'>
                <strong>Producto Xubio para facturación consolidada:</strong>
              </label>
              {consolidationOptions.length > 0 ? (
                <InputSelectFieldSimple
                  labelText={''}
                  name='xubioProduct'
                  options={consolidationOptions}
                  value={consolidatedXubioProductCode}
                  onChangeHandler={handleXubioProductChange}
                  getOptionLabel={(option) => option.name || option.Name}
                  getOptionValue={(option) => option.code || option.Code}
                  placeholderText='Seleccione un producto...'
                />
              ) : (
                <div className='alert alert-warning'>
                  No se encontraron productos disponibles para consolidación
                </div>
              )}
            </div>
          )}

          {/* Contenido para flujo de ediciones */}
          {Object.values(invoiceTableData).map((clientGroup, index) => (
            <div key={index} className='card mb-3'>
              <div className='card-header'>
                <h6 className='mb-0'>{clientGroup.clientName}</h6>
              </div>
              <div className='card-body'>
                <div className='table-responsive mt-3'>
                  <table className='table table-sm table-bordered'>
                    <thead className='table-dark'>
                      <tr>
                        <th style={{ width: '20%' }} className='text-center'>
                          PRODUCTO
                        </th>
                        <th style={{ width: '30%' }} className='text-center'>
                          OBSERVACIONES
                        </th>
                        <th style={{ width: '10%' }} className='text-center'>
                          CANTIDAD
                        </th>
                        <th style={{ width: '20%' }} className='text-center'>
                          PRECIO
                        </th>
                        <th style={{ width: '20%' }} className='text-center'>
                          IMPORTE
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientGroup.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.article}</td>
                          <td>
                            {totalItemsCountByContractCart > 1 &&
                            invoiceMode === 'consolidated' ? (
                              <div
                                style={{
                                  whiteSpace: 'pre-wrap',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {item.description}
                              </div>
                            ) : (
                              item.description
                            )}
                          </td>
                          <td className='text-center'>{item.quantity}</td>
                          <td className='text-end'>
                            {formatCurrency(
                              item.unitPriceWithDiscounts,
                              item.currencyName || '$'
                            )}
                          </td>
                          <td className='text-end'>
                            {formatCurrency(
                              item.amount,
                              item.currencyName || '$'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className='table-light'>
                      <tr>
                        <th colSpan='4' className='text-end'>
                          Total a facturar:
                        </th>
                        <th className='text-end'>
                          {cartCurrency
                            ? formatCurrency(
                                clientGroup.totals.amount,
                                cartCurrency
                              )
                            : formatCurrency(clientGroup.totals.amount, '$')}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Observaciones específicas por cliente */}
                <div className='form-group mt-3'>
                  <InputTextAreaFieldSimple
                    labelText='Observaciones generales:'
                    name={`observations_${`${clientGroup.clientId}_${clientGroup.clientName}`}`}
                    value={clientGroup.invoiceObservations || ''}
                    onChangeHandler={(e) =>
                      handleClientObservationsChange(
                        `${clientGroup.clientId}_${clientGroup.clientName}`,
                        e.target.value
                      )
                    }
                    placeholderText={`Observaciones específicas para la factura de ${clientGroup.clientName}...`}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <DangerButton onClickHandler={handleClose} disabled={loading}>
          Cancelar
        </DangerButton>
        <SaveButton onClickHandler={handleSendToXubio} disabled={loading}>
          {loading ? (
            <>
              <span
                className='spinner-border spinner-border-sm me-2'
                role='status'
              />
              Procesando...
            </>
          ) : (
            `Generar ${Object.keys(groupedByClient).length} facturas en Xubio`
          )}
        </SaveButton>
      </ModalFooter>
    </Modal>
  );
};

export default InvoiceOrderDialog;
