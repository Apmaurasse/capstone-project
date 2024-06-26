import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import Alert from '../common/Alert';

// Mock the Alert component
jest.mock('../common/Alert', () => () => <div data-testid="alert">Mock Alert</div>);

describe('LoginForm', () => {
  let loginMock;

  beforeEach(() => {
    loginMock = jest.fn();
  });

  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <LoginForm login={loginMock} />
      </MemoryRouter>
    );
  });

  test('renders the form with initial values', () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <LoginForm login={loginMock} />
      </MemoryRouter>
    );

    expect(getByLabelText('Username').value).toBe('');
    expect(getByLabelText('Password').value).toBe('');
  });

  test('handles input changes correctly', () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <LoginForm login={loginMock} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });

    expect(getByLabelText('Username').value).toBe('testuser');
    expect(getByLabelText('Password').value).toBe('testpassword');
  });

  test('calls login function on form submission', async () => {
    loginMock.mockResolvedValueOnce({ success: true });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <LoginForm login={loginMock} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpassword',
      });
    });
  });

  test('shows alert on login failure', async () => {
    loginMock.mockResolvedValueOnce({ success: false, errors: ['Invalid username or password'] });

    const { getByLabelText, getByText, findByTestId } = render(
      <MemoryRouter>
        <LoginForm login={loginMock} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });

    fireEvent.click(getByText('Submit'));

    const alert = await findByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(loginMock).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpassword',
    });
  });
});

