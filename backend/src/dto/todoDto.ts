import { IsString, IsIn, IsUUID } from 'class-validator';
const statusValues = ['pending', 'completed'] as const;
export type StatusValuesTypes = (typeof statusValues)[number];

export class TodoDto {
  @IsString()
  title: string;
  @IsString()
  date: string;
  @IsIn(statusValues)
  status: StatusValuesTypes;
  @IsUUID()
  id: string;
}

export class TodoDatabaseRow extends TodoDto {
  todosorder: number;
}

export type TodosDto = {
  entries: {
    [id: string]: TodoDto;
  };
  todoIdsInOrder: string[];
};

export type TodosOrderDto = string[];
export class LimitGet {
  limit: number;
}
