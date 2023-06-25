import { useRef, useEffect } from 'react';
import { selectTodoIdsInorder, selectTodos } from './todoList/todosSlice';
import { useSelector, useDispatch } from 'react-redux';
import { handleDragStart, reorderTodoList } from './todoList/dragHandlerUtils';
import { Header } from './Header/Header';
import './App.css';
import Row from './todoList/Row/Row'


function App() {
  const todoIndicesInorder: string[] = useSelector(selectTodoIdsInorder)
  const todoList = useSelector(selectTodos);

  const dispatch = useDispatch()
  const draggingItem = useRef(0);
  const dragOverItem = useRef(0);


  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);
  useEffect(() => {
    localStorage.setItem("inorderIds", JSON.stringify(todoIndicesInorder))
  }, [todoIndicesInorder]
  )

  return (
    <div className="App">
      <Header />
      <div id="table-wrapper">
        <table id="todo-list-table">
          <thead>
            <tr>
              <th className="title column">Title</th>
              <th className="due-date column">Due date</th>
              <th className="status column">Done?</th>
            </tr>
          </thead>
          <tbody>
            {todoIndicesInorder.map((todoId, index) => {
              return (<Row key={todoId}
                todoId={todoId}
                onDragHandlers={
                  {
                    start: () => handleDragStart(index, draggingItem),
                    enter: () => reorderTodoList(index, draggingItem, dragOverItem, todoIndicesInorder, dispatch),
                    over: (e) => e.preventDefault(),
                  }}

              />);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default App;
