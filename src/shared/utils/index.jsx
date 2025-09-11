import { sortBy, prop } from 'ramda';
import styled from 'styled-components';
import { RemoveButton } from 'shared/components/Buttons';

export const sortAlphabetically = (list, accessor) =>
  sortBy(prop(accessor), list);

export const sortCaseInsensitive = (list, accessor) =>
  list.sort((a, b) =>
    a[accessor].toLowerCase().localeCompare(b[accessor].toLowerCase())
  );

export const getErrorMessage = (errors) => {
  const keys = Object.keys(errors);
  let errorMessage = 'Hubo un error :(';
  if (keys != undefined && keys.length > 1) {
    errorMessage = errors[keys[1]][0];
  } else if (keys.length == 1) {
    errorMessage = errors.error;
  }
  return errorMessage;
};

export const enhanceWordBreak = ({ doc, cell, column }) => {
  if (cell === undefined) {
    return;
  }

  const hasCustomWidth = typeof cell.styles.cellWidth === 'number';

  if (hasCustomWidth || cell.raw == null || cell.colSpan > 1) {
    return;
  }

  let text;

  if (cell.raw instanceof Node) {
    text = cell.raw.innerText;
  } else {
    if (typeof cell.raw == 'object') {
      // not implemented yet
      // when a cell contains other cells (colSpan)
      return;
    } else {
      text = '' + cell.raw;
    }
  }

  // split cell string by spaces
  const words = text.split(/\s+/);

  // calculate longest word width
  const maxWordUnitWidth = words
    .map((s) => Math.floor(doc.getStringUnitWidth(s) * 100) / 100)
    .reduce((a, b) => Math.max(a, b), 0);
  const maxWordWidth =
    maxWordUnitWidth * (cell.styles.fontSize / doc.internal.scaleFactor);

  const minWidth = cell.padding('horizontal') + maxWordWidth;

  // update minWidth for cell & column

  if (minWidth > cell.minWidth) {
    cell.minWidth = minWidth;
  }

  if (cell.minWidth > cell.wrappedWidth) {
    cell.wrappedWidth = cell.minWidth;
  }

  if (cell.minWidth > column.minWidth) {
    column.minWidth = cell.minWidth;
  }

  if (column.minWidth > column.wrappedWidth) {
    column.wrappedWidth = column.minWidth;
  }
};

export const formatNumericValues = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => formatNumericValues(item));
  }

  if (typeof data === 'object' && data !== null) {
    const formatted = {};
    for (const [key, value] of Object.entries(data)) {
      formatted[key] =
        typeof value === 'number'
          ? value.toLocaleString('es-ES', {
              minimumFractionDigits: 0,
              // maximumFractionDigits: 2,
            })
          : formatNumericValues(value);
    }
    return formatted;
  }

  return data;
};

export const getHeaderStyleTable = () => {
  return {
    borderRight: '#ffffff 1px solid',
  };
};

export const createDeleteColumn = (
  onDeleteHandler,
  canDeleteProp = 'canDelete',
  onDeleteViibilityHandler = (item) => true
) => ({
  Header: 'Borrar',
  filterable: false,
  width: '200',
  style: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  Cell: (props) =>
    (props.original[canDeleteProp] == undefined ||
      props.original[canDeleteProp]) &&
    onDeleteViibilityHandler(props.original) ? (
      <RemoveButton onClickHandler={() => onDeleteHandler(props.original)} />
    ) : (
      <div />
    ),
});

export const PageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: top;
  align-items: center;
  flex-direction: column;
  padding: 30px 30px 0 30px;
  width: 100%;
  box-sizing: border-box;
`;

export const findById = (array, id) => array.find((item) => item.id === id);

export const getAllItem = () => {
  return { id: -1, name: 'Todos' };
};

// Función para formatear números con punto como separador de miles y coma decimal
export const formatCurrency = (amount, currencySymbol) => {
  return (
    currencySymbol +
    ' ' +
    new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  );
};
