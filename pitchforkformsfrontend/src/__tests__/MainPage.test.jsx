// MainPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainPage from '../Components/Pages/MainPage';
import '@testing-library/jest-dom'; 


// Mock lazy-loaded components
jest.mock('../Components/Carousel', () => () => <div data-testid="carousel">Mock Carousel</div>);
jest.mock('../Components/RegisterModal', () => (props) =>
  props.open ? (
    <div data-testid="register-modal">
      Register Modal
      <button onClick={props.handleClose}>Close</button>
    </div>
  ) : null
);
jest.mock('../Components/LoginModal', () => (props) =>
  props.open ? (
    <div data-testid="login-modal">
      Login Modal
      <button onClick={props.handleClose}>Close</button>
    </div>
  ) : null
);

describe('MainPage', () => {
  it('renders title and description', () => {
    render(<MainPage />);
    expect(screen.getByText(/Pitchfork Forms/i)).toBeInTheDocument();
    expect(screen.getByText(/Create, share, and evaluate forms/i)).toBeInTheDocument();
  });

  it('renders Carousel component', async () => {
    render(<MainPage />);
    expect(await screen.findByTestId('carousel')).toBeInTheDocument();
  });

  it('opens RegisterModal on "Get Started" button click', async () => {
    render(<MainPage />);
    fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
    expect(await screen.findByTestId('register-modal')).toBeInTheDocument();
  });

  it('opens RegisterModal on "Create Your Free Account" button click', async () => {
    render(<MainPage />);
    fireEvent.click(screen.getByRole('button', { name: /Create Your Free Account/i }));
    expect(await screen.findByTestId('register-modal')).toBeInTheDocument();
  });

  it('closes RegisterModal when close button is clicked', async () => {
    render(<MainPage />);
    fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
    const closeButton = await screen.findByText('Close');
    fireEvent.click(closeButton);
    await waitFor(() =>
      expect(screen.queryByTestId('register-modal')).not.toBeInTheDocument()
    );
  });
});
