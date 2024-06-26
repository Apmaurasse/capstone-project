import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupForm from './SignupForm';
import Alert from '../common/Alert';

// Mock the Alert component
jest.mock('../common/Alert', () => () => <div data-testid="alert">Mock Alert</div>);

describe('SignupForm', () => {
  let signupMock;

  beforeEach(() => {
    signupMock = jest.fn();
  });

  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <SignupForm signup={signupMock} />
      </MemoryRouter>
    );
  });

  test('renders the form with initial values', () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <SignupForm signup={signupMock} />
      </MemoryRouter>
    );

    expect(getByLabelText('Username').value).toBe('');
    expect(getByLabelText('Email').value).toBe('');
    expect(getByLabelText('Password').value).toBe('');
    expect(getByLabelText('First Name').value).toBe('');
    expect(getByLabelText('Last Name').value).toBe('');
  });

  test('handles input changes correctly', () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <SignupForm signup={signupMock} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'Test' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'User' } });

    expect(getByLabelText('Username').value).toBe('testuser');
    expect(getByLabelText('Email').value).toBe('testuser@example.com');
    expect(getByLabelText('Password').value).toBe('testpassword');
    expect(getByLabelText('First Name').value).toBe('Test');
    expect(getByLabelText('Last Name').value).toBe('User');
  });

  test('calls signup function on form submission', async () => {
    signupMock.mockResolvedValueOnce({ success: true });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <SignupForm signup={signupMock} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'Test' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'User' } });

    fireEvent.click(getByText('Signup'));

    await waitFor(() => {
      expect(signupMock).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
        firstName: 'Test',
        lastName: 'User',
      });
    });
  });

  test('shows alert on signup failure', async () => {
    signupMock.mockResolvedValueOnce({ success: false, errors: ['Error creating account'] });

    const { getByLabelText, getByText, findByTestId } = render(
      <MemoryRouter>
        <SignupForm signup={signupMock} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'Test' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'User' } });

    fireEvent.click(getByText('Signup'));

    const alert = await findByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(signupMock).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      firstName: 'Test',
      lastName: 'User',
    });
  });
});
