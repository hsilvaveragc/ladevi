import React, { useState } from 'react';
import styled from 'styled-components';
import HamburgerMenu from 'react-hamburger-menu';
import CheeseburgerMenu from 'cheeseburger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import useUser from 'shared/security/useUser';

import { headerBg } from '../../styles/constants';
import logo from '../../images/logo-mini.png';

import MenuContent from './components/MenuContent';

const HeaderContainer = styled.header`
  background-color: ${headerBg};
  display: flex;
  align-items: center;
  padding: 0.45rem 1rem;
  width: 100%;
  height: auto;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #186faf;
    border: 3px solid #00375e;
    color: #fff;
    line-height: 1em;
    padding: 0.5rem;
    svg {
      margin-left: 0.5rem;
    }
  }
  .hamburger-menu-container {
    cursor: pointer;
  }
  .info-container {
    display: flex;
    align-items: center;
    flex: 1;
    h4 {
      margin: 0;
      color: #fff;
      margin-left: 1rem;
      text-transform: capitalize;
    }

    .logo-container {
      img {
        width: 38;
      }
      a {
        margin-left: 2rem;
      }
    }
  }
`;
const Header = (props) => {
  const { userFullName } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const routeName = props.match.path.split('/');

  return (
    <HeaderContainer>
      <CheeseburgerMenu
        isOpen={menuOpen}
        closeCallback={() => setMenuOpen(!menuOpen)}
        topOffset='8vh'
        backgroundColor='#0f609b'
      >
        <MenuContent menuToggler={() => setMenuOpen(!menuOpen)} />
      </CheeseburgerMenu>
      <div className='hamburger-menu-container'>
        <HamburgerMenu
          isOpen={menuOpen}
          menuClicked={() => setMenuOpen(!menuOpen)}
          width={32}
          height={24}
          strokeWidth={3}
          rotate={0}
          color='white'
          borderRadius={0}
          animationDuration={0.5}
        />
      </div>
      <div className='info-container'>
        <div className='logo-container'>
          <a href='/'>
            <img
              style={{
                width: '38px !important',
              }}
              height='38'
              src={logo}
              alt='Logo'
            />
          </a>
        </div>
        <h4 data-testid='page-title'>{props.routeTitle || routeName[1]}</h4>
      </div>
      <button onClick={props.logoutHandler}>
        {userFullName}
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </HeaderContainer>
  );
};

export default Header;
