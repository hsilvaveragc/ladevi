import React from 'react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

import excelIcon from 'shared/images/iconExcel.png';

export default function ExcelExport({ tableRef }) {
  const [excelD, setExcelD] = React.useState([]);

  React.useEffect(() => {
    if (Array.isArray(excelD) && excelD.length > 0) {
      downloadExcel(excelD);
    }
  }, [excelD]);

  const downloadExcel = (data) => {
    // Preparar datos para Excel
    const excelData = data.map((d) => ({
      EDICIÓN: d.edition,
      SALIDA: d.releaseDate,
      'TIPO DE ESPACIO': d.productAdvertisingSpace,
      CANTIDAD: d.quantity,
      MONEDA: d.currency,
      IMPORTE: d.total,
      'Nº FACTURA': d.invoiceNumber,
      'Nº CONT.': d.contractNumber,
      CLIENTE: d.client,
      VENDEDOR: d.seller,
    }));

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    // Configurar anchos de columnas
    const colWidths = [
      { wch: 12 }, // Edición
      { wch: 12 }, // Salida
      { wch: 40 }, // Tipo de Espacio
      { wch: 12 }, // Cantidad
      { wch: 12 }, // Moneda
      { wch: 12 }, // Importe
      { wch: 15 }, // Nº Factura
      { wch: 12 }, // Nº Cont.
      { wch: 40 }, // Cliente
      { wch: 25 }, // Vendedor
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte por Cliente');

    // Descargar archivo
    const filename = `Espacios publicados por cliente ${format(
      new Date(),
      'dd-MM-yyyy HH:mm:ss'
    )}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const getExcelData = () => {
    const data = (
      tableRef?.current?.paginationContext?.props?.data ||
      tableRef?.current ||
      []
    ).map((d) => ({
      edition: d.edition,
      releaseDate: d.releaseDate,
      productAdvertisingSpace: d.productAdvertisingSpace,
      quantity: d.quantity,
      currency: d.currency,
      total: d.total,
      invoiceNumber: d.invoiceNumber,
      contractNumber: d.contractNumber,
      client: d.client,
      seller: d.seller,
    }));
    return data;
  };

  const handleClickExcel = () => {
    setExcelD(getExcelData());
  };

  return (
    <button type='button' className='btn' onClick={handleClickExcel}>
      <img src={excelIcon} width='26' height='32' />
    </button>
  );
}
