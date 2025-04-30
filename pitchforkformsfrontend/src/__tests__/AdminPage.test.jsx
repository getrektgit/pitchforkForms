import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminPage from '../Components/Pages/AdminPage';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';


jest.mock('axios');

jest.mock('../Components/FormCard', () => () => <div data-testid="form-card">FormCard</div>);
jest.mock('@mui/icons-material/Add', () => () => <span>AddIcon</span>);

describe('AdminPage', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify({ id: 'user-123' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);

    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={ui} />
          <Route path="/admin/create-form" element={<div>Create Form Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('displays loading spinner initially', async () => {
    renderWithRouter(<AdminPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders form cards after successful fetch', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 'form1', name: 'Form 1', isFilledOutAtLeastOnce: false },
        { id: 'form2', name: 'Form 2', isFilledOutAtLeastOnce: true },
      ],
    });

    renderWithRouter(<AdminPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId('form-card')).toHaveLength(2);
    });
  });

  it('shows an error message if fetch fails', async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch' } },
    });

    renderWithRouter(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
    });
  });

  it('shows empty message and button if no forms exist', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithRouter(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText(/You don't have any forms yet/i)).toBeInTheDocument();
    });
  });

  it('navigates to create form page on button click', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithRouter(<AdminPage />);

    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(createButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Create Form Page')).toBeInTheDocument();
    });
  });
});
