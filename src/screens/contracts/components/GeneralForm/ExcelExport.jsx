import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Moment from "moment";
import excelIcon from "shared/images/iconExcel.png";

export default function ExcelExport({
  data,
  availableClients,
  clientId,
  contractName,
  availableSalesmens,
}) {
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
      EDICIÓN: d.edition,
      ESPACIO: d.productAdvertisingSpace,
      UBICACIÓN: d.advertisingSpaceLocationType,
      "CANT.": d.quantity,
      OBSERVACIONES: d.observations,
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
      { wch: 40 }, // Edición
      { wch: 40 }, // Espacio
      { wch: 40 }, // Ubicación
      { wch: 10 }, // Cant.
      { wch: 25 }, // Observaciones
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

  const getExcelData = (
    data,
    availableClients,
    clientId,
    contractName,
    availableSalesmens
  ) => {
    const result = (data || []).map(o => ({
      brandName: availableClients.find(x => x.id === clientId).brandName,
      contractName: contractName,
      edition: o.productEdition.name,
      productAdvertisingSpace: o.productAdvertisingSpace.name,
      advertisingSpaceLocationType: o.advertisingSpaceLocationType.name,
      quantity: o.quantity,
      observations: o.observations,
      seller: availableSalesmens.find(x => x.id === o.sellerId).fullName,
      invoiceNumber: o.invoiceNumber,
      pageNumber: o.pageNumber,
    }));
    return result;
  };

  const handleClickExcel = () => {
    setExcelD(
      getExcelData(
        data,
        availableClients,
        clientId,
        contractName,
        availableSalesmens
      )
    );
  };

  return (
    <button type="button" className="btn" onClick={handleClickExcel}>
      <img src={excelIcon} width="26" height="32" />
    </button>
  );
}
