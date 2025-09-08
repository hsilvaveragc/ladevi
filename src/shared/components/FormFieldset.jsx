import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledFieldset = styled.fieldset`
  width: 100%;
  border: 1px solid black;
  padding: 0 1.4em 1.4em 1.4em;
  margin: 0 0 1.5em 0;

  legend {
    font-size: 1.2em;
    font-weight: bold;
    text-align: left;
    width: auto;
    padding: 0 10px;
    border-bottom: none;
  }
`;

const FormFieldset = ({ title, children, className = "", style = {} }) => {
  return (
    <StyledFieldset className={className} style={style}>
      <legend>{title}</legend>
      {children}
    </StyledFieldset>
  );
};

FormFieldset.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FormFieldset;
