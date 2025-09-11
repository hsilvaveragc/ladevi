import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { find, propEq } from 'ramda';

import Modal from '../../shared/components/Modal';
import Table from '../../shared/components/Table';
import { EditButton, RemoveButton } from '../../shared/components/Buttons';

import ProductsForm from './components/ProductsForm';
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

const ProductsPage = (props) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [params, setParams] = useState();

  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  const CountryCell = (cellProps) => {
    const countryObj = find(propEq('id', cellProps.value.id))(
      props.availableCountries
    );
    return countryObj.name;
  };
  const Cell = ({ original }) =>
    `${original.aliquotForSalesCommission.toLocaleString('pt-BR', {
      maximumFractionDigits: 2,
    })} %`;

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
      Header: 'Tipo de producto',
      accessor: 'productType.name',
    },
    {
      Header: 'País',
      accessor: 'country',
      Cell: CountryCell,
    },
    {
      Header: 'Alícuota para comisión (%)',
      accessor: 'aliquotForSalesCommission',
      Cell,
    },
    {
      Header: 'Borrar',
      filterable: false,
      Cell: (row) =>
        row.original.canDelete ? (
          <RemoveButton
            onClickHandler={() => {
              setSelectedItem({ ...row.original });
              props.actions.showDeleteModal();
            }}
          />
        ) : (
          <div />
        ),
    },
  ];

  return (
    <PageContainer>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showAddModal}
        isOpen={props.showAddModal}
      >
        <ProductsForm
          selectedItem={{}}
          productTypes={props.productTypes}
          availableCountries={props.availableCountries}
          availableAdsSpaceLocationType={props.availableAdsSpaceLocationType}
          xubioProducts={props.xubioProducts}
          xubioProductsComtur={props.xubioProductsComtur}
          saveHandler={props.actions.addProduct}
          addMode={true}
          errors={props.errors}
          closeHandler={props.actions.showAddModal}
          params={params}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showEditModal}
        isOpen={props.showEditModal}
      >
        <ProductsForm
          selectedItem={selectedItem}
          productTypes={props.productTypes}
          availableCountries={props.availableCountries}
          availableAdsSpaceLocationType={props.availableAdsSpaceLocationType}
          xubioProducts={props.xubioProducts}
          xubioProductsComtur={props.xubioProductsComtur}
          saveHandler={props.actions.editProduct}
          editMode={true}
          errors={props.errors}
          closeHandler={props.actions.showEditModal}
          params={params}
        />
      </Modal>
      <Modal
        shouldClose={true}
        closeHandler={props.actions.showDeleteModal}
        isOpen={props.showDeleteModal}
      >
        <ProductsForm
          selectedItem={selectedItem}
          productTypes={props.productTypes}
          availableCountries={props.availableCountries}
          availableAdsSpaceLocationType={props.availableAdsSpaceLocationType}
          xubioProducts={props.xubioProducts}
          xubioProductsComtur={props.xubioProductsComtur}
          addProductHandler={props.actions.addProduct}
          deleteMode={true}
          saveHandler={props.actions.deleteProduct}
          errors={props.errors}
          closeHandler={props.actions.showDeleteModal}
        />
      </Modal>
      <Filters
        availableCountries={props.availableCountries}
        availableProductTypes={props.productTypes}
        handleFilter={props.actions.filterProducts}
        handleResetFilters={props.actions.getAllProducts}
        handleChangeParams={setParams}
      />
      <div style={{ width: '100%' }}>
        <Table
          data={props.products}
          columns={columns}
          loading={props.isLoading}
          buttonHandler={props.actions.showAddModal}
          buttonText='Agregar Producto'
          showButton
          rowClickHandler={rowClickHandler}
        ></Table>
      </div>
    </PageContainer>
  );
};

export default ProductsPage;
