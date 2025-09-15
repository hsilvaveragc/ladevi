import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { PageContainer } from "shared/utils";
import Modals from "./components/Modals";
import Filters from "./components/Filters";
import ContractTable from "./components/ContractTable";

export default function ContractsPage(props) {
  const [selectedItem, setSelectedItem] = useState({});
  const [filtros, setFiltros] = useState({});
  const [formikPropsDuplicate, setFormikPropsDuplicate] = useState();

  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  const handleEdit = item => {
    if (item.sellerChanged) {
      toast.error(`El cliente pertenece al vendedor ${item.sellerChangeName}`);
    } else {
      setSelectedItem({ ...item });
      props.actions.showEditModal();
    }
  };

  const handleDeleteViibility = item => {
    return (
      item.publishingOrders.length === 0 &&
      item.invoiceNumber.length === 0 &&
      !item.sellerChanged
    );
  };
  const handleDelete = item => {
    setSelectedItem({ ...item });
    props.actions.showDeleteModal();
  };

  const duplicateContractHandler = () => {
    props.actions.showEditModal();
    props.actions.showAddModal();
  };

  return (
    <>
      <PageContainer>
        <Modals
          {...props}
          selectedItem={selectedItem}
          filters={filtros}
          isLoading={props.loading}
          formikPropsDuplicate={formikPropsDuplicate}
          setFormikPropsDuplicate={setFormikPropsDuplicate}
          duplicateContractHandler={duplicateContractHandler}
        />
        <Filters
          availableCountries={props.availableCountries}
          availableProducts={props.availableProducts}
          availableStatus={props.availableStatus}
          availableSalesmen={props.availableSalesmens}
          handleFilter={props.actions.filterContracts}
          handleResetFilters={props.actions.searchContracts}
          handleChangeFilter={setFiltros}
          errors={props.errors}
        />
        <ContractTable
          data={props.availableContracts}
          isLoading={props.loading}
          showAddModal={props.actions.showAddModal}
          onEdit={handleEdit}
          onDeleteViibility={handleDeleteViibility}
          onDelete={handleDelete}
        />
      </PageContainer>
    </>
  );
}
