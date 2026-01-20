import styles from './create-ticket-dialog.module.css';
import { FC, useEffect, useState } from 'react';
import WillRender from '../../components/will-render/WillRender';
import { createTicket } from '../../services/ticket.service';

interface CreateTicketDialogProps {
    onSuccess: () => void;
}

const CreateTicketDialog: FC<CreateTicketDialogProps> = (props) => {
    const { onSuccess } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShowCreateTicketModal = () => {
        setIsOpen(true);
    }

    const handleHideCreateTicketModal = () => {
        setLoading(false);
        setIsOpen(false);
    }

    const handleSubmit = async () => {
        if (description.trim() === '') {
            setErrorMessage('Description is required');
            return;
        }
        try {
            setLoading(true);
            const ticket = await createTicket({ description });
            if (ticket) {
                setIsOpen(false);
                setDescription('');
                onSuccess();
            }
        } catch (error) {
            console.error('[CreateTicketApiError]', error);
            setErrorMessage('Failed to create ticket, please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
        setErrorMessage('');
    }

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

  return (
    <>
        <button className={styles['create-ticket-button']} onClick={handleShowCreateTicketModal}>Create ticket</button>
        <WillRender when={isOpen}>
            <div onClick={handleHideCreateTicketModal} className={styles['create-ticket-dialog-backdrop']} />
        </WillRender>
        <dialog className={styles['create-ticket-dialog']} open={isOpen} onClose={handleHideCreateTicketModal}>
            <h2>Create Ticket</h2>
            <input type="text" placeholder="Description" value={description} onChange={handleChangeDescription} />
            <button onClick={handleSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
            <p>{errorMessage}</p>
        </dialog>
    </>
  );
};

export default CreateTicketDialog;
