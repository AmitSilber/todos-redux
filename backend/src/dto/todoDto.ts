import { IsString, IsIn, IsInt, IsUUID } from 'class-validator';
const todoStatusValues = ['pending', 'completed'] as const;
const todoStringKeys = ['title', 'date'] as const;
const todoStatusKey = ['status'] as const;
export type TodoStringKeyTypes = (typeof todoStringKeys)[number];
export type statusValues = (typeof todoStatusValues)[number];

export class TodoDto {
  @IsString()
  title: string;
  @IsString()
  date: string;
  @IsIn(todoStatusValues)
  status: statusValues;
  @IsUUID()
  id: string;
}

export type todosDto = {
  entries: {
    [id: string]: TodoDto;
  };
  todoIdsInOrder: string[];
};

export type TodosOrderDto = string[];
export class LimitGet {
  limit: number;
}
