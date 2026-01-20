import { User } from '@acme/shared-models';
import { api } from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const getUsers = async (): Promise<User[]> => {
  const endpoint = `${ENDPOINTS.users.list}`;
  const response = await api.get(endpoint);
  return response?.data || [];
};

export const getUser = async (id: string): Promise<User | null> => {
  const endpoint = `${ENDPOINTS.users.list}/${id}`;
  const response = await api.get(endpoint);
  return response?.data || null;
};
