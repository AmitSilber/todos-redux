import { TodoDto } from './dto/todoDto';
import { ConnectionService } from './app.connectionService';
import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { TodoDatabaseRow } from './dto/todoDto';

@Injectable()
export default class TodosDatabase {
  private connectionService = new ConnectionService();

  async upsertTodo(todo: TodoDto, todoOrder?: number) {
    const insertTodoQuery = `
    INSERT INTO "todosTable" (id,title,date,status,todosorder)
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (id)
    DO UPDATE SET title = EXCLUDED.title,date = EXCLUDED.date,status = EXCLUDED.status
    RETURNING *;`;
    const todoValues = [todo.id, todo.title, todo.date, todo.status, todoOrder];
    return this.connectionService
      .query(insertTodoQuery, todoValues)
      .then((query) => {
        const todosAffected = query.rows;
        if (todosAffected.length !== 1) {
          throw new ConflictException('conflict happend', {
            cause: new Error(),
            description: 'request yeilded more than one result',
          });
        }
        return todosAffected[0] as TodoDatabaseRow;
      });
  }

  public async getCurrentTodoMaxOrder() {
    const maxOrderQuery = `SELECT * FROM "todosTable" ORDER BY todosorder DESC LIMIT 1`;
    const resultRows = (await this.connectionService.query(maxOrderQuery)).rows;
    return !resultRows.length ? 0 : (resultRows[0]['todosorder'] as number);
  }

  public async getAllTodos() {
    const selectAllQuery = `SELECT * FROM "todosTable" ORDER BY todosorder ASC;`;
    return this.connectionService
      .query(selectAllQuery)
      .then((query) => query.rows as TodoDatabaseRow[]);
  }

  public async getTodoById(id: string) {
    const selectTodoQuery = `SELECT * FROM "todosTable" WHERE id='${id}';`;
    return this.connectionService.query(selectTodoQuery).then((query) => {
      return query.rows[0] as TodoDatabaseRow;
    });
  }

  public async removeTodo(idToRemove: string) {
    const removeQuery = `DELETE FROM "todosTable" WHERE id='${idToRemove}' RETURNING *`;
    return this.connectionService.query(removeQuery).then((query) => {
      return query.rows[0] as TodoDatabaseRow;
    });
  }

  public async reorderTodos(newIdsOrder: string[]): Promise<number> {
    const updatedOrder = newIdsOrder
      .map((id, index) => `WHEN id = '${id}' THEN ${index}`)
      .join(' ');
    const updateTodosOrderQuery = `UPDATE "todosTable" SET todosorder = CASE ${updatedOrder} ELSE todosorder END;`;
    return this.connectionService
      .query(updateTodosOrderQuery)
      .then((query) => query.rowCount);
  }
}
