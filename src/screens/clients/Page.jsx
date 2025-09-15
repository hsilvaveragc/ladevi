import React, { useState, useEffect } from "react";
import { PageContainer } from "shared/utils";
import Modals from "./components/Modals";
import Filters from "./components/Filters";
import ClientTable from "./components/ClientTable";

export default function Page(props) {
  const [selectedItem, setSelectedItem] = useState({});
  const [params, setParams] = useState();

  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  const handleEdit = item => {
    setSelectedItem(item);
    props.actions.getLocationData(item);
    props.actions.showEditModal();
  };

  const handleDelete = item => {
    setSelectedItem(item);
    props.actions.getLocationData(item);
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
        availableStates={props.availableStates}
        availableDistricts={props.availableDistricts}
        availableCities={props.availableCities}
        getDistrictsHandler={props.actions.getAllDistrictsByID}
        getStatesHandler={props.actions.getAllStatesByID}
        getCitiesHandler={props.actions.getAllCitiesByID}
        availableUsers={props.availableUsers}
        filterHandler={props.actions.filterClients}
        resetFiltersHandler={props.actions.searchClientsInit}
        handleChangeParams={setParams}
      />
      <ClientTable
        data={props.availableClients}
        isLoading={props.isLoading}
        showAddModal={props.actions.showAddModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}
