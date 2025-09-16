import Table from 'shared/components/Table';
import 'shared/utils/extensionsMethods.js';
import { getHeaderStyleTable, createDeleteColumn } from 'shared/utils/index';

const AccountingFieldsTable = ({
  data,
  countries,
  isLoading,
  showAddModal,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      Header: 'Nombre',
      accessor: 'name',
      width: '25%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: 'País',
      accessor: 'countryId',
      width: '25%',
      Cell: (props) => countries.find((x) => x.id === props.value)?.name ?? '-',
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: 'Opciones',
      accessor: 'optionsInternal',
      width: '25%',
      headerStyle: getHeaderStyleTable(),
    },
    createDeleteColumn(onDelete),
  ];

  const rowEvents = {
    onClick: (e, selectedItem) => {
      if (e.target.type !== 'button') {
        onEdit(selectedItem);
      }
    },
  };

  return (
    <Table
      data={data}
      columns={columns}
      buttonHandler={showAddModal}
      buttonText='Agregar Campo Contable'
      loading={isLoading}
      showButton
      rowClickHandler={rowEvents.onClick}
    ></Table>
  );
};

export default AccountingFieldsTable;
