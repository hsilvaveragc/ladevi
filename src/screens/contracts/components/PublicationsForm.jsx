import React, { useState } from "react";
import styled from "styled-components";
import useUser from "shared/security/useUser";
import Table from "shared/components/Table";
import { SaveButton } from "shared/components/Buttons";
import Modal from "shared/components/Modal";
import { RemoveButton } from "shared/components/Buttons";
import Order from "../../orders/components/Form";
import ExcelExport from "./GeneralForm/ExcelExport";
import PdfExport from "./GeneralForm/PdfExport";

const PublicationsOrderContainer = styled.div`
  width: 60vw;
  display: flex;
  justify-content: top;
  flex-direction: column;
  width: 100%;
  > div {
    width: 100%;
  }
  > button {
    margin-top: 2rem;
  }
`;

export default function PublicationsForm(props) {
  const { userRol } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [ordenes, setOrdenes] = useState(props.availableOrders);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOP, setSelectedOP] = useState();

  const rowClickHandler = (e, item) => {
    setSelectedOP({ ...item });
    setShowEditModal(true);
  };

  const closeModal = () => setShowModal(false);
  const closeModalEdit = () => setShowEditModal(false);
  const closeModalDelete = () => setShowDeleteModal(false);

  const getProductAdvertisingSpaceIdsPublished = orders => {
    return Array.from(new Set(orders?.map(x => x.productAdvertisingSpaceId)));
  };

  const updateOrdenes = values => {
    setOrdenes([...ordenes, values]);

    const soldSpaceindex = props.formikProps.values.soldSpaces.findIndex(
      x => x.id === values.soldSpaceId
    );
    const soldSpace = props.formikProps.values.soldSpaces[soldSpaceindex];

    const newBalance = soldSpace.balance - values.quantity;

    props.formikProps.setFieldValue(
      `soldSpaces[${soldSpaceindex}].balance`,
      newBalance
    );

    props.formikProps.setFieldValue(
      `soldSpaces[${soldSpaceindex}].quantityOP`,
      parseInt(props.formikProps.values.quantityOP) + 1
    );
    props.formikProps.setFieldValue(
      "publishingOrdersCounter",
      props.formikProps.values.publishingOrdersCounter + 1
    );

    props.formikProps.setFieldValue(
      "productAdvertisingSpaceIdsPublished",
      getProductAdvertisingSpaceIdsPublished([...ordenes, values])
    );
  };

  const updateOrdenesEdit = values => {
    const orderIndex = ordenes.findIndex(x => x.id === values.id);
    const oldQuantity = ordenes[orderIndex].quantity;
    values.canDelete =
      !values.productEdition != null &&
      !values.productEdition.closed &&
      values.pageNumber == "";

    let orders = [
      ...ordenes.slice(0, orderIndex),
      {
        ...values,
      },
      ...ordenes.slice(orderIndex + 1),
    ];

    const soldSpaceIndex = props.formikProps.values.soldSpaces.findIndex(
      x => x.id === values.soldSpaceId
    );
    props.formikProps.setFieldValue(
      `soldSpaces[${soldSpaceIndex}].balance`,
      props.formikProps.values.soldSpaces[soldSpaceIndex].balance +
        oldQuantity -
        Number(values.quantity)
    );
    setOrdenes(orders);

    props.formikProps.setFieldValue(
      "productAdvertisingSpaceIdsPublished",
      getProductAdvertisingSpaceIdsPublished(orders)
    );
  };

  const updateOrdenesDelete = values => {
    var orders = ordenes.filter(order => order.id !== values.id);
    const soldSpaceIndex = props.formikProps.values.soldSpaces.findIndex(
      x => x.id === values.soldSpaceId
    );
    props.formikProps.setFieldValue("publishingOrdersCounter", orders.length);
    props.formikProps.setFieldValue(
      `soldSpaces[${soldSpaceIndex}].balance`,
      props.formikProps.values.soldSpaces[soldSpaceIndex].balance +
        values.quantity
    );
    setOrdenes(orders);

    props.formikProps.setFieldValue(
      "productAdvertisingSpaceIdsPublished",
      getProductAdvertisingSpaceIdsPublished(orders)
    );
  };

  const columns = [
    {
      Header: "Edición",
      accessor: "productEdition.name",
    },
    {
      Header: "Espacio",
      accessor: "productAdvertisingSpace.name",
    },
    {
      Header: "Ubicación",
      accessor: "advertisingSpaceLocationType.name",
    },
    {
      Header: "Cantidad",
      accessor: "quantity",
    },
    {
      Header: "Obs",
      accessor: "observations",
    },
    {
      Header: "Factura",
      accessor: "invoiceNumber",
    },
    {
      Header: "Borrar",
      accessor: "delete",
      Cell: row => {
        if (row.original.canDelete) {
          return (
            <RemoveButton
              onClickHandler={() => {
                setSelectedOP({ ...row.original });
                setShowDeleteModal(true);
              }}
            />
          );
        } else {
          return <div />;
        }
      },
    },
  ];

  return (
    <PublicationsOrderContainer>
      <Modal
        shouldClose={true}
        closeHandler={() => setShowModal(!showModal)}
        isOpen={showModal}
      >
        <Order
          addMode={true}
          errors={{}}
          isFromContract
          availableProducts={props.availableProducts}
          availableClients={props.availableClients}
          availableSalesmens={props.availableSalesmens}
          contract={props.formikProps.values}
          getProductEditionsHandler={props.getProductEditionsHandler}
          availableEditions={props.availableEditions}
          availableContracts={[props.formikProps.values]}
          availableSpaceTypes={props.availableSpaceTypesForOrder}
          availableSpaceLocations={props.availableSpaceLocationsForOrder}
          getSpaceTypesAvailableHandler={props.getSpaceTypesAvailable}
          getSpaceLocationsAvailableHandler={props.getSpaceLocationsAvailable}
          getClientsWithBalanceHandler={props.getClientsWithBalance}
          saveHandler={props.addOrderHandler}
          updateOrdenesHandler={updateOrdenes}
          closeModalFromContract={closeModal}
          closeHandler={closeModal}
          getClientsWithBalance={props.getClientsWithBalance}
          updateHistorial={props.updateHistorial}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={() => setShowEditModal(false)}
        isOpen={showEditModal}
      >
        <Order
          editMode={true}
          errors={{}}
          isFromContract
          selectedItem={selectedOP}
          availableProducts={props.availableProducts}
          availableClients={props.availableClients}
          availableSalesmens={props.availableSalesmens}
          contract={props.formikProps.values}
          getProductEditionsHandler={props.getProductEditionsHandler}
          availableEditions={props.availableEditions}
          availableContracts={[props.formikProps.values]}
          availableSpaceTypes={props.availableSpaceTypesForOrder}
          availableSpaceLocations={props.availableSpaceLocationsForOrder}
          getSpaceTypesAvailableHandler={props.getSpaceTypesAvailable}
          getSpaceLocationsAvailableHandler={props.getSpaceLocationsAvailable}
          getClientsWithBalanceHandler={props.getClientsWithBalance}
          saveHandler={props.editOrderHandler}
          updateOrdenesHandler={updateOrdenesEdit}
          closeModalFromContract={closeModalEdit}
          closeHandler={closeModalEdit}
          getClientsWithBalance={props.getClientsWithBalance}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={() => setShowDeleteModal(false)}
        isOpen={showDeleteModal}
      >
        <Order
          deleteMode={true}
          errors={{}}
          isFromContract
          selectedItem={selectedOP}
          availableProducts={props.availableProducts}
          availableClients={props.availableClients}
          availableSalesmens={props.availableSalesmens}
          contract={props.formikProps.values}
          getProductEditionsHandler={props.getProductEditionsHandler}
          availableEditions={props.availableEditions}
          availableContracts={[props.formikProps.values]}
          availableSpaceTypes={props.availableSpaceTypesForOrder}
          availableSpaceLocations={props.availableSpaceLocationsForOrder}
          getSpaceTypesAvailableHandler={props.getSpaceTypesAvailable}
          getSpaceLocationsAvailableHandler={props.getSpaceLocationsAvailable}
          getClientsWithBalanceHandler={props.getClientsWithBalance}
          deleteOrderHandlerFromContract={props.deleteOrderHandler}
          closeModalFromContract={closeModalDelete}
          updateOrdenesHandler={updateOrdenesDelete}
          closeHandler={closeModalDelete}
          getClientsWithBalance={props.getClientsWithBalance}
        />
      </Modal>
      {ordenes.length > 0 && (
        <>
          <div className="form-row">
            <div className="col-10"></div>
            <div
              className="col-2"
              style={{ textAlign: "end", paddingRight: 0 }}
            >
              <ExcelExport
                data={ordenes}
                availableClients={props.availableClients}
                clientId={props.formikProps.values.clientId}
                contractName={props.formikProps.values.name}
                availableSalesmens={props.availableSalesmens}
              />
              <PdfExport
                data={ordenes}
                availableProducts={props.availableProducts}
                productId={props.formikProps.values.productId}
                availableClients={props.availableClients}
                clientId={props.formikProps.values.clientId}
                contractName={props.formikProps.values.name}
                availableSalesmens={props.availableSalesmens}
              />
            </div>
          </div>
          <br />
        </>
      )}
      <div style={{ width: "100%" }}>
        <Table
          data={ordenes}
          columns={columns}
          showButton={false}
          loading={props.isLoading}
          rowClickHandler={rowClickHandler}
        ></Table>
      </div>
      {new Date(props.formikProps.values.end) >= new Date() &&
        (props.formikProps.values.billingConditionId !== 1 ||
          (props.formikProps.values.billingConditionId === 1 &&
            props.formikProps.values.invoiceNumber)) &&
        props.formikProps.values.productId &&
        props.formikProps.values.clientId &&
        props.formikProps.values.id &&
        props.formikProps.values.soldSpaces.findIndex(x => x.balance > 0) !==
          -1 && (
          <SaveButton onClickHandler={() => setShowModal(!showModal)}>
            Crear Publicación
          </SaveButton>
        )}
    </PublicationsOrderContainer>
  );
}
