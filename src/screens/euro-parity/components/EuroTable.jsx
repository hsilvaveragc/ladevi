import React from "react";
import { RemoveButton } from "shared/components/Buttons";
import Table from "shared/components/Table";
import "shared/utils/extensionsMethods.js";
import { getHeaderStyleTable } from "shared/utils/index";

const EuroTable = ({ data, isLoading, showAddModal, onDelete }) => {
  const columns = [
    {
      Header: "Paridad Euro y U$S",
      accessor: "euroToDollarExchangeRate",
      width: "40%",
      headerStyle: getHeaderStyleTable(),
      Cell: props => props.row.euroToDollarExchangeRate.toLocaleCurrency(),
    },
    {
      Header: "Fecha Inicio Paridad",
      accessor: "start",
      width: "40%",
      headerStyle: getHeaderStyleTable(),
      Cell: props => props.row.start.toLocaleDate(),
    },
    {
      Header: "Borrar",
      filterable: false,
      width: "200",
      Cell: props => {
        return props.original.canDelete ? (
          <RemoveButton onClickHandler={() => onDelete(props.original)} />
        ) : (
          <div />
        );
      },
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      buttonHandler={showAddModal}
      buttonText="Agregar Paridad Euro"
      loading={isLoading}
      hideCursor={true}
      showButton
      pageSizeOptions={[5, 10, 20, 50, 100]}
      pageSizeDefault={5}
    ></Table>
  );
};

export default EuroTable;
