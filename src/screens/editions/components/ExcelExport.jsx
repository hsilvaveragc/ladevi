import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Modal from 'shared/components/Modal';
import { DangerButton } from 'shared/components/Buttons';
import { formatDateWithSlashes, formatDateTimeForPDF } from 'shared/utils';

export default function ExcelExport({ data, showModal, modalToggler }) {
  const [excelD, setExcelD] = React.useState([]);

  React.useEffect(() => {
    if (Array.isArray(excelD) && excelD.length > 0) {
      downloadExcel(excelD);
    }
  }, [excelD]);

  const downloadExcel = (data) => {
    // Preparar datos para Excel
    const excelData = data.map((d) => ({
      PRODUCTO: d.product.name,
      TÍTULO: d.name,
      CÓDIGO: d.code,
      'EDICIÓN CERRADA': d.closed ? 'Si' : 'No',
      'FECHA SALIDA': d.releaseDate ? formatDateWithSlashes(d.releaseDate) : '',
    }));

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    // Configurar anchos de columnas
    const colWidths = [
      { wch: 40 }, // Producto
      { wch: 40 }, // Título
      { wch: 12 }, // Código
      { wch: 20 }, // Edición Cerrada
      { wch: 15 }, // Fecha Salida
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Ediciones');

    // Descargar archivo
    const filename = `Ediciones ${formatDateTimeForPDF(new Date())}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const handleClickExcel = () => {
    setExcelD(data);
  };

  return (
    <>
      <DangerButton onClickHandler={modalToggler}>
        <FontAwesomeIcon icon={faDownload} />
      </DangerButton>
      <Modal
        title='Exportar a Excel'
        showModal={showModal}
        modalToggler={modalToggler}
      >
        <p>¿Está seguro que desea exportar las ediciones a Excel?</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
          }}
        >
          <button className='btn btn-secondary' onClick={modalToggler}>
            Cancelar
          </button>
          <button className='btn btn-success' onClick={handleClickExcel}>
            Exportar
          </button>
        </div>
      </Modal>
    </>
  );
}
