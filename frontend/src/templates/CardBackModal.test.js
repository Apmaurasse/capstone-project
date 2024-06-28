import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CardBackModal from './CardBackModal';
import ProjectOmegaContext from '../auth/ProjectOmegaContext';

const mockContextValue = {
  likedCardBacks: new Set(),
  collectedCardBacks: new Set(),
  likeCardBack: jest.fn(),
  unlikeCardBack: jest.fn(),
  collectCardBack: jest.fn(),
  uncollectCardBack: jest.fn(),
};

const selectedCard = {
  id: '1',
  name: 'Test Card Back',
  text: 'This is a test card back description.',
  imageUrl: 'http://example.com/test-image.jpg',
};

describe('CardBackModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with selected card details', () => {
    render(
      <ProjectOmegaContext.Provider value={mockContextValue}>
        <CardBackModal show={true} handleCloseModal={jest.fn()} selectedCard={selectedCard} />
      </ProjectOmegaContext.Provider>
    );

    expect(screen.getByText('Test Card Back')).toBeInTheDocument();
    expect(screen.getByText('This is a test card back description.')).toBeInTheDocument();
    expect(screen.getByAltText('Test Card Back')).toHaveAttribute('src', 'http://example.com/test-image.jpg');
  });

  it('calls handleCloseModal when close button is clicked', () => {
    const handleCloseModal = jest.fn();

    render(
      <ProjectOmegaContext.Provider value={mockContextValue}>
        <CardBackModal show={true} handleCloseModal={handleCloseModal} selectedCard={selectedCard} />
      </ProjectOmegaContext.Provider>
    );

    fireEvent.click(screen.getByText('X'));
    expect(handleCloseModal).toHaveBeenCalledTimes(1);
  });

});