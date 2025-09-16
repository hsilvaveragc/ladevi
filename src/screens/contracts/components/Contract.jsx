import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { Formik, Form } from 'formik';
import classnames from 'classnames';
import { equals } from 'ramda';
import { toast } from 'react-toastify';

import useUser from 'shared/security/useUser';

import { getValidationSchema } from '../validationSchemas';

import GeneralForm from './GeneralForm';
import PaychecksForm from './PaychecksForm';
import PublicationsForm from './PublicationsForm';
import HistoryForm from './HistoryForm';
import {
  GetInitValuesInAddMode,
  GetInitValuesIsDuplicate,
  GetInitValuesIsEditMode,
} from './helper';

const Contract = ({
  selectedItem,
  addMode,
  editMode,
  deleteMode,
  availableSalesmens,
  availableProducts,
  availableSpaceTypes,
  availableSpaceLocations,
  availableClients,
  availableCountries,
  saveHandler,
  getProductEditionsHandler,
  availableEditions,
  getSpaceTypesAvailable,
  getSpaceLocationsAvailable,
  availableSpaceLocationsForOrder,
  availableSpaceTypesForOrder,
  addOrderHandler,
  editOrderHandler,
  deleteOrderHandler,
  availableCurrencies,
  availableEuroParities,
  errors,
  getClientsWithBalance,
  closeHandler,
  filtros,
  loading,
  duplicateContractHandler,
  formikPropsDuplicateHandler,
  formikPropsDuplicate,
}) => {
  const { userRol } = useUser();
  const [historicalData, setHistoricalData] = useState(
    addMode ? [] : selectedItem.contractHistoricals
  );

  const initValuesForm = addMode
    ? formikPropsDuplicate
      ? GetInitValuesIsDuplicate(
          availableClients,
          availableSpaceLocations,
          availableSpaceTypes,
          availableCurrencies,
          availableEuroParities,
          selectedItem,
          formikPropsDuplicate
        )
      : GetInitValuesInAddMode()
    : GetInitValuesIsEditMode(
        availableClients,
        availableProducts,
        availableSpaceLocations,
        availableSpaceTypes,
        selectedItem
      );

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initValuesForm}
      enableReinitialize={false}
      validationSchema={getValidationSchema()}
      onSubmit={(values) => {
        if (loading) {
          return;
        }

        for (let i = 0; i < values.soldSpaces.length; i++) {
          const totalSP = parseFloat(
            values.soldSpaces[i].total.split('.').join('').replace(',', '.')
          );
          if (totalSP < 0) {
            toast.error('La cantidad de descuentos no puede ser mayor al 100%');
            return;
          }
          if (editMode) {
            if (values.soldSpaces[i].quantity < values.quantityOP) {
              toast.error(
                'La cantidad no puede ser menor a la cantidad de órdenes publicadas'
              );
              return;
            }
          }
        }

        // if (values.noParity) {
        //   toast.error(
        //     "No hay paridad disponible para el producto seleccionado"
        //   );
        // } else {
        saveHandler({
          ...values,
          searchFilters: filtros,
        });
        // }
      }}
    >
      {(formikProps) => (
        // <Form autoComplete="off">
        <>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: equals(formikProps.values.activeTab, 1),
                })}
                onClick={() => formikProps.setFieldValue('activeTab', 1)}
              >
                General
              </NavLink>
            </NavItem>
            <NavItem
              style={{
                display:
                  formikProps.values.paymentMethodId === 1
                    ? 'inline-block'
                    : 'none',
              }}
            >
              <NavLink
                className={classnames({
                  active: equals(formikProps.values.activeTab, 2),
                })}
                onClick={() => formikProps.setFieldValue('activeTab', 2)}
              >
                Cheques
              </NavLink>
            </NavItem>
            <NavItem
              style={{
                display: !addMode ? 'inline-block' : 'none',
              }}
            >
              <NavLink
                className={classnames({
                  active: equals(formikProps.values.activeTab, 3),
                })}
                onClick={() => formikProps.setFieldValue('activeTab', 3)}
              >
                Publicaciones
              </NavLink>
            </NavItem>
            <NavItem
              style={{
                display: !addMode ? 'inline-block' : 'none',
              }}
            >
              <NavLink
                className={classnames({
                  active: equals(formikProps.values.activeTab, 4),
                })}
                onClick={() => formikProps.setFieldValue('activeTab', 4)}
              >
                Historial
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={formikProps.values.activeTab}>
            <TabPane tabId={1}>
              <GeneralForm
                addMode={addMode}
                editMode={editMode}
                deleteMode={deleteMode}
                availableSalesmens={availableSalesmens}
                availableProducts={availableProducts}
                availableSpaceTypes={
                  addMode
                    ? availableSpaceTypes.filter(
                        (x) =>
                          x.show !== undefined &&
                          x.show !== null &&
                          x.show === true
                      )
                    : availableSpaceTypes
                }
                availableSpaceLocations={availableSpaceLocations}
                availableClients={availableClients}
                availableCountries={availableCountries}
                errors={errors}
                saveHandler={saveHandler}
                closeHandler={closeHandler}
                formikProps={formikProps}
                isSeller={userRol.isSeller}
                availableCurrencies={availableCurrencies}
                availableEuroParities={availableEuroParities}
                selectedItem={selectedItem}
                loading={loading}
                duplicateContractHandler={duplicateContractHandler}
                formikPropsDuplicate={formikPropsDuplicate}
                formikPropsDuplicateHandler={formikPropsDuplicateHandler}
                filters={filtros}
              ></GeneralForm>
            </TabPane>
            <TabPane tabId={2}>
              <PaychecksForm
                formikProps={formikProps}
                availableProducts={availableProducts}
                errors={errors}
                editMode={editMode}
              ></PaychecksForm>
            </TabPane>
            <TabPane tabId={3}>
              <PublicationsForm
                availableOrders={addMode ? [] : selectedItem.publishingOrders}
                formikProps={formikProps}
                availableProducts={availableProducts}
                availableClients={availableClients}
                availableSalesmens={availableSalesmens}
                getProductEditionsHandler={getProductEditionsHandler}
                availableEditions={availableEditions}
                getSpaceTypesAvailable={getSpaceTypesAvailable}
                getSpaceLocationsAvailable={getSpaceLocationsAvailable}
                availableSpaceLocationsForOrder={
                  availableSpaceLocationsForOrder
                }
                availableSpaceTypesForOrder={availableSpaceTypesForOrder}
                addOrderHandler={addOrderHandler}
                editOrderHandler={editOrderHandler}
                deleteOrderHandler={deleteOrderHandler}
                getClientsWithBalance={getClientsWithBalance}
                updateHistorial={setHistoricalData}
              />
            </TabPane>
            <TabPane tabId={4}>
              <HistoryForm historicalData={historicalData} />
            </TabPane>
          </TabContent>
        </>
        /* </Form> */
      )}
    </Formik>
  );
};

export default Contract;
