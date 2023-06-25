import {
    TodoItem,
    initializeState,
    TodoStatus,
} from '../utils';

import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit'

import { RootState } from "../app/store";
import { v4 as uuid } from 'uuid';



type editTodoType = { todoId: string, newValue: string };
type toggleTodoType = { todoId: string }
type addNewTodoType = { title: string, date: string }
type removeTodoType = toggleTodoType
type updateOrderType = { newTodosOrder: string[] }

type todosState = {
    entries: {
        [id: string]: TodoItem
    },
    todoIdsInOrder: string[]
}
type timelineState = {
    present: todosState,
    past: todosState[],
    future: todosState[]
}
const initialPresentState: todosState = initializeState();
const initialTimelineState: timelineState = {
    present: initialPresentState,
    past: [],
    future: []
}



const todosTimelineSlice = createSlice({
    name: 'todosTimeline',
    initialState: initialTimelineState,
    reducers: {
        addNewTodo(state, action: PayloadAction<addNewTodoType>) {
            const { title, date } = action.payload;
            const newTodo = {
                title,
                date,
                status: "pending" as TodoStatus,
                id: uuid(),
            }
            state.present.entries[newTodo.id] = newTodo;
            state.present.todoIdsInOrder.push(newTodo.id);
        },
        removeTodo(state, action: PayloadAction<removeTodoType>) {
            const { todoId } = action.payload;
            const todoIndex = state.present.todoIdsInOrder.findIndex(id => id === todoId);
            state.present.todoIdsInOrder.splice(todoIndex, 1);
            delete state.present.entries[todoId];
        },
        toggleStatus(state, action: PayloadAction<toggleTodoType>) {
            const { todoId } = action.payload;
            state.present.entries[todoId].status = state.present.entries[todoId].status === "completed" ? "pending" : "completed"
        },
        changeTitle(state, action: PayloadAction<editTodoType>) {
            const { todoId, newValue } = action.payload;
            state.present.entries[todoId].title = newValue;
        },
        changeDate(state, action: PayloadAction<editTodoType>) {
            const { todoId, newValue } = action.payload;
            state.present.entries[todoId].date = newValue;
        },
        updateOrder(state, action: PayloadAction<updateOrderType>) {
            const { newTodosOrder } = action.payload; //TODO: add checks?
            if (state.present.todoIdsInOrder.length===newTodosOrder.length) {
                state.present.todoIdsInOrder = newTodosOrder;
            }
        },
        undoTodos(state) {
            const present = state.present;
            state.future.unshift(present);
            const lastPastState = state.past.pop()
            if (lastPastState !== undefined) {
                state.present = lastPastState;
            }
        },
        redoTodos(state) {
            const present = state.present;
            state.past.push(present)
            const nextFutureState = state.future.shift();
            if (nextFutureState !== undefined) {
                state.present = nextFutureState;
            }
        },
        pushSnapshotToPast(state, action: PayloadAction<{ presentTodos: todosState }>) {
            const { presentTodos } = action.payload;
            state.past.push(presentTodos)
        },
        resetFuture(state) {
            state.future = [];
        }

    }
}
)



export const selectTodoIdsInorder = (state: RootState): string[] => state.todos.present.todoIdsInOrder;

export const selectTodos = (state: RootState): { [id: string]: TodoItem } => state.todos.present.entries;

export const selectTodoById = (state: RootState, id: string): TodoItem => state.todos.present.entries[id]

export const selectPast = (state: RootState): todosState[] => state.todos.past
export const selectFuture = (state: RootState): todosState[] => state.todos.future;





export const {
    addNewTodo,
    removeTodo,
    toggleStatus,
    changeDate,
    updateOrder,
    changeTitle,
    pushSnapshotToPast,
    undoTodos,
    redoTodos,
    resetFuture
} = todosTimelineSlice.actions;
export default todosTimelineSlice.reducer;