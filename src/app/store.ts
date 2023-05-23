import { configureStore } from '@reduxjs/toolkit';
import timelineSlice from '../todoList/todosSlice';
import { pastActionListenerMiddleware } from './pastActionListenerMiddleware';



export const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    todos: timelineSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([pastActionListenerMiddleware])
})




export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

