import React, { useState } from "react";
import ReactDragListView from "react-drag-listview";
import "./style.scss";

export interface DraggedMovement {
  fromId: string;
  toId: string;
}
interface DraggableList {
  list: any[];
  labelTitle: string;
  labelSubtitle: string;
  onChangeOrder(data: any[], draggedMovement: DraggedMovement[]): void; 
}
export default function DraggableList({
  list = [],
  labelTitle,
  labelSubtitle,
  onChangeOrder = () => {}
}: Readonly<DraggableList>) {
  const [listedData, setListedData] = useState<any[]>([]);
  const [draggedItem, setDraggedItem] = useState<any>({});
  const [draggedMove, setDraggedMove] = useState<DraggedMovement[]>([]);

  setTimeout(() => {
    if (listedData && !listedData.length) setListedData(list);
  }, 100);

  const historyMovement = (fromIndex: number, toIndex: number) => {
    const toId = listedData[toIndex].id;
    const fromId = listedData[fromIndex].id;
    const isRevertMovement = draggedMove.findIndex(movement => movement.fromId == toId && movement.toId == fromId);
    const isRepeatedMovement = draggedMove.findIndex(movement => movement.fromId == fromId && movement.toId == toId);

    if (isRevertMovement >= 0) {
      draggedMove.splice(isRevertMovement, 1);
    } else 
    if (isRepeatedMovement <= 0) {
      draggedMove.push({ fromId, toId });
    }

    setDraggedMove([...draggedMove]);
  };

  const onDragStart = (e, index) => {
    setDraggedItem(listedData[index]);
  };

  const onDragOver = (toIndex) => {
    const draggedOverItem = listedData[toIndex];

    // if the item is dragged over itself, ignore
    if (draggedItem.id === draggedOverItem.id) {
      return;
    }

    // filter out the currently dragged item
    const fromIndex = listedData.findIndex(item => item.id === draggedItem.id);
    const orderedDataList = listedData.filter(item => item.id !== draggedItem.id);

    // add the dragged item after the dragged over item
    orderedDataList.splice(toIndex, 0, draggedItem);

    historyMovement(fromIndex, toIndex);

    return setListedData(orderedDataList);
  };

  const onDragEnd = (fromIndex, toIndex) => {
    /* IGNORES DRAG IF OUTSIDE DESIGNATED AREA */
    if (toIndex < 0) return;

    /* REORDER PARENT OR SUBLIST, ELSE THROW ERROR */
    // const orderedDataList = reorder(listedData, fromIndex, toIndex);
    const movements: any = [];
    draggedMove.forEach((m) => {
      if (!movements.find(movement => movement.fromId == m.fromId && movement.toId == m.toId)) {
        movements.push(m);  
      }
    });
    onChangeOrder(listedData, movements);
    setDraggedMove([]);
    // return setListedData(orderedDataList);
  };
  
  return (
    <ReactDragListView
      nodeSelector=".draggable"
      handleSelector="i"
      lineClassName="dragLine"
      onDragEnd={(fromIndex, toIndex) =>
        onDragEnd(fromIndex, toIndex)
      }
    >
      {listedData.map((data, index) => (
        <div
          className="draggable"
          key={index + "drag"}
          onDragStart={e => onDragStart(e, index)}
          onDragOver={() => onDragOver(index)}>
          <div className="card-listagem mt-4">
            <div className="row">
              <div className="col-1 drag-icon grabbable">
                <i className="bi bi-grip-vertical"></i>
              </div>
              <div className="col-11">
                <div className="card-listagem-text">
                  <p>{data[labelTitle]}</p>
                  <p>{data[labelSubtitle]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ReactDragListView>
  );
};
