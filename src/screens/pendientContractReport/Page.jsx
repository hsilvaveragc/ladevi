import React, { useEffect } from "react";
import styled from "styled-components";
import Filter from "./components/Filters";

import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

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

const getUnique = (arr, comp) => {
  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e]);

  return unique;
};

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

export default function Page(props) {
  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  //const clients = getUnique(props.data, "clientId");
  //const clients = [...new Set(props.data.map(item => item.client ))];

  const clients = removeDuplicates(
    props.data.map(d => ({
      clientId: d.clienteId,
      client: d.client,
    })),
    "clientId"
  );

  const clientsExpanded = clients.map(c => c.clientId);

  const columnsHijas = [
    {
      dataField: "numero",
      text: "N°Cont.",
      headerStyle: () => ({ width: "5%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "contrato",
      text: "Contrato",
      headerStyle: () => ({ width: "35%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "spaceType",
      text: "Tipo de Espacio",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "selledQuantity",
      text: "Cant. Publicada",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "balance",
      text: "Saldo",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
    },
    {
      dataField: "amount",
      text: "Importe Unitario",
      headerStyle: () => ({ width: "20%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: (cell, row) =>
        cell
          ? `${row.moneda} ${cell.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : 0,
    },
    {
      dataField: "pendientAmount",
      text: "Imp. No publicado",
      headerStyle: () => ({ width: "20%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: (cell, row) =>
        cell
          ? `${row.moneda} ${cell.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : 0,
    },
    {
      dataField: "invoice",
      text: "Nº Factura",
      headerStyle: () => ({ width: "15%", fontSize: "12px" }),
      style: () => ({ fontSize: "12px" }),
      formatter: (cell, row) =>
        cell ? `${row.billingCondition} ${row.invoice}` : "",
    },
  ];

  const expandRow = {
    renderer: row => {
      const childRows = props.data.filter(x => x.clienteId === row.clientId);
      return (
        <BootstrapTable
          keyField={new Date()}
          striped
          hover
          condensed
          bootstrap4
          headerClasses="thead-light"
          data={childRows}
          columns={columnsHijas}
        />
      );
    },
    expanded: clientsExpanded,
    showExpandColumn: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <b style={{ fontSize: "12pt" }}>Contraer Todos</b>;
      }
      return <b style={{ fontSize: "12pt" }}>Expandir Todos</b>;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return <b style={{ fontSize: "12pt" }}>Contraer</b>;
      }
      return <b style={{ fontSize: "12pt" }}>Expandir</b>;
    },
  };

  const customTotal = (from, to, size) => (
    <span
      className="react-bootstrap-table-pagination-total"
      style={{ marginLeft: "15px" }}
    >
      Mostrando {from} de {to} de {size} Resultados
    </span>
  );

  const columns = [
    {
      dataField: "clientId",
      text: "id",
      hidden: true,
    },
    {
      dataField: "client",
      text: "Cliente",
      headerStyle: () => ({ width: "20%", fontSize: "12px" }),
      style: () => ({ fontSize: "14pt", fontWeight: "bold" }),
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
      <Filter
        availableClients={props.availableClients}
        availableSellers={props.availableSellers}
        filterHandler={props.actions.filterReport}
        data={props.data}
        clients={clients}
        isLoadingAllClients={props.isLoadingAllClients}
        isLoadingSellers={props.isLoadingSellers}
        clearFilters={props.actions.clearFilters}
      />
      {props.data.length > 0 && (
        <div style={{ margin: "15px 15px auto 15px" }}>
          <BootstrapTable
            keyField="clientId"
            striped
            hover
            condensed
            bootstrap4
            headerClasses="thead-light"
            data={clients}
            columns={columns}
            pagination={paginationFactory(options)}
            expandRow={expandRow}
          />
        </div>
      )}
    </PageContainer>
  );
}
