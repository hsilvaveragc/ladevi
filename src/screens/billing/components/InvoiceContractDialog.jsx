import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SaveButton, DangerButton } from 'shared/components/Buttons';
import InputSelectFieldSimple from 'shared/components/InputSelectFieldSimple';
import InputTextAreaFieldSimple from 'shared/components/InputTextAreaFieldSimple';
import { formatCurrency } from 'shared/utils/index';

import { CONSTANTS } from '../constants';
import { hideInvoiceDialog, sendToXubioInit } from '../actionCreators';
import {
  getShowInvoiceDialog,
  getCartItems,
  getCurrentXubioProducts,
  getCurrentXubioGenericProduct,
  getLoading,
  getSelectedClient,
  getCartTotal,
  getClientType,
} from '../reducer';

const InvoiceContractDialog = () => {
  const dispatch = useDispatch();
  const showDialog = useSelector(getShowInvoiceDialog);
  const cartItems = useSelector(getCartItems);
  const loading = useSelector(getLoading);
  const selectedClient = useSelector(getSelectedClient);
  const cartTotal = useSelector(getCartTotal);
  const clientType = useSelector(getClientType);
  const xubioProducts = useSelector(getCurrentXubioProducts);
  const xubioGenericProduct = useSelector(getCurrentXubioGenericProduct);

  const [invoiceMode, setInvoiceMode] = useState('separate');
  const [consolidatedXubioProductCode, setConsolidatedXubioProductCode] =
    useState('');
  const [globalObservations, setGlobalObservations] = useState('');

  // Obtener productos únicos de los contratos para opciones de consolidación
  const getUniqueContractProducts = () => {
    const contractProducts = new Set();
    if (cartItems) {
      cartItems.forEach((cartItem) => {
        contractProducts.add(cartItem.entityItems[0].xubioProductCode);
      });
    }
    return Array.from(contractProducts);
  };

  // Generar opciones para consolidación
  const getConsolidationOptions = () => {
    const options = [xubioGenericProduct]; //Inicializar con pauta plataforma;

    // Agregar productos únicos de los  contrato
    const uniqueProductCodes = getUniqueContractProducts();
    uniqueProductCodes.forEach((productCode) => {
      const product = xubioProducts.find((p) => p.code === productCode);
      if (product) {
        options.push(product);
      }
    });
    return options;
  };

  const cartCurrency =
    cartItems && cartItems.length > 0 ? cartItems[0].currencyName : null;

  // Contar la cantidad total de items individuales
  const getTotalItemsCount = () => {
    let count = 0;
    cartItems.forEach((cartItem) => {
      count += cartItem.entityItems.length;
    });
    return count;
  };

  const totalItemsCount = getTotalItemsCount();

  // Reset form when dialog opens
  useEffect(() => {
    if (showDialog) {
      setInvoiceMode('separate');
      setConsolidatedXubioProductCode('');
      setGlobalObservations('');
    }
  }, [showDialog]);

  useEffect(() => {
    if (cartItems && showDialog) {
      if (cartItems.length === 1) {
        setGlobalObservations(`Contrato: ${cartItems[0].name}`);
      }
    }
  }, [cartItems, showDialog]);

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

  const handleGlobalObservationsChange = (e) => {
    setGlobalObservations(e.target.value);
  };

  const handleSendToXubio = () => {
    if (
      invoiceMode === 'consolidated' &&
      totalItemsCount > 1 &&
      !consolidatedXubioProductCode
    ) {
      alert('Debe seleccionar un producto para la facturación consolidada');
      return;
    }

    const effectiveMode = totalItemsCount === 1 ? 'separate' : invoiceMode;

    const invoiceData = {
      clientId: selectedClient.id,
      globalObservations,
      entityType: CONSTANTS.CONTRACT_CODE,
      isConsolidated: effectiveMode === 'consolidated',
    };

    if (effectiveMode === 'consolidated') {
      // Modo consolidado
      let consolidatedObservations = '';
      let totalQuantity = 0;
      let totalAmount = 0;
      let totalTaxes = 0;
      const consolidatedIds = [];

      cartItems.forEach((cartItem) => {
        if (cartItem.entityItems) {
          cartItem.entityItems.forEach((entityItem) => {
            consolidatedObservations += `* ${entityItem.quantity} ${entityItem.productAdvertisingSpaceName}\n`;
            totalQuantity += entityItem.quantity;
            totalAmount += entityItem.total;
            totalTaxes += entityItem.totalTaxes || 0;
            consolidatedIds.push(entityItem.id);
          });
        }
      });

      invoiceData.items = [
        {
          xubioProductCode: consolidatedXubioProductCode,
          amount: totalAmount,
          totalTaxes: totalTaxes || 0,
          observations: consolidatedObservations.trim(),
          quantity: 1,
          price: totalAmount,
          consolidatedIds: consolidatedIds,
        },
      ];
    } else {
      // Modo separado
      const items = [];
      cartItems.forEach((cartItem) => {
        if (cartItem.entityItems) {
          cartItem.entityItems.forEach((entityItem) => {
            items.push({
              id: entityItem.id,
              xubioProductCode: entityItem.xubioProductCode,
              amount: entityItem.total,
              totalTaxes: entityItem.totalTaxes || 0,
              observations: `${
                cartItems.length > 1 ? cartItem.name + ' - ' : ''
              }${entityItem.observations || '-'}`,
              quantity: entityItem.quantity,
              price: entityItem.unitPriceWithDiscounts,
            });
          });
        }
      });
      invoiceData.items = items;
    }

    dispatch(sendToXubioInit(invoiceData));
  };

  const getConsolidatedObservations = () => {
    let observations = '';
    cartItems.forEach((cartItem) => {
      if (cartItem.entityItems) {
        cartItem.entityItems.forEach((entityItem) => {
          observations += `- ${entityItem.quantity} ${entityItem.productAdvertisingSpaceName}\n`;
        });
      }
    });
    return observations.trim();
  };

  const getInvoiceTableData = () => {
    const effectiveMode = totalItemsCount === 1 ? 'separate' : invoiceMode;

    if (effectiveMode === 'consolidated') {
      let xubioProduct = xubioProducts.find(
        (p) => p.code === consolidatedXubioProductCode
      );
      if (
        !xubioProduct &&
        consolidatedXubioProductCode == xubioGenericProduct.code
      ) {
        xubioProduct = xubioGenericProduct;
      }

      return [
        {
          article:
            xubioProduct?.name ||
            xubioProduct?.Name ||
            'Seleccione un producto',
          observations: getConsolidatedObservations(),
          quantity: 1,
          unitPriceWithDiscounts: cartTotal,
          price: cartTotal,
          currencyName: cartCurrency,
        },
      ];
    } else {
      const items = [];
      cartItems.forEach((cartItem) => {
        if (cartItem.entityItems) {
          cartItem.entityItems.forEach((entityItem) => {
            const xubioProduct = xubioProducts.find(
              (p) => (p.code || p.Code) === entityItem.xubioProductCode
            );
            items.push({
              article:
                xubioProduct?.name ||
                xubioProduct?.Name ||
                'Producto no especificado',
              observations: `${
                cartItems.length > 1 ? cartItem.name + ' - ' : ''
              }${entityItem.observations || '-'}`,
              quantity: entityItem.quantity,
              unitPriceWithDiscounts: entityItem.unitPriceWithDiscounts,
              price: entityItem.total,
              currencyName: cartItem.currencyName,
              contractName: cartItem.name,
            });
          });
        }
      });

      return items;
    }
  };

  const invoiceTableData = getInvoiceTableData();
  const consolidationOptions = getConsolidationOptions();

  if (!showDialog) {
    return null;
  }

  return (
    <Modal isOpen={showDialog} toggle={handleClose} size='xl'>
      <ModalHeader toggle={handleClose}>
        Facturar a {selectedClient?.brandName}
      </ModalHeader>
      <ModalBody>
        <div>
          {/* Opciones de facturación */}
          {totalItemsCount > 1 && (
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
                    Facturar espacios por separados
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
          {invoiceMode === 'consolidated' && totalItemsCount > 1 && (
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

          {/* Vista previa de la factura */}
          <div className='row'>
            <div className='col-md-12'>
              <p>
                <strong>Cliente:</strong> {selectedClient?.brandName} (
                {clientType === CONSTANTS.COMTUR_CODE
                  ? CONSTANTS.COMTUR_CODE
                  : CONSTANTS.ARGENTINA_CODE}
                )
              </p>

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
                    {invoiceTableData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.article}</td>
                        <td>
                          {totalItemsCount > 1 &&
                          invoiceMode === 'consolidated' ? (
                            <div
                              style={{
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.875rem',
                              }}
                            >
                              {item.observations}
                            </div>
                          ) : (
                            item.observations
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
                          {formatCurrency(item.price, item.currencyName || '$')}
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
                          ? formatCurrency(cartTotal, cartCurrency)
                          : formatCurrency(cartTotal, '$')}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones globales */}
        <div className='form-group'>
          <InputTextAreaFieldSimple
            labelText='Observaciones generales:'
            name='globalObservations'
            value={globalObservations}
            onChangeHandler={handleGlobalObservationsChange}
            placeholderText='Ingrese observaciones que se aplicarán a la factura...'
            rows={3}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <DangerButton onClickHandler={handleClose} disabled={loading}>
          Cancelar
        </DangerButton>
        <SaveButton
          onClickHandler={handleSendToXubio}
          disabled={
            loading ||
            (invoiceMode === 'consolidated' &&
              totalItemsCount > 1 &&
              !consolidatedXubioProductCode)
          }
        >
          {loading ? (
            <>
              <span
                className='spinner-border spinner-border-sm me-2'
                role='status'
              />
              Procesando...
            </>
          ) : (
            'Generar factura en Xubio'
          )}
        </SaveButton>
      </ModalFooter>
    </Modal>
  );
};

export default InvoiceContractDialog;
