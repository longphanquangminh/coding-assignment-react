import { Ticket, User } from '@acme/shared-models';
import { useEffect, useState } from 'react';
import WillRender from '../components/will-render/WillRender';
import { getTickets } from '../services/ticket.service';
import { getUsers } from '../services/user.service';
import CreateTicketDialog from './create-ticket-dialog/CreateTicketDialog';
import { StatusMode } from './enums/statusMode.enum';
import { Filters, GetTicketListParams } from './interfaces/requestData.interface';
import TicketItem from './ticket-item/TicketItem';
import styles from './tickets.module.css';
import { filterTickets } from './utils/filterTickets.util';

export function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({} as Filters);


  const filteredTickets = filterTickets(tickets, filters);

  const hasTickets = filteredTickets.length > 0;

  const handleGetData = async (params?: GetTicketListParams) => {
    const { shouldFetchUserList = true } = params || {};

    try {
      setIsLoading(true);
      const requests: Promise<any>[] = [getTickets()];
      if (shouldFetchUserList) {
        requests.push(getUsers());
      }
      const [ticketsResult, usersResult] = await Promise.allSettled(requests);
      setTickets(ticketsResult.status === 'fulfilled' ? ticketsResult.value : []);
      setUsers(usersResult.status === 'fulfilled' ? usersResult?.value?.reduce((acc: Record<number, User>, user: User) => {
        const { id } = user || {};
        acc[id] = user;
        return acc;
      }, {} as Record<number, User>) : {});
    } catch (error) {
      console.error('[GetDataApiError]', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessCreation = () => {
    handleGetData({ shouldFetchUserList: false });
  }

  const handleFilterCompleteMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilters({ ...filters, statusMode: value as StatusMode || StatusMode.ALL });
  }

  const handleFilterAssigneeId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilters({ ...filters, assigneeId: Number(value) });
  }

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div className={styles['tickets']}>
      <h2>Tickets</h2>
      <CreateTicketDialog onSuccess={handleSuccessCreation} />
      <div className={styles['filters']}>
        <select onChange={handleFilterCompleteMode}>
          <option value={StatusMode.ALL}>Status: All</option>
          <option value={StatusMode.COMPLETED}>Completed</option>
          <option value={StatusMode.INCOMPLETE}>Incomplete</option>
        </select>
        <select onChange={handleFilterAssigneeId}>
          <option value={-1}>Assignee: All</option>
          <option value={0}>Unassigned</option>
          {Object.values(users).map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
      <WillRender when={isLoading}>
        <div>Loading...</div>
      </WillRender>
      <WillRender when={!isLoading}>
        <WillRender when={hasTickets}>
          <div className={styles['tickets-list']}>
            {filteredTickets.map((t) => {
              const { id, assigneeId } = t || {};
              const assigneeInfo = assigneeId ? users[assigneeId] :  null;
              return (
                <TicketItem key={`ticket-${id}`} ticket={t} userInfo={assigneeInfo} />
            )
            })}
          </div>
        </WillRender>
        <WillRender when={!hasTickets}>
          <div>No tickets found</div>
        </WillRender>
      </WillRender>
    </div>
  );
}

export default Tickets;
