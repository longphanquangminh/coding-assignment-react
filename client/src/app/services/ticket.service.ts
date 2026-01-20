import { api } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { ACTIONS } from '../constants/actions.constant';
import { STATUS_CODE } from '../constants/statusCode.constant';
import { TicketMetadata, AssignTicketParams, UnassignTicketParams, EditTicketInfoParams } from '../interfaces/ticket.interface';
import { Ticket } from '@acme/shared-models';

export const getTickets = async (): Promise<Ticket[]> => {
  const endpoint = `${ENDPOINTS.tickets.list}`;
  const response = await api.get(endpoint);
  return response?.data || [];
};

export const getTicket = async (id: string): Promise<Ticket | null> => {
  const endpoint = `${ENDPOINTS.tickets.list}/${id}`;
  const response = await api.get(endpoint);
  return response?.data || null;
};

export const createTicket = async (params: TicketMetadata): Promise<Ticket | null> => {
  const endpoint = `${ENDPOINTS.tickets.list}`;
  const response = await api.post(endpoint, params);
  return response?.data || null;
};

export const assignTicket = async (params: AssignTicketParams): Promise<boolean> => {
  const { ticketId, userId } = params || {};
  const endpoint = `${ENDPOINTS.tickets.list}/${ticketId}/${ACTIONS.assign}/${userId}`;
  const response = await api.put(endpoint);
  return response?.status === STATUS_CODE.NO_CONTENT;
};

export const unassignTicket = async (params: UnassignTicketParams): Promise<boolean> => {
  const { ticketId } = params || {};
  const endpoint = `${ENDPOINTS.tickets.list}/${ticketId}/${ACTIONS.unassign}`;
  const response = await api.put(endpoint);
  return response?.status === STATUS_CODE.NO_CONTENT;
};

export const markTicketStatus = async (params: EditTicketInfoParams): Promise<boolean> => {
  const { ticketId, completed } = params || {};
  const endpoint = `${ENDPOINTS.tickets.list}/${ticketId}/${ACTIONS.complete}`;
  const method = completed ? 'put' : 'delete';
  const response = await api[method](endpoint);
  return response?.status === STATUS_CODE.NO_CONTENT;
};
