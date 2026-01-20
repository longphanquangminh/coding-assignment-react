import { Ticket, User } from '@acme/shared-models';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WillRender from '../components/will-render/WillRender';
import { assignTicket, getTicket, markTicketStatus, unassignTicket } from '../services/ticket.service';
import { getUser, getUsers } from '../services/user.service';
import { Loading } from './interfaces/loading.interface';
import styles from './ticket-details.module.css';

export function TicketDetails() {
  const [ticketDetail, setTicketDetail] = useState<Ticket | null>(null);
  const [loadingStatus, setLoadingStatus] = useState({ all: true } as Loading);
  const [users, setUsers] = useState<User[]>([]);

  const { id } = useParams();

  const { description, assigneeId, completed = false } = ticketDetail || {};

  const hasTicketDetail = !!ticketDetail;

  const handleChangeAssignee = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const newValue = Number(value);
    if (newValue === assigneeId || (!newValue && !assigneeId)) return;
    try {
      setLoadingStatus({ ...loadingStatus, isUserChanging: true });
      const isSuccess = newValue ? await assignTicket({ ticketId: Number(id), userId: newValue }) : await unassignTicket({ ticketId: Number(id) });
      if (isSuccess) {
        setTicketDetail({ ...ticketDetail, assigneeId: newValue } as Ticket);
      }
    } catch (error) {
      console.error('[ChangeAssigneeError]', error);
    } finally {
      setLoadingStatus({ ...loadingStatus, isUserChanging: false });
    }
  }

  const handleGetTicketDetailInfo = async () => {
    try {
      setLoadingStatus({ ...loadingStatus, all: true });
      const idValue = id as string;
      const ticket = await getTicket(idValue);
      const { assigneeId } = ticket || {};
      const assigneeInfo = assigneeId ? await getUser(assigneeId.toString()) : null;
      setTicketDetail(ticket || null);
      if (assigneeInfo) {
        setUsers([assigneeInfo]);
      }
    } catch (error) {
      console.error('[GetTicketDetailInfoError]', error);
    } finally {
      setLoadingStatus({ ...loadingStatus, all: false });
    }
  };

  const handleChangeTicketCompleteStatus = async (shouldMarkAsComplete: boolean) => {
    try {
      setLoadingStatus({ ...loadingStatus, isStatusChanging: true });
      const isSuccess = await markTicketStatus({ ticketId: Number(id), completed: shouldMarkAsComplete });
      if (isSuccess) {
        setTicketDetail({ ...ticketDetail, completed: shouldMarkAsComplete } as Ticket);
      }
    } catch (error) {
      console.error('[ChangeTicketCompleteStatusError]', error);
    } finally {
      setLoadingStatus({ ...loadingStatus, isStatusChanging: false });
    }
  }

  const onChangeCompleteStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked = false } = event.target;
    handleChangeTicketCompleteStatus(checked);
  };

  const handleGetUsers = async () => {
    if (loadingStatus.isFetchingUsers) return;
    if (users.find(user => user.id !== assigneeId)) return;
    try {
      setLoadingStatus({ ...loadingStatus, isFetchingUsers: true });
      const users = await getUsers();
      setUsers(users);
    } catch (error) {
      console.error('[GetUsersError]', error);
    } finally {
      setLoadingStatus({ ...loadingStatus, isFetchingUsers: false });
    }
  }

  useEffect(() => {
    setTicketDetail(null);
    handleGetTicketDetailInfo();
  }, [id]);

  return (
    <div className={styles['container']}>
    <WillRender when={loadingStatus.all}>
      <div>Loading...</div>
    </WillRender>
    <WillRender when={!loadingStatus.all}>
      <WillRender when={hasTicketDetail}>
        <p>Ticket ID: {id}</p>
        <p>Description: {description}</p>
        <div>
          <span>Assignee: </span>
          <select disabled={loadingStatus.isUserChanging} onFocus={handleGetUsers} value={assigneeId || 0} onChange={handleChangeAssignee}>
            {users.map(user => {
              const { id, name } = user || {};
              return (
                <option key={id} value={id}>
                  <span>{name} (ID: {id})</span>
                </option>
              )
            })}
            <option value={0}>{loadingStatus.isUserChanging ? 'Loading...' : 'Unassigned'}</option>
          </select>
          <WillRender when={loadingStatus.isUserChanging || loadingStatus.isFetchingUsers}>
            <span>Loading...</span>
          </WillRender>
        </div>
        <div>
          <input type="checkbox" id="status" name="status" disabled={loadingStatus.isStatusChanging} checked={completed} onChange={onChangeCompleteStatus} />
          <label htmlFor="status">{loadingStatus.isStatusChanging ? 'Marking status...' : 'Completed'}</label>
        </div>
      </WillRender>
      <WillRender when={!hasTicketDetail}>
        <div>No ticket detail found, please try again later</div>
      </WillRender>
    </WillRender>
    </div>
  );
};

export default TicketDetails;
