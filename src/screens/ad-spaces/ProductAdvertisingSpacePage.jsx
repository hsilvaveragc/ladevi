import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { find, propEq } from 'ramda';
import Modal from 'shared/components/Modal';
import Table from 'shared/components/Table';
import { EditButton, RemoveButton } from 'shared/components/Buttons';

import ProductAdvertisingSpaceForm from './components/ProductAdvertisingSpaceForm';
import Filters from './components/Filters';

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: top;
  align-items: center;
  flex-direction: column;
  padding: 50px 30px 0 30px;
  width: 100%;
  box-sizing: border-box;
`;

const ProductAdvertisingSpacePage = (props) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [params, setParams] = useState();

  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  const ProductCell = (cellProps) => {
    const productObj = find(propEq('id', cellProps.value))(
      props.productsAvailable
    );
    return productObj.name;
  };

  const rowClickHandler = (e, item) => {
    setSelectedItem({ ...item });
    props.actions.showEditModal();
  };

  const columns = [
    {
      Header: 'Nombre',
      accessor: 'name',
    },
    {
      Header: 'Pertenece a:',
      accessor: 'product.name',
    },
    {
      Header: 'Precio (U$S)',
      accessor: 'dollarPrice',
      Cell: (row) =>
        row.original.dollarPrice.toLocaleString('pt-BR', {
          maximumFractionDigits: 2,
        }),
    },
    {
      Header: 'Alto (cm)',
      accessor: 'height',
      Cell: (row) =>
        row.original.height.toLocaleString('pt-BR', {
          maximumFractionDigits: 2,
        }),
    },
    {
      Header: 'Ancho (cm)',
      accessor: 'width',
      Cell: (row) =>
        row.original.width.toLocaleString('pt-BR', {
          maximumFractionDigits: 2,
        }),
    },
    {
      Header: 'Mostrar en nuevos contratos',
      accessor: 'show',
      Cell: (row) => (row.original.show == true ? 'SI' : 'NO'),
    },
    {
      Header: 'Borrar',
      filterable: false,
      Cell: (row) => {
        return row.original.canDelete ? (
          <RemoveButton
            onClickHandler={() => {
              setSelectedItem({ ...row.original });
              props.actions.showDeleteModal();
            }}
          />
        ) : (
          <div />
        );
      },
    },
  ];
  return (
    <PageContainer>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showAddModal}
        isOpen={props.showAddModal}
      >
        <ProductAdvertisingSpaceForm
          selectedItem={{}}
          availableAdsSpaceLocationType={props.availableAdsSpaceLocationType}
          addMode={true}
          saveHandler={props.actions.addProductAdvertisingSpace}
          closeHandler={props.actions.showAddModal}
          productsAvailable={props.productsAvailable}
          errors={props.errors}
          params={params}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showEditModal}
        isOpen={props.showEditModal}
      >
        <ProductAdvertisingSpaceForm
          selectedItem={selectedItem}
          availableAdsSpaceLocationType={props.availableAdsSpaceLocationType}
          editMode={true}
          saveHandler={props.actions.editProductAdvertisingSpace}
          closeHandler={props.actions.showEditModal}
          productsAvailable={props.productsAvailable}
          errors={props.errors}
          params={params}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showDeleteModal}
        isOpen={props.showDeleteModal}
      >
        <ProductAdvertisingSpaceForm
          selectedItem={selectedItem}
          availableAdsSpaceLocationType={props.availableAdsSpaceLocationType}
          deleteMode={true}
          saveHandler={props.actions.deleteProductAdvertisingSpace}
          closeHandler={props.actions.showDeleteModal}
          productsAvailable={props.productsAvailable}
          errors={props.errors}
          params={params}
        />
      </Modal>
      <Filters
        availableProducts={props.productsAvailable}
        handleFilter={props.actions.filterProductAdvertisingSpace}
        handleResetFilters={props.actions.getAllProductAdvertisingSpaces}
        handleChangeParams={setParams}
      />
      <div style={{ width: '100%' }}>
        <Table
          data={props.productAdvertisingSpacesAvailable}
          columns={columns}
          buttonHandler={props.actions.showAddModal}
          buttonText='Agregar'
          loading={props.isLoading}
          showButton
          rowClickHandler={rowClickHandler}
        ></Table>
      </div>
    </PageContainer>
  );
};

export default ProductAdvertisingSpacePage;
