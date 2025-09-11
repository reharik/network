import { Link, NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './contexts/AuthContext';
import { Button, HStack, Spacer } from './ui/Primitives';

export const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
`;

export const NavBar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(15, 17, 21, 0.85);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const NavInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 24px;
`;

export const Brand = styled(Link)`
  font-weight: 800;
  letter-spacing: 0.3px;
`;

export const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.subtext};
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  &:hover {
    background: #121622;
    color: ${({ theme }) => theme.colors.text};
  }
  &.active {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <NavBar>
        <NavInner>
          <HStack>
            <Brand to="/">PingPals</Brand>
            <StyledNavLink to="/" end>
              Today
            </StyledNavLink>
            <StyledNavLink to="/contacts">Contacts</StyledNavLink>
            <StyledNavLink to="/import">Import</StyledNavLink>
            <StyledNavLink to="/settings">Settings</StyledNavLink>
            <Spacer />
            {user && (
              <HStack>
                <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  {user.firstName} {user.lastName}
                </span>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Logout
                </Button>
              </HStack>
            )}
          </HStack>
        </NavInner>
      </NavBar>

      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
};
