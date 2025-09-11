import React, { useEffect } from 'react';
import styled from 'styled-components';

import Filters from './components/Filters';

import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { format } from 'date-fns';

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h2 {
    margin-bottom: 3rem;
  }
  .table .thead-light th {
    background-color: #003e6b;
    color: #ffffff;
  }
`;

export default function Page(props) {
  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  const customTotal = (from, to, size) => (
    <span
      className='react-bootstrap-table-pagination-total'
      style={{ marginLeft: '15px' }}
    >
      Mostrando {from} de {to} de {size} Resultados
    </span>
  );

  const columns = [
    {
      dataField: 'edicion',
      text: 'Edicion',
      headerStyle: () => ({ width: '20%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
      sort: true,
    },
    {
      dataField: 'salida',
      text: 'Salida',
      headerStyle: () => ({ width: '13%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
      formatter: (fecha) => (fecha ? format(fecha, 'DD/MM/YYYY') : ''),
      sort: true,
    },
    {
      dataField: 'tipoEspacio',
      text: 'Tipo Espacio',
      headerStyle: () => ({ width: '15%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
      sort: true,
    },
    {
      dataField: 'cantidad',
      text: 'Cantidad',
      headerStyle: () => ({ width: '15%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
      sort: true,
    },
    {
      dataField: 'moneda',
      text: 'Moneda',
      headerStyle: () => ({ width: '15%', fontSize: '12px' }),
      formatter: (total, row) => (total ? row.moneda : ''),
      style: () => ({ fontSize: '12px' }),
      sort: true,
    },
    {
      dataField: 'importe',
      text: 'Importe',
      headerStyle: () => ({ width: '15%', fontSize: '12px' }),
      formatter: (total, row) =>
        total
          ? total.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      style: () => ({ fontSize: '12px' }),
      sort: true,
    },
    {
      dataField: 'factura',
      text: 'Factura',
      headerStyle: () => ({ width: '15%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
      formatter: (cell, row) => `${row.billingCondition} ${cell}`,
      sort: true,
    },
    {
      dataField: 'numero',
      text: 'N°Contrato',
      headerStyle: () => ({ width: '10%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
      sort: true,
    },
    {
      dataField: 'contrato',
      text: 'Contrato',
      headerStyle: () => ({ width: '12%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
      sort: true,
    },
  ];
  const options = {
    // Tooltips botones de paginación
    prePageTitle: 'página previa',
    nextPageTitle: 'próxima página',
    firstPageTitle: 'primer página',
    lastPageTitle: 'última página',
    showTotal: true,
    paginationTotalRenderer: customTotal,
  };

  return (
    <PageContainer>
      <Filters
        availableProductTypes={props.availableProductTypes}
        availableProducts={props.availableProducts}
        availableEditions={props.availableEditions}
        availableSellers={props.availableSellers}
        availableClients={props.availableClients}
        handleFilter={props.actions.filterReport}
        getProductHandler={props.actions.getProductsByType}
        getProductEditionsHandler={props.actions.getProductEditionByProduct}
        clearFilters={props.actions.clearFilters}
        data={props.data}
        isLoadingAllClients={props.isLoadingAllClients}
        isLoadingProductTypes={props.isLoadingProductTypes}
        isLoadingSellers={props.isLoadingSellers}
        isLoadingProducts={props.isLoadingProducts}
        isLoadingProductEditions={props.isLoadingProductEditions}
      />

      {props.data.length > 0 && (
        <div style={{ margin: '15px 15px auto 15px' }}>
          <BootstrapTable
            keyField={new Date()}
            striped
            hover
            condensed
            bootstrap4
            headerClasses='thead-light'
            data={props.data}
            columns={columns}
            pagination={paginationFactory(options)}
          />
        </div>
      )}
    </PageContainer>
  );
}
