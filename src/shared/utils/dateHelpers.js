import { format, isValid, parseISO } from 'date-fns';

/**
 * Formatea una fecha de forma segura usando date-fns
 * @param {string|Date|null|undefined} dateValue - Valor de fecha a formatear
 * @param {string} formatPattern - Patrón de formato (por defecto "dd-MM-yyyy")
 * @param {string} fallback - Valor de fallback si la fecha es inválida (por defecto "-")
 * @returns {string} Fecha formateada o valor de fallback
 */
export const formatDateSafe = (
  dateValue,
  formatPattern = 'dd-MM-yyyy',
  fallback = '-'
) => {
  if (!dateValue) return fallback;

  try {
    let date;

    // Si es string, intentar parsearlo como ISO
    if (typeof dateValue === 'string') {
      date = parseISO(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      return fallback;
    }

    // Verificar si la fecha es válida
    if (!isValid(date)) {
      return fallback;
    }

    // Formatear con el patrón especificado
    return format(date, formatPattern);
  } catch (error) {
    // console.warn('Error al formatear fecha:', dateValue, error);
    return fallback;
  }
};

/**
 * Formatea fecha para mostrar en tablas (formato dd-MM-yyyy)
 * @param {string|Date|null|undefined} dateValue - Valor de fecha
 * @returns {string} Fecha formateada para tabla
 */
export const formatDateForTable = (dateValue) => {
  return formatDateSafe(dateValue, 'dd-MM-yyyy');
};

/**
 * Formatea fecha para PDFs (formato dd-MM-yyyy HH:mm:ss)
 * @param {string|Date|null|undefined} dateValue - Valor de fecha
 * @returns {string} Fecha formateada para PDF
 */
export const formatDateTimeForPDF = (dateValue) => {
  return formatDateSafe(dateValue, 'dd-MM-yyyy HH:mm:ss');
};

/**
 * Formatea fecha para mostrar con barras (formato dd/MM/yyyy)
 * @param {string|Date|null|undefined} dateValue - Valor de fecha
 * @returns {string} Fecha formateada con barras
 */
export const formatDateWithSlashes = (dateValue) => {
  return formatDateSafe(dateValue, 'dd/MM/yyyy');
};
