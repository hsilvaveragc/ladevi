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
      CLIENTE: d.brandName,
      CONTRATO: d.contractName,
      ESPACIO: d.productAdvertisingSpace,
      "CANT.": d.quantity,
      MONEDA: d.currency,
      IMPORTE: d.total,
      VENDEDOR: d.seller,
      FACTURA: d.invoiceNumber,
      "PÁG.": !d.pageNumber
        ? ""
        : isNaN(d.pageNumber)
        ? d.pageNumber
        : Number(d.pageNumber),
    }));

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    // Configurar anchos de columnas
    const colWidths = [
      { wch: 40 }, // Cliente
      { wch: 50 }, // Contrato
      { wch: 40 }, // Espacio
      { wch: 10 }, // Cant.
      { wch: 10 }, // Moneda
      { wch: 12 }, // Importe
      { wch: 25 }, // Vendedor
      { wch: 15 }, // Factura
      { wch: 12 }, // Pág.
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    // Descargar archivo
    const filename = `Órdenes de publicación ${Moment(new Date()).format(
      "DD-MM-YYYY HH:mm:ss"
    )}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const getExcelData = () => {
    const data = (
      tableRef?.current?.paginationContext?.props?.data ||
      tableRef?.current ||
      []
    ).map(d => ({
      brandName: d.client.brandName,
      contractName: d.contract ? d.contract.name : "",
      productAdvertisingSpace: d.productAdvertisingSpace.name,
      quantity: d.quantity,
      currency: d.moneda,
      total: d.total,
      seller: d.seller.fullName,
      invoiceNumber: d.invoiceNumber,
      pageNumber: d.pageNumber,
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
