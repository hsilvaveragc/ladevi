import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

const BreadcrumbsBarContainer = styled.nav`
  width: 100%;
  //margin-top: 1rem;
`;

const BreadcrumbsBar = ({ breadcrumbs }) => (
  <BreadcrumbsBarContainer aria-label='breadcrumb'>
    <ol className='breadcrumb'>
      {breadcrumbs.map(({ breadcrumb, match, location }) => (
        <Link
          key={match.url}
          className={`breadcrumb-item ${
            location.pathname === match.url ? 'active' : null
          }`}
          to={match.url}
        >
          {breadcrumb}
        </Link>
      ))}
    </ol>
  </BreadcrumbsBarContainer>
);

BreadcrumbsBar.propTypes = {};

export default withBreadcrumbs()(BreadcrumbsBar);
