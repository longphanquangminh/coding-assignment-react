import { Ticket } from '@acme/shared-models';

export interface TicketMetadata extends Omit<Ticket, 'id' | 'assigneeId' | 'completed'> {
  description: string;
}

export interface UnassignTicketParams {
  ticketId: number;
}

export interface AssignTicketParams extends UnassignTicketParams {
  userId: number;
}

export interface EditTicketInfoParams {
  ticketId: number;
  completed: boolean;
}
