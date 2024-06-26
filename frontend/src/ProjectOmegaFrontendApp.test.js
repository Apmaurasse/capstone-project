import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import ProjectOmegaFrontendApp, { TOKEN_STORAGE_ID } from './ProjectOmegaFrontendApp';
import ProjectOmegaApi from './api/api';

// Mock the ProjectOmegaApi module to simulate API responses
jest.mock('./api/api');

describe('ProjectOmegaFrontendApp', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders application after loading', async () => {
    // Mock a successful getCurrentUser call
    ProjectOmegaApi.getCurrentUser.mockResolvedValueOnce({ username: 'testuser' });

    const { findByText } = render(<ProjectOmegaFrontendApp />);

    // Using regular expression for flexible match
    const welcomeText = await findByText(/A site for viewing Hearthstone card backs/i);
    expect(welcomeText).toBeInTheDocument();
  });

});

