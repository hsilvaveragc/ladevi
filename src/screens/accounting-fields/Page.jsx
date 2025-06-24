import React, { useState, useEffect } from "react";
import { PageContainer } from "shared/utils";
import Modals from "./components/Modals";
import Filters from "./components/Filters";
import AccountingFieldsTable from "./components/AccountingFieldsTable";

export default function Page(props) {
  const [selectedItem, setSelectedItem] = useState({});
  const [params, setParams] = useState();

  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  const handleEdit = item => {
    setSelectedItem(item);
    props.actions.showEditModal();
  };

  const handleDelete = item => {
    setSelectedItem(item);
    props.actions.showDeleteModal();
  };

  return (
    <PageContainer>
      <Modals
        {...props}
        selectedItem={selectedItem}
        params={params}
        isLoading={props.isLoading}
      />
      <Filters
        availableCountries={props.availableCountries}
        filterHandler={props.actions.filterAccountingFields}
        resetFiltersHandler={props.actions.getAllAccountingFields}
        handleChangeParams={setParams}
      />
      <AccountingFieldsTable
        data={props.accountingFieldsAvailable}
        availableCountries={props.availableCountries}
        isLoading={props.isLoading}
        showAddModal={props.actions.showAddModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}
