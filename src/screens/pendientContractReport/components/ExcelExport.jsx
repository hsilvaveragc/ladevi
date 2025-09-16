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
      'Nº CONT.': d.contractNumber,
      CONTRATO: d.contractName,
      'TIPO DE ESPACIO': d.productAdvertisingSpace,
      'CANT. PUBLICADA': d.publishedQuantity,
      SALDO: d.balance,
      MONEDA: d.currency,
      'IMPORTE UNITARIO': d.unitAmount,
      'MONEDA TOTAL': d.currency2,
      'IMP. TOTAL SALDO': d.totalBalanceAmount,
    }));

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    // Configurar anchos de columnas
    const colWidths = [
      { wch: 40 }, // Cliente
      { wch: 12 }, // Nº Cont.
      { wch: 40 }, // Contrato
      { wch: 25 }, // Tipo de Espacio
      { wch: 18 }, // Cant. Publicada
      { wch: 12 }, // Saldo
      { wch: 12 }, // Moneda
      { wch: 18 }, // Importe Unitario
      { wch: 12 }, // Moneda
      { wch: 20 }, // Imp. Total Saldo
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Contratos Pendientes');

    // Descargar archivo
    const filename = `Contratos pendientes ${format(
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
      contractNumber: d.contractNumber,
      contractName: d.contractName,
      productAdvertisingSpace: d.productAdvertisingSpace,
      publishedQuantity: d.publishedQuantity,
      balance: d.balance,
      currency: d.currency,
      unitAmount: d.unitAmount,
      currency2: d.currency2,
      totalBalanceAmount: d.totalBalanceAmount,
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
