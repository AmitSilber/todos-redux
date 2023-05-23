import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeTitle, removeTodo } from '../todosSlice';
import { TodoItem, useToggle } from '../../utils';


const deleteIcon = "\u00D7";


export function TitleCell(todo: TodoItem) {
    const { value: editTitleMode, toggle:toggleEditTitleMode } = useToggle(false);
    const dispatch = useDispatch();


    function editTitleHandler(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch(changeTitle({ todoId: todo.id, newValue: e.target.value }))
    }
    function enterPressedHandler(e: React.KeyboardEvent<HTMLElement>) {
        if (e.key === 'Enter') {
            toggleEditTitleMode()

        }
    }
    function doubleClickHandler(e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) {
        if (e.detail === 2) {
            toggleEditTitleMode()
        }
    }

    return (<td><div className={"title-cell"}>
        <span className='hover-cell' onClick={() => {
            dispatch(removeTodo({ todoId: todo.id }))
        }}>
            {deleteIcon}
        </span>
        {editTitleMode ?
            (<input type="text" className="edit-title" value={todo.title} onChange={editTitleHandler}
                onKeyDown={enterPressedHandler}
                autoFocus />) :
            (<p onClick={e => doubleClickHandler(e)}>
                {todo.title}
            </p>)}
    </div>
    </td>

    )
}