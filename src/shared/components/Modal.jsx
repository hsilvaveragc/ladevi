import React, { useState, useRef } from "react";
import ReactModal from "react-modal";
import PropTypes from "prop-types";
import styled from "styled-components";

const ModalContainer = styled.div`
  .frame {
    height: 100%;
    overflow-y: auto;

    .scroll {
    }
  }
`;
const modalStyle = {
  overlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    top: "auto",
    bottom: "auto",
    left: "auto",
    right: "auto",
    maxHeight: "100vh",
    zIndex: 9999, // Asegura que el modal esté por encima de otros elementos
    // overflow: "visible", // Permite que el contenido se desborde
  },
};

ReactModal.setAppElement("#root");

export default function Modal({
  children,
  shouldClose,
  closeHandler,
  isOpen,
  handleAfterOpen,
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const btnRef = useRef();
  return (
    <>
      <ReactModal
        style={modalStyle}
        shouldCloseOnOverlayClick={false}
        isOpen={isOpen}
        onAfterOpen={handleAfterOpen}
        onRequestClose={param => {
          setOpenConfirm(true);
        }}
        shouldCloseOnEsc
      >
        <ModalContainer>
          <div className="frame">
            <div className="scroll">{children}</div>
          </div>
        </ModalContainer>
      </ReactModal>
      <ReactModal
        style={modalStyle}
        shouldCloseOnOverlayClick={false}
        onAfterOpen={() => btnRef.current.focus()}
        isOpen={openConfirm}
        onRequestClose={param => {
          setOpenConfirm(false);
        }}
        shouldCloseOnEsc
      >
        <ModalContainer>
          <div className="frame">
            <div className="scroll">¿Desea cerrar la ventana?</div>
            <br />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <button
                ref={btnRef}
                className="btn btn-success"
                type="button"
                onClick={() => {
                  setOpenConfirm(false);
                  closeHandler();
                }}
                autofocus
                style={{ float: "left" }}
              >
                Si
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setOpenConfirm(false);
                }}
                style={{ float: "left" }}
              >
                No
              </button>
            </div>
          </div>
        </ModalContainer>
      </ReactModal>
    </>
  );
}

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  shouldClose: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
