import BasePage from 'shared/components/BasePage';

import AccountingFieldModal from './components/AccountingFieldModal';
import Filters from './components/Filters';
import AccountingFieldsTable from './components/AccountingFieldsTable';

const Page = (props) => {
  const filterProps = {
    countries: props.countries,
    handleFilter: props.actions.filterAccountingFields,
    handleResetFilters: props.actions.getAllAccountingFields,
  };

  const tableProps = {
    countries: props.countries,
  };

  const modalProps = {
    ...props,
  };

  return (
    <BasePage
      // Componentes
      FilterComponent={Filters}
      TableComponent={AccountingFieldsTable}
      ModalComponent={AccountingFieldModal}
      // Datos
      filterProps={filterProps}
      tableProps={tableProps}
      tableData={props.accountingFields}
      modalProps={modalProps}
      // Acciones y estado
      actions={props.actions}
      isLoading={props.isLoading}
      // Callbacks
      initialLoad={props.actions.initialLoad}
    />
  );
};

export default Page;
