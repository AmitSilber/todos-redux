import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTodo,selectPast,selectFuture,undoTodos,redoTodos } from '../todoList/todosSlice';

const undo: string = "\u21A9"
const redo: string = "\u21AA"


export function Header() {

    const [title, setTitle] = useState('Howdy cowboy!');
    const [date, setDate] = useState("2023-05-26")
    const dispatch = useDispatch();
    const pastTodos = useSelector(selectPast)
    const futureTodos = useSelector(selectFuture)

    function submitNewTodoItem() {
        dispatch(addNewTodo({ title, date }))
    }

    function handleUndo(){
        if(pastTodos.length>0){
            dispatch(undoTodos())
        }
        else{
            alert('slow down buddy, no undos left')
        }
    }
    function handleRedo(){
        if(futureTodos.length>0){
            dispatch(redoTodos())
        }
        else{
            alert('slow down buddy, no redos left')
        }
    }

    return (
        <header className="App-header">
            <>
                <div className="undoRedu">
                    <button className="button undo" onClick={handleUndo}>{undo}</button>
                    <button className="button redo" onClick={handleRedo}>{redo}</button>
                </div>
                <h1 className="app-title">TODOs</h1>

                <div className="form">
                    <input type="text" id="todo-title" value={title} onChange={e => setTitle(e.target.value)} />
                    <input type="date" id="todo-duedate" value={date} onChange={e => setDate(e.target.value)} />
                    <input type="submit" id="todo-submit" value="add" onClick={submitNewTodoItem} />
                </div>
            </>
        </header>
    );
}
