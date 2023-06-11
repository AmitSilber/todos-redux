import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TitleCell } from './TitleCell';
import { changeDate, toggleStatus } from '../todosSlice'
import { DragHandlers, useToggle } from '../../utils';
import { selectTodoById } from '../todosSlice';
import { RootState } from '../../app/store';


export default function Row({ todoId, onDragHandlers }:
    {
        todoId: string,
        onDragHandlers: DragHandlers
    })
    : ReactElement {
    const { value: isEditDateMode, toggle: toggleEditDateMode } = useToggle(false);
    const dispatch = useDispatch();
    const todo = useSelector((state: RootState) => selectTodoById(state, todoId))


    function editDateHandler(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch(changeDate({ newValue: e.target.value, todoId }))

    }
    function editStatusHandler() {
        dispatch(toggleStatus({ todoId }))


    }
    function enterPressedHandler(e: React.KeyboardEvent<HTMLElement>) {
        if (e.key === 'Enter') {
            toggleEditDateMode()
        }
    }

    return (
        <tr key={todoId}
            draggable={true}
            onDragStart={onDragHandlers.start}
            onDragEnter={onDragHandlers.enter}
            onDragOver={onDragHandlers.over}>
            <TitleCell {...todo}
            />
            {isEditDateMode ?
                (<td><input type="date" className="todo-date" value={todo.date} onChange={editDateHandler}
                    onKeyDown={enterPressedHandler}
                    autoFocus /></td>) :
                (<td className='hover-cell' id='dateCell' onClick={() => {
                    toggleEditDateMode()
                }}>{todo.date}</td>)
            }
            <td className='hover-cell' id='statusCell' onClick={editStatusHandler}>{todo.status === "completed" ? '\u2713' : ''}</td>
        </tr>
    );
}








