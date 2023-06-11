import { Injectable } from '@nestjs/common';
import { TodoDatabaseRow, TodoDto, TodosDto } from './dto/todoDto';
import { ConflictException } from '@nestjs/common';
import TodosDatabase from './TodosDatabase';

@Injectable()
export class AppService {
  constructor(
    private readonly todosDatabase: TodosDatabase = new TodosDatabase(),
  ) {}
  async create(todo: TodoDto): Promise<TodoDatabaseRow> {
    const newTodoOrder = await this.getNextTodoMaxOrder();
    return this.todosDatabase.upsertTodo(todo, newTodoOrder);
  }
  private async getNextTodoMaxOrder(): Promise<number> {
    return (await this.todosDatabase.getCurrentTodoMaxOrder()) + 1;
  }

  async findAll(): Promise<TodosDto> {
    return this.todosDatabase.getAllTodos().then((todos) => {
      const todosJsonWithOrderedIds = {
        entries: todos.reduce((resultJson, todo) => {
          resultJson[todo.id] = todo;
          return resultJson;
        }, {}),
        todoIdsInOrder: todos.map((todo) => todo.id),
      };
      return todosJsonWithOrderedIds as TodosDto;
    });
  }

  async findOne(id: string): Promise<TodoDatabaseRow> {
    return await this.todosDatabase.getTodoById(id);
  }

  async updateTodo(updatedTodo: TodoDto): Promise<TodoDatabaseRow> {
    const todoInDB = await this.findOne(updatedTodo.id);
    return await this.todosDatabase.upsertTodo(
      updatedTodo,
      todoInDB.todosorder,
    );
  }
  async removeTodo(idToRemove: string): Promise<TodoDatabaseRow> {
    return await this.todosDatabase.removeTodo(idToRemove);
  }

  async reorderTodos(newIdsOrder: string[]): Promise<any> {
    return this.todosDatabase.reorderTodos(newIdsOrder);
  }
}
