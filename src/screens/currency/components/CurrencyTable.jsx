import React from "react";
import Table from "shared/components/Table";
import "shared/utils/extensionsMethods.js";
import { getHeaderStyleTable, createDeleteColumn } from "shared/utils/index";

const CurrencyTable = ({ data, isLoading, showAddModal, onEdit, onDelete }) => {
  const columns = [
    {
      Header: "País",
      accessor: "country",
      width: "25%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Moneda",
      accessor: "name",
      width: "25%",
      headerStyle: getHeaderStyleTable(),
      Cell: props => (!props.row._original.useEuro ? props.row.name : "Euro"),
    },
    {
      Header: "Paridad  U$S Vigente",
      accessor: "currencyParities[0].localCurrencyToDollarExchangeRate",
      width: "25%",
      headerStyle: getHeaderStyleTable(),
      Cell: props => {
        return props.original.currencyParities &&
          props.original.currencyParities.length > 0 &&
          !props.row.useEuro
          ? props.original.currencyParities[
              props.original.currencyParities.length - 1
            ].localCurrencyToDollarExchangeRate.toLocaleCurrency()
          : "-";
      },
    },
    createDeleteColumn(onDelete),
  ];

  const rowEvents = {
    onClick: (e, selectedItem) => {
      if (e.target.type !== "button") {
        onEdit(selectedItem);
      }
    },
  };

  return (
    <Table
      data={data}
      columns={columns}
      buttonHandler={showAddModal}
      buttonText="Agregar Moneda"
      loading={isLoading}
      showButton
      rowClickHandler={rowEvents.onClick}
    ></Table>
  );
};

export default CurrencyTable;
