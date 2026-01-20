import { render } from '@testing-library/react';

import Tickets from './tickets';
import { filterTickets } from './utils/filterTickets.util';
import { StatusMode } from './enums/statusMode.enum';
import { Ticket } from '@acme/shared-models';

describe('Tickets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tickets />);
    expect(baseElement).toBeTruthy();
  });
});

describe('should filter tickets correctly', () => {
  const tickets: Ticket[] = [
    { id: 1, description: 'A', completed: true, assigneeId: 1 },
    { id: 2, description: 'B', completed: false, assigneeId: 1 },
    { id: 3, description: 'C', completed: true, assigneeId: null },
    { id: 4, description: 'D', completed: false, assigneeId: null },
    { id: 5, description: 'E', completed: false, assigneeId: 2 },
  ];

  it('returns all tickets when statusMode=ALL and assigneeId=-1', () => {
    const result = filterTickets(tickets, {
      statusMode: StatusMode.ALL,
      assigneeId: -1,
    });

    expect(result.map((t: Ticket) => t.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('filters by statusMode=COMPLETED', () => {
    const result = filterTickets(tickets, {
      statusMode: StatusMode.COMPLETED,
      assigneeId: -1,
    });

    expect(result.map((t: Ticket) => t.id)).toEqual([1, 3]);
  });

  it('filters by statusMode=INCOMPLETE', () => {
    const result = filterTickets(tickets, {
      statusMode: StatusMode.INCOMPLETE,
      assigneeId: -1,
    });

    expect(result.map((t: Ticket) => t.id)).toEqual([2, 4, 5]);
  });

  it('filters by assigneeId=0 (Unassigned)', () => {
    const result = filterTickets(tickets, {
      statusMode: StatusMode.ALL,
      assigneeId: 0,
    });

    expect(result.map((t: Ticket) => t.id)).toEqual([3, 4]);
  });

  it('filters by assigneeId=2 (specific user)', () => {
    const result = filterTickets(tickets, {
      statusMode: StatusMode.ALL,
      assigneeId: 2,
    });

    expect(result.map((t: Ticket) => t.id)).toEqual([5]);
  });

  it('supports combined status + assignee filter', () => {
    const result = filterTickets(tickets, {
      statusMode: StatusMode.INCOMPLETE,
      assigneeId: 1,
    });

    expect(result.map((t: Ticket) => t.id)).toEqual([2]);
  });
});
