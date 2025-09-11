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
      CLIENTE: d.client,
      CONTRATO: d.contract,
      EDICIÓN: d.edition,
      ESPACIO: d.productAdvertisingSpace,
      UBICACIÓN: d.location,
      CANTIDAD: d.quantity,
      OBSERVACIONES: d.observations,
      VENDEDOR: d.seller,
      FACTURA: d.invoiceNumber,
      'PÁG.': d.pageNumber,
    }));

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    // Configurar anchos de columnas
    const colWidths = [
      { wch: 40 }, // Cliente
      { wch: 40 }, // Contrato
      { wch: 15 }, // Edición
      { wch: 40 }, // Espacio
      { wch: 40 }, // Ubicación
      { wch: 12 }, // Cantidad
      { wch: 30 }, // Observaciones
      { wch: 25 }, // Vendedor
      { wch: 15 }, // Factura
      { wch: 12 }, // Pág.
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Órdenes para Producción');

    // Descargar archivo
    const filename = `Órdenes para producción ${format(
      new Date(),
      'dd-MM-yyyy HH:mm:ss'
    )}
    )}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const getExcelData = () => {
    const data = (
      tableRef?.current?.paginationContext?.props?.data ||
      tableRef?.current ||
      []
    ).map((d) => ({
      client: d.client,
      contract: d.contract,
      edition: d.edition,
      productAdvertisingSpace: d.productAdvertisingSpace,
      location: d.location,
      quantity: d.quantity,
      observations: d.observations,
      seller: d.seller,
      invoiceNumber: d.invoiceNumber,
      pageNumber: d.pageNumber,
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
