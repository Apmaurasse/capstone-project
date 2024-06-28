import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CardBackList from './CardBackList';
import ProjectOmegaApi from '../api/api';
import CardBackModal from './CardBackModal';

// Mock the API call
jest.mock('../api/api');
jest.mock('./CardBackModal', () => ({ show, handleCloseModal, selectedCard }) => (
  show ? (
    <div>
      <button onClick={handleCloseModal}>Close</button>
      <div data-testid="modal-content">{selectedCard.name}</div>
    </div>
  ) : null
));

const mockCardBacks = [
  { id: '1', name: 'Card Back 1', text: 'Description 1', imageUrl: 'url1', sortCategory: 'category1', slug: 'slug1' },
  { id: '2', name: 'Card Back 2', text: 'Description 2', imageUrl: 'url2', sortCategory: 'category2', slug: 'slug2' },
];

describe('CardBackList', () => {
  beforeEach(() => {
    ProjectOmegaApi.getCardBacks.mockResolvedValue(mockCardBacks);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner initially', () => {
    render(<CardBackList />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });


  it('renders card backs after loading', async () => {
    render(<CardBackList />);

    await waitFor(() => expect(screen.getByText('Card Back 1')).toBeInTheDocument());
    expect(screen.getByText('Card Back 2')).toBeInTheDocument();
  });

  it('shows modal with selected card details when a card is clicked', async () => {
    render(<CardBackList />);

    await waitFor(() => expect(screen.getByText('Card Back 1')).toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Card Back 1'));
    expect(screen.getByTestId('modal-content')).toHaveTextContent('Card Back 1');
  });

  it('closes modal when close button is clicked', async () => {
    render(<CardBackList />);

    await waitFor(() => expect(screen.getByText('Card Back 1')).toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Card Back 1'));
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });
});

