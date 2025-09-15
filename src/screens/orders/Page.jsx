import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "shared/utils";
import Modals from "./components/Modals";
import Filters from "./components/Filters";
import OrdersTable from "./components/OrdersTable";

export default function Page(props) {
  const [selectedItem, setSelectedItem] = useState({});
  const [params, setParams] = useState();

  const tableRef = useRef();

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
      <Modals {...props} selectedItem={selectedItem} params={params} />
      <Filters
        availableProducts={props.availableProducts}
        availableEditions={props.availableEditionsForFilter}
        availableSalesmens={props.availableSalesmens}
        availableClients={props.allClients}
        handleFilter={props.actions.filterOrders}
        handleResetFilters={props.actions.initialLoad}
        getProductEditionsHandler={props.actions.getEditionsFilter}
        data={props.availableOrders}
        handleChangeParams={setParams}
        tableRef={tableRef}
        isLoading={props.isLoading}
        isLoadingAllClients={props.isLoadingAllClients}
        isLoadingProducts={props.isLoadingProducts}
        isLoadingSalesmens={props.isLoadingSalesmens}
        isLoadingEditionsFilter={props.isLoadingEditionsFilter}
      />
      <OrdersTable
        data={props.availableOrders}
        isLoading={
          props.isLoadingProducts ||
          props.isLoadingSalesmens ||
          props.isLoadingAllClients ||
          props.isLoading
        }
        showAddModal={props.actions.showAddModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        tableRef={tableRef}
      />
    </PageContainer>
  );
}
