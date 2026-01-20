import { render, screen } from '@testing-library/react';

import TicketDetails from './ticket-details';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

jest.mock('../services/ticket.service', () => ({
  getTicket: jest.fn(),
  assignTicket: jest.fn(),
  unassignTicket: jest.fn(),
  markTicketStatus: jest.fn(),
}));

jest.mock('../services/user.service', () => ({
  getUser: jest.fn(),
  getUsers: jest.fn(),
}));

const mockGetTicket = require('../services/ticket.service').getTicket as jest.Mock;

describe('TicketDetails', () => {

  it('should render successfully', async () => {
    mockGetTicket.mockResolvedValueOnce(null);
    const { baseElement } = render(<TicketDetails />);
    expect(baseElement).toBeTruthy();

    expect(
      await screen.findByText('No ticket detail found, please try again later')
    ).toBeInTheDocument();
  });

});
