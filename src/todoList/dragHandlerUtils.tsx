import { AppDispatch } from "../app/store";
import { updateOrder } from "./todosSlice";


export function handleDragStart(index: number, draggingItem: React.MutableRefObject<number>) {
  draggingItem.current = index;
};

export function reorderTodoList(index: number,
  draggingItem: React.MutableRefObject<number>,
  dragOverItem: React.MutableRefObject<number>,
  idsInOrder: string[],
  dispatch: AppDispatch
): void {
  if (index == draggingItem.current) {
    return;
  }
  dragOverItem.current = index;
  const idsReordered = [...idsInOrder];
  const draggingItemContent = idsReordered[draggingItem.current];
  idsReordered.splice(draggingItem.current, 1);
  idsReordered.splice(dragOverItem.current, 0, draggingItemContent);

  draggingItem.current = dragOverItem.current;
  dragOverItem.current = 0;
  dispatch(updateOrder({ newTodosOrder: idsReordered }))

};
