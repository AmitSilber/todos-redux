import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  ConflictException,
  ParseArrayPipe,
  Res,
  HttpStatus,
  HttpCode,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { TodoDto } from './dto/todoDTO';
import { TodoValidationPipe } from './validation.pipe';
import { HttpExceptionFilter } from './HttpExceptionFilter';

@UseFilters(new HttpExceptionFilter())
@Controller('todos')
export class AppController {
  constructor(private readonly appService: AppService = new AppService()) {}

  @Post()
  async create(
    @Body(new TodoValidationPipe()) newTodoItem: TodoDto,
    @Res() res: Response,
  ) {
    await this.appService.create(newTodoItem);
    return res
      .status(HttpStatus.CREATED)
      .send({ message: 'created new todo successfully' });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const todos = (await this.appService.findAll()).rows as TodoDto[];
    const todosJsonWithOrderedIds = {
      entries: todos.reduce((resultJson, todo) => {
        resultJson[todo.id] = todo;
        return resultJson;
      }, {}),
      todoIdsInOrder: todos.map((todo) => todo.id),
    };
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            res.status(HttpStatus.ACCEPTED).json(todosJsonWithOrderedIds),
          ),
        2000,
      );
    });
  }

  @Get('order')
  async getTodosOrder(@Res() res: Response) {
    const todos = (await this.appService.findAll()).rows as TodoDto[];
    const todosOrder = { todoIdsOrder: todos.map((todo) => todo.id) };
    return res.status(HttpStatus.ACCEPTED).json(todosOrder);
  }

  @Get(':id')
  @UsePipes(new ParseUUIDPipe())
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const todosAffected = (await this.appService.findOne(id)).rows;
    if (todosAffected.length !== 1) {
      throwConflictError();
    }
    return res.status(HttpStatus.ACCEPTED).json(todosAffected[0] as TodoDto);
  }

  @Put()
  async updateTodo(
    @Body(new TodoValidationPipe())
    updateTodoDto: TodoDto,
    @Res() res: Response,
  ) {
    const todosAffected = (await this.appService.updateTodo(updateTodoDto))
      .rows;
    if (todosAffected.length !== 1) {
      throwConflictError();
    }
    return res.status(HttpStatus.ACCEPTED).send({
      message: `updated todo with id ${updateTodoDto.id} successfully`,
    });
  }

  @Put('reorder')
  async updateTodosOrder(
    @Body(new ParseArrayPipe({ items: String })) newIdsOrder: string[],
    @Res() res: Response,
  ) {
    this.appService.reorderTodos(newIdsOrder);
    return res
      .status(HttpStatus.ACCEPTED)
      .send({ message: 'updated todos order successfully' });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const todosAffected = (await this.appService.removeTodo(id)).rows;
    if (todosAffected.length !== 1) {
      throwConflictError();
    }
    return res
      .status(HttpStatus.ACCEPTED)
      .send(`deleted todo with id ${id} successfully`);
  }
}

const throwConflictError = () => {
  throw new ConflictException('conflict happend', {
    cause: new Error(),
    description: 'request yeilded mre than one result',
  });
};
