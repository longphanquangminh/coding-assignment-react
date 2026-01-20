import { StatusMode } from '../enums/statusMode.enum';

export interface GetTicketListParams {
    shouldFetchUserList?: boolean;
}

export interface Filters {
    statusMode: StatusMode;
    assigneeId: number;
}
