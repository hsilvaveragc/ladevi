import styled from 'styled-components';

export const NewClientFormContainer = styled.div`
  width: 60vw;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  h5 {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
  small {
    min-height: 1rem;
  }
  .check-container {
    display: flex;
    height: 100%;
  }
  .discounts-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 2.5rem;
    .discount {
      display: flex;
      align-items: center;
      .checkbox-container {
        margin-top: 0.65rem;
        margin-left: 0.5rem;
      }
    }
  }
  .space-container {
    border-bottom: 1px solid #ced4da;
    padding: 1.5rem 0;
  }
  .add-space-button {
    margin: 1.5rem 0;
    display: flex;
    justify-content: flex-end;
  }
  .totals-container {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    font-weight: 500;
  }
  .form-totals-container {
    text-align: right;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-evenly;
    font-size: 1rem;
    //font-weight: 500;
    .text {
      margin-left: 0.25rem;
    }
  }
  .button-container {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
    button {
      width: 25%;
    }
  }
  .disabledDiv {
    pointer-events: none;
    opacity: 0.4;
  }
`;
