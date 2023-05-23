import { useState } from "react"

export type TodoStatus = "pending" | "completed"

export type TodoItem = {
    title: string,
    date: string,
    status: TodoStatus,
    id: string
}


export type DragHandlers = {
    start: React.DragEventHandler<HTMLTableRowElement>,
    enter: React.DragEventHandler<HTMLTableRowElement>,
    over: React.DragEventHandler<HTMLTableRowElement>,
}


export function useToggle(initialState: boolean) {
    const [toggleState, setToggleState] = useState(initialState);
    const toggle = () => setToggleState(!toggleState);
    return { value: toggleState, toggle }


}


export function initializeState() {
    let initialTodos = {}
    let initialIdsInOrder = []
    const persistedTodosString = localStorage.getItem('todos')
    const preloadedIdsString = localStorage.getItem('inorderIds')

    if (persistedTodosString) {
        initialTodos = JSON.parse(persistedTodosString);
    }
    if (preloadedIdsString) {
        initialIdsInOrder = JSON.parse(preloadedIdsString)
    }
    return { entries: initialTodos, todoIdsInOrder: initialIdsInOrder }
}

