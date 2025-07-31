import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import LoginForm from "./components/LoginForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import Footer from "../../shared/components/Footer";
import Logo from "../../shared/images/newLogo.png";

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
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
  },
};
export default function LoginPage({
  loginLoading,
  loginError,
  forgotPasswordLoading,
  forgotPasswordError,
  actions,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <img
        src={Logo}
        style={{
          marginTop: "40px",
        }}
      />
      <LoginPageContainer>
        <Modal
          style={modalStyle}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => setShowModal(!showModal)}
          isOpen={showModal}
        >
          <ForgotPasswordForm
            forgotPasswordAction={actions.forgotPasswordInit}
            error={forgotPasswordError}
            isLoading={forgotPasswordLoading}
          />
        </Modal>
        <LoginForm
          isLoading={loginLoading}
          actions={actions}
          error={loginError}
          modalHandler={() => setShowModal(!showModal)}
        />
      </LoginPageContainer>
      <Footer></Footer>
    </>
  );
}
