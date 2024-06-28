import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import NavbarComponent from './Navbar';
import ProjectOmegaContext from '../auth/ProjectOmegaContext';

// Mock the logout function
const mockLogout = jest.fn();

const renderNavbar = (currentUser) => {
  return render(
    <Router>
      <ProjectOmegaContext.Provider value={{ currentUser }}>
        <NavbarComponent logout={mockLogout} />
      </ProjectOmegaContext.Provider>
    </Router>
  );
};

describe('Navbar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Navbar with links for logged-out users', () => {
    renderNavbar(null);

    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Card Backs')).not.toBeInTheDocument();
    expect(screen.queryByText('Likes')).not.toBeInTheDocument();
    expect(screen.queryByText('Collection')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('renders Navbar with links for logged-in users', () => {
    const currentUser = { username: 'testuser', firstName: 'Test' };
    renderNavbar(currentUser);

    expect(screen.queryByText('Signup')).not.toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Card Backs')).toBeInTheDocument();
    expect(screen.getByText('Likes')).toBeInTheDocument();
    expect(screen.getByText('Collection')).toBeInTheDocument();
    expect(screen.getByText('Logout Test')).toBeInTheDocument();
  });

  it('calls logout function when logout link is clicked', () => {
    const currentUser = { username: 'testuser', firstName: 'Test' };
    renderNavbar(currentUser);

    fireEvent.click(screen.getByText('Logout Test'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
