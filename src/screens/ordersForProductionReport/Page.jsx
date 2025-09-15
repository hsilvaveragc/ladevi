import React, { useEffect } from "react";
import styled from "styled-components";
// import Table from "shared/components/Table";
import Filters from "./components/Filters";
import "jspdf-autotable";

import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import Moment from "moment";

// import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
// import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

// const { SearchBar } = Search;

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
      className="react-bootstrap-table-pagination-total"
      style={{ marginLeft: "15px" }}
    >
      Mostrando {from} de {to} de {size} Resultados
    </span>
  );

  const columns = [
    /*{
      dataField: "creationDate",
      text: "Fecha Alta",
      formatter: fecha =>
        fecha ? Moment(fecha).format("DD/MM/YYYY HH:mm:ss") : "",
      headerStyle: () => ({ width: "10%" }),
      sort: true,
    },*/
    {
      dataField: "legalName",
      text: "Cliente",
      headerStyle: () => ({ width: "15%" }),
      sort: true,
      formatter: (cell, row) => (
        <div>
          <span>{row.brandName}</span>
          <br></br>
          <span>{row.legalName}</span>
        </div>
      ),
    },
    {
      dataField: "spaceType",
      text: "Tipo de Espacio",
      headerStyle: () => ({ width: "10%" }),
      sort: true,
    },
    {
      dataField: "spaceLocation",
      text: "Ubicación",
      headerStyle: () => ({ width: "10%" }),
      sort: true,
    },
    {
      dataField: "bxA",
      text: "B x A",
      headerStyle: () => ({ width: "7%" }),
      sort: true,
    },
    {
      dataField: "contractId",
      text: "N°Cont.",
      headerStyle: () => ({ width: "5%" }),
      sort: true,
    },
    {
      dataField: "contractName",
      text: "Contrato",
      headerStyle: () => ({ width: "12%" }),
      sort: true,
    },
    {
      dataField: "quantity",
      text: "Cantidad",
      headerStyle: () => ({ width: "12%" }),
      sort: true,
    },
    {
      dataField: "pageNumber",
      text: "Página",
      headerStyle: () => ({ width: "3%" }),
      sort: true,
    },
    {
      dataField: "observations",
      text: "Observaciones",
      headerStyle: () => ({ width: "18%" }),
      sort: true,
    },
    {
      dataField: "seller",
      text: "Vdor",
      headerStyle: () => ({ width: "10%" }),
      sort: true,
    },
  ];

  const options = {
    // Tooltips botones de paginación
    prePageTitle: "página previa",
    nextPageTitle: "próxima página",
    firstPageTitle: "primer página",
    lastPageTitle: "última página",
    showTotal: true,
    paginationTotalRenderer: customTotal,
  };

  return (
    <PageContainer>
      <Filters
        availableProducts={props.availableProducts}
        availableEditions={props.availableEditions}
        handleFilter={props.actions.filterReport}
        clearFilters={props.actions.clearFilters}
        data={props.data}
        getProductEditionsHandler={props.actions.getProductEditions}
        addReporteGeneration={props.actions.addReporteGeneration}
        isLoadingProducts={props.isLoadingProducts}
        isLoadingProductEditions={props.isLoadingProductEditions}
      />
      {props.data.length > 0 && (
        <div style={{ margin: "15px 15px auto 15px" }}>
          {/*<ToolkitProvider
              keyField="publishingOrderId"
              data={props.data}
              columns={columns}
              search
            >
              {
                props => (
                  <div>
                    <SearchBar {...props.searchProps} />
                    <hr />
                    <BootstrapTable
                      {...props.baseProps}
                      striped
                      hover
                      condensed
                      bootstrap4
                      headerClasses="thead-light"
                      pagination={paginationFactory(options)}
                    />
                  </div>
                )
              }
            </ToolkitProvider> */}

          <BootstrapTable
            keyField="publishingOrderId"
            striped
            hover
            condensed
            bootstrap4
            headerClasses="thead-light"
            data={props.data}
            columns={columns}
            pagination={paginationFactory(options)}
          />
        </div>
      )}
    </PageContainer>
  );
}
