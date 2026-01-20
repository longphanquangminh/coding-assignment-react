import { Ticket, User } from '@acme/shared-models';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ticket-item.module.css';

interface TicketItemProps {
    ticket: Ticket;
    userInfo: User | null;
}

const TicketItem: FC<TicketItemProps> = (props) => {
    const { ticket, userInfo } = props;

    const { id, description, assigneeId, completed = false } = ticket || {};
    const assigneeInfo = assigneeId ? userInfo?.name : 'Unassigned';

    const navigate = useNavigate();

  const handleGoToDetails = (id: number) => {
    navigate(`/tickets/${id}`);
  };

    return (
        <div className={styles['ticket']}>
            <p>
                Ticket: {id}, {description}, assignee: {assigneeInfo}, completed: {completed.toString()}
            </p>
            <button onClick={() => handleGoToDetails(id)}>Go to details</button>
        </div>
    )
}

export default TicketItem;
