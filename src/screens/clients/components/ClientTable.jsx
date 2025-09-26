import React from "react";
import Table from "shared/components/Table";
import "shared/utils/extensionsMethods.js";
import { getHeaderStyleTable, createDeleteColumn } from "shared/utils/index";

const ClientTable = ({ data, isLoading, showAddModal, onEdit, onDelete }) => {
  const columns = [
    {
      Header: "Marca",
      accessor: "brandName",
      width: "25%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Razón Social",
      accessor: "legalName",
      width: "25%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "País",
      accessor: "country.name",
      width: "15%",
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: "Vendedor",
      accessor: "applicationUserSeller.fullName",
      width: "25%",
      headerStyle: getHeaderStyleTable(),
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
      buttonText="Agregar Cliente"
      loading={isLoading}
      showButton
      rowClickHandler={rowEvents.onClick}
    ></Table>
  );
};

export default ClientTable;
