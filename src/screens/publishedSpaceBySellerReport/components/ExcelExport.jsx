import React from "react";
import * as XLSX from "xlsx";
import Moment from "moment";
import excelIcon from "shared/images/iconExcel.png";

export default function ExcelExport({ tableRef }) {
  const [excelD, setExcelD] = React.useState([]);

  React.useEffect(() => {
    if (Array.isArray(excelD) && excelD.length > 0) {
      downloadExcel(excelD);
    }
  }, [excelD]);

  const downloadExcel = data => {
    // Preparar datos para Excel
    const excelData = data.map(d => ({
      EDICIÓN: d.edition,
      SALIDA: d.releaseDate,
      "TIPO DE ESPACIO": d.productAdvertisingSpace,
      CANTIDAD: d.quantity,
      MONEDA: d.currency,
      IMPORTE: d.total,
      "Nº FACTURA": d.invoiceNumber,
      "Nº CONT.": d.contractNumber,
      VENDEDOR: d.seller,
      CLIENTE: d.client,
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
      { wch: 25 }, // Vendedor
      { wch: 40 }, // Cliente
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Reporte por Cliente");

    // Descargar archivo
    const filename = `Espacios publicados por cliente ${Moment(
      new Date()
    ).format("DD-MM-YYYY HH:mm:ss")}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const getExcelData = () => {
    const data = (
      tableRef?.current?.paginationContext?.props?.data ||
      tableRef?.current ||
      []
    ).map(d => ({
      edition: d.edition,
      releaseDate: d.releaseDate,
      productAdvertisingSpace: d.productAdvertisingSpace,
      quantity: d.quantity,
      currency: d.currency,
      total: d.total,
      invoiceNumber: d.invoiceNumber,
      contractNumber: d.contractNumber,
      seller: d.seller,
      client: d.client,
    }));
    return data;
  };

  const handleClickExcel = () => {
    setExcelD(getExcelData());
  };

  return (
    <button type="button" className="btn" onClick={handleClickExcel}>
      <img src={excelIcon} width="26" height="32" />
    </button>
  );
}
