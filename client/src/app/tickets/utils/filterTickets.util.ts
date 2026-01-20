import { Ticket } from '@acme/shared-models';
import { StatusMode } from '../enums/statusMode.enum';
import { Filters } from '../interfaces/requestData.interface';

export const filterTickets = (tickets: Ticket[], filters: Filters) => {
    const { statusMode = StatusMode.ALL, assigneeId: filterAssigneeId = -1 } = filters || {};

    const filteredTickets = tickets.filter((t) => {
    let isOk = true;

    const { completed = false, assigneeId = null } = t || {};

    if (statusMode && statusMode !== StatusMode.ALL) {
      isOk = completed === (statusMode === StatusMode.COMPLETED);
    }

    const filterAssigneeIdValue = Number(filterAssigneeId);
    if (isOk && !isNaN(filterAssigneeIdValue) && filterAssigneeIdValue !== -1) {
      isOk = filterAssigneeIdValue === 0 ? assigneeId === null : Number(assigneeId) === filterAssigneeIdValue;
    }

    return isOk;
  });

  return filteredTickets;
}
