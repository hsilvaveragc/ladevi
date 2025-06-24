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

  const formatClient = (cell, row, rowIndex, formatExtraData) => (
    <>
      <p style={{ lineHeight: "1em" }}>{row.marca}</p>
      <p style={{ lineHeight: "1em" }}>{row.razonSocial}</p>
    </>
  );

  const formatComision = (cell, row, rowIndex, formatExtraData) =>
    `${row.comisionData.comisionAntes.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} --> ${row.comisionData.comisionDespues.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const footerTotalsBySeller = (columnData, column, columnIndex) => {
    let sum = 0;
    for (let i = 0; i < props.data.bySeller.length; i++) {
      const importe =
        props.data.bySeller[i].totals[column.dataField.split(".")[1]];
      sum += !importe || isNaN(importe) ? 0 : parseFloat(importe);
    }
    return sum.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const footerTotalsByEdicion = (columnData, column, columnIndex) => {
    let sum = 0;
    for (let i = 0; i < props.data.byEdition.length; i++) {
      const importe =
        props.data.byEdition[i].totals[column.dataField.split(".")[1]];
      sum += !importe || isNaN(importe) ? 0 : parseFloat(importe);
    }
    return sum.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const columnsMain = [
    {
      dataField: "edicion",
      text: "Edición",
      headerStyle: () => ({ width: "8%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "productCountry",
      text: "País del Producto",
      headerStyle: () => ({ width: "9%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "fechaSalida",
      text: "Salida",
      formatter: fecha => (fecha ? Moment(fecha).format("DD/MM/YYYY") : ""),
      headerStyle: () => ({ width: "7%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "pagina",
      text: "Página",
      headerStyle: () => ({ width: "6%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "marca",
      text: "Cliente",
      formatter: formatClient,
      headerStyle: () => ({ width: "17%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "vendedor",
      text: "Vendedor",
      headerStyle: () => ({ width: "8%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "numero",
      text: "N°Cont.",
      headerStyle: () => ({ width: "5%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "contrato",
      text: "Contrato",
      headerStyle: () => ({ width: "18%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "tipoEspacio",
      text: "Tipo de Espacio",
      headerStyle: () => ({ width: "12%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "comisionData.comisionAntes",
      text: "Comisión",
      headerStyle: () => ({ width: "7%", fontSize: "12px" }),
      formatter: formatComision,
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "quantity",
      text: "Cantidad",
      headerStyle: () => ({ width: "6%", fontSize: "12px" }),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "moneda",
      text: "Moneda",
      headerStyle: () => ({ width: "6%", fontSize: "12px" }),
      formatter: (total, row) => (total ? row.moneda : ""),
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "importe",
      text: "Importe",
      headerStyle: () => ({ width: "6%", fontSize: "12px" }),
      formatter: (total, row) =>
        total
          ? `${total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : 0,
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "invoice",
      text: "Nº Factura",
      headerStyle: () => ({ width: "8%", fontSize: "12px" }),
      formatter: (cell, row) => `${row.billingCondition} ${row.invoice}`,
      sort: true,
      style: () => ({ fontSize: "12px" }),
    },
  ];

  const columnsSeller = [
    {
      dataField: "seller",
      text: "Vendedor",
      headerStyle: () => ({ width: "40%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      footer: () => "TOTALES",
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.spacesLocalCurrency",
      text: "Espacios Moneda Local",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsBySeller,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.comisionsLocalCurrency",
      text: "Comisiones Moneda Local",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsBySeller,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.spacesDolares",
      text: "Espacios Dólares",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsBySeller,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.comisionDolares",
      text: "Comisiones Dólares",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsBySeller,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
  ];

  const columnsEdition = [
    {
      dataField: "productEdition",
      text: "Edición",
      headerStyle: () => ({ width: "60%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      footer: () => "TOTALES",
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.spacesLocalCurrency",
      text: "Espacios Moneda Local",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsByEdicion,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.comisionsLocalCurrency",
      text: "Comisiones Moneda Local",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsByEdicion,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.spacesDolares",
      text: "Espacios Dólares",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsByEdicion,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.comisionDolares",
      text: "Comisiones Dólares",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsByEdicion,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
  ];

  const columnsCuenta = [
    {
      dataField: "currency",
      text: "Moneda",
      headerStyle: () => ({ width: "30%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      footer: () => "TOTALES",
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "iva",
      text: "IVA",
      headerStyle: () => ({ width: "30%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      footer: () => "",
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.spacesLocalCurrency",
      text: "Espacios Moneda Local",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsByEdicion,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.comisionsLocalCurrency",
      text: "Comisiones Moneda Local",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsByEdicion,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.spacesDolares",
      text: "Espacios Dólares",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsByEdicion,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
    },
    {
      dataField: "totals.comisionDolares",
      text: "Comisiones Dólares",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: total =>
        total
          ? total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
      footer: footerTotalsByEdicion,
      footerStyle: { background: "darkGrey", fontSize: "12px" },
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
        availableProductTypes={props.availableProductTypes}
        availableProducts={props.availableProducts}
        availableEditions={props.availableEditions}
        availableSellers={props.availableSellers}
        filterHandler={props.actions.filterReport}
        clearFilters={props.actions.clearFilters}
        data={props.data}
        getProductHandler={props.actions.getProductsByType}
        getProductEditionsHandler={props.actions.getProductEditionByProduct}
        isLoadingSellers={props.isLoadingSellers}
        isLoadingProductTypes={props.isLoadingProductTypes}
        isLoadingProducts={props.isLoadingProducts}
        isLoadingProductEditions={props.isLoadingProductEditions}
      />
      {props.data.main.length > 0 && (
        <div style={{ margin: "15px 15px auto 15px" }}>
          <BootstrapTable
            keyField="publishingOrderId"
            striped
            hover
            condensed
            bootstrap4
            headerClasses="thead-light"
            data={props.data.main}
            columns={columnsMain}
            pagination={paginationFactory(options)}
          />

          <h5>Resumen por vendedor</h5>
          <BootstrapTable
            keyField="sellerId"
            striped
            hover
            condensed
            bootstrap4
            headerClasses="thead-light"
            data={props.data.bySeller}
            columns={columnsSeller}
            pagination={paginationFactory(options)}
          />

          <h5>Resumen por edición</h5>
          <BootstrapTable
            keyField="productEditionId"
            striped
            hover
            condensed
            bootstrap4
            headerClasses="thead-light"
            data={props.data.byEdition}
            columns={columnsEdition}
            pagination={paginationFactory(options)}
          />

          <h5>Resumen por cuenta</h5>
          <BootstrapTable
            keyField={new Date()}
            striped
            hover
            condensed
            bootstrap4
            headerClasses="thead-light"
            data={props.data.byCuenta}
            columns={columnsCuenta}
            pagination={paginationFactory(options)}
          />
        </div>
      )}
    </PageContainer>
  );
}
