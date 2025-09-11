import { useDispatch, useSelector } from 'react-redux';
import {
  showEditionsAddModal,
  showEditionsEditModal,
  showEditionsDeleteModal,
  setSelectedEdition,
} from '../actionCreators';
import { getEditions, getLoading } from '../reducer';
import { getHeaderStyleTable, createDeleteColumn } from 'shared/utils';
import Table from 'shared/components/Table';

const EditionsTable = ({ element }) => {
  const dispatch = useDispatch();

  // Estados del Redux store
  const editions = useSelector(getEditions);
  const isLoading = useSelector(getLoading);

  // Handlers
  const handleShowAddModal = () => {
    dispatch(showEditionsAddModal());
  };

  const handleEdit = (item) => {
    dispatch(setSelectedEdition(item));
    dispatch(showEditionsEditModal());
  };

  const handleDelete = (item) => {
    dispatch(setSelectedEdition(item));
    dispatch(showEditionsDeleteModal());
  };

  // Función para formatear fecha de forma segura
  const formatDate = (dateValue) => {
    return formatDateForTable(dateValue);
  };

  // Definición de columnas
  const columns = [
    {
      Header: 'Producto',
      accessor: 'productName',
      width: '20%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: 'Titulo',
      accessor: 'name',
      width: '20%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: 'Código',
      accessor: 'code',
      width: '20%',
      headerStyle: getHeaderStyleTable(),
    },
    {
      Header: 'Edición Cerrada',
      accessor: 'closed',
      width: '20%',
      headerStyle: getHeaderStyleTable(),
      Cell: (row) => {
        if (row.original.closed) {
          return 'Si';
        } else {
          return 'No';
        }
      },
    },
    {
      Header: 'Fecha Salida',
      accessor: 'end',
      width: '20%',
      headerStyle: getHeaderStyleTable(),
      Cell: (row) => {
        return formatDate(row.value);
      },
    },
    createDeleteColumn(handleDelete),
  ];

  // Eventos de fila de la grilla
  const rowEvents = {
    onClick: (e, selectedItem) => {
      if (e.target.type !== 'button') {
        handleEdit(selectedItem);
      }
    },
  };

  return (
    <Table
      data={editions}
      columns={columns}
      buttonHandler={handleShowAddModal}
      buttonText='Agregar Edición'
      showButton
      loading={isLoading}
      rowClickHandler={rowEvents.onClick}
      element={element}
    />
  );
};

export default EditionsTable;
