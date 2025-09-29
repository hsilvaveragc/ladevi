import styled from 'styled-components';

import { footerBg, textFont } from '../styles/constants';

const FooterContainer = styled.footer`
  background-color: ${footerBg};
  display: flex;
  justify-content: center;
  padding: 1rem;
  font-family: ${textFont};
  font-size: 0.8rem;
  color: #52606d;
  width: 100%;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <span>2020 © Ladevi Ediciones</span>
    </FooterContainer>
  );
}
