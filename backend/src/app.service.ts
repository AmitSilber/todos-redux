import { Injectable } from '@nestjs/common';
import { TodoDto } from './dto/todoDto';
import { ConnectionService } from './app.connectionService';

@Injectable()
export class AppService {
  private connectionService = new ConnectionService();

  async create(todo: TodoDto): Promise<any> {
    const newTodoOrder = await this.getNextTodoMaxOrder();
    const insertTodoQuery = `
    INSERT INTO "todosTable" (id,title,date,status,todosorder)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *;`;
    const todoValues = [
      todo.id,
      todo.title,
      todo.date,
      todo.status,
      newTodoOrder,
    ];
    return this.connectionService.query(insertTodoQuery, todoValues);
  }

  async getNextTodoMaxOrder(): Promise<number> {
    const maxOrderQuery = `SELECT todosorder FROM "todosTable" ORDER BY todosorder DESC LIMIT 1`;
    const resultRows = (await this.connectionService.query(maxOrderQuery)).rows;
    const maxOrder = !resultRows.length
      ? 0
      : (resultRows[0]['todosorder'] as number);
    return maxOrder + 1;
  }

  async findAll(): Promise<any> {
    const selectAllQuery = `SELECT * FROM "todosTable" ORDER BY todosorder ASC LIMIT 100;`;
    return this.connectionService.query(selectAllQuery);
  }

  async findOne(id: string): Promise<any> {
    const selectTodoQuery = `SELECT * FROM "todosTable" WHERE id='${id}';`;
    return this.connectionService.query(selectTodoQuery);
  }

  async updateTodo(updatedTodo: TodoDto): Promise<any> {
    const todoAttributesPairs = Object.entries(updatedTodo)
      .filter(([key, value]) => key !== 'id')
      .map(([key, value]) => `${key}='${value}'`)
      .join(', ');
    const updateTodoQuery = `UPDATE "todosTable" SET ${todoAttributesPairs} WHERE id='${updatedTodo.id}' RETURNING *;`;
    return this.connectionService.query(updateTodoQuery);
  }
  async removeTodo(idToRemove: string): Promise<any> {
    const removeQuery = `DELETE FROM "todosTable" WHERE id='${idToRemove}' RETURNING *`;
    return this.connectionService.query(removeQuery);
  }

  async reorderTodos(newIdsOrder: string[]): Promise<any> {
    const updatedOrder = newIdsOrder
      .map((id, index) => `WHEN id = '${id}' THEN ${index}`)
      .join(' ');
    const updateTodosOrderQuery = `UPDATE "todosTable" SET todosorder = CASE ${updatedOrder} ELSE todosorder END;`;
    return this.connectionService.query(updateTodosOrderQuery);
  }

  //   const client = await this.connectionService.getPoolConnection();
  //   try {
  //     await client.query('BEGIN');
  //     await Promise.all(
  //       newIdsOrder.map(async (todoId, index) => {
  //         const updateOrderQuery = `UPDATE "todosTable" SET todosorder=${index} WHERE id='${todoId}'`;
  //         await client.query(updateOrderQuery);
  //       }),
  //     );
  //     await client.query('COMMIT');
  //   } catch (e) {
  //     await client.query('ROLLBACK');
  //     throw e;
  //   } finally {
  //     client.release();
  //   }
  // }
}
