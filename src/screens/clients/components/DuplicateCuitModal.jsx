import React from "react";
import Modal from "shared/components/Modal";

const DuplicateCuitModal = ({ isOpen, data, onConfirm, onCancel }) => {
  if (!data) return null;

  return (
    <Modal shouldClose={true} closeHandler={onCancel} isOpen={isOpen}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4>Cliente duplicado encontrado</h4>
            <hr />
            <p>
              Ya existe un cliente en Xubio con el CUIT{" "}
              <strong>{data.cuit}</strong>
            </p>
            <p>
              Cliente: <strong>{data.existingClientName}</strong>.
            </p>
            <p>¿Desea facturar con dicho cliente de Xubio?</p>

            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-secondary me-2 mr-2"
                onClick={onCancel}
              >
                NO
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onConfirm}
              >
                SÍ
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DuplicateCuitModal;
