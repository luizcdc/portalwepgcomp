import React, { useState } from "react";
import ReactDragListView from "react-drag-listview";
import "./style.scss";

interface DraggableList {
  list: any[];
  labelTitle: string;
  labelSubtitle: string;
  onChangeOrder(data: any[], fromIndex: number, toIndex: number): void; 
}
export default function DraggableList({
  list = [],
  labelTitle,
  labelSubtitle,
  onChangeOrder = (data) => {}
}: Readonly<DraggableList>) {
  const [listedData, setListedData] = useState<any[]>([]);
  const [draggedItem, setDraggedItem] = useState<any>({});
  const draggedMove = [];

  setTimeout(() => {
    if (listedData && !listedData.length) setListedData(list);
  }, 100);

  const reorder = (_list, startIndex, endIndex) => {
    const result = Array.from(_list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
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

    // draggedMove.push({ fromIndex, toIndex });

    // setDraggedMove(draggedMove);

    return setListedData(orderedDataList);
  };

  const onDragEnd = (fromIndex, toIndex) => {
    /* IGNORES DRAG IF OUTSIDE DESIGNATED AREA */
    if (toIndex < 0) return;

    /* REORDER PARENT OR SUBLIST, ELSE THROW ERROR */
    const orderedDataList = reorder(listedData, fromIndex, toIndex);
    onChangeOrder(orderedDataList, fromIndex, toIndex);
    return setListedData(orderedDataList);
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
