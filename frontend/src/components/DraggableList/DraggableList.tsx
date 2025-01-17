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

  setTimeout(() => {
    setListedData(list);
  }, 100);

  const reorder = (_list, startIndex, endIndex) => {
    const result = Array.from(_list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
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
      handleSelector=".card-listagem"
      lineClassName="dragLine"
      onDragEnd={(fromIndex, toIndex) =>
        onDragEnd(fromIndex, toIndex)
      }
    >
      {listedData.map((data, index) => (
        <div
          className="draggable"
          key={index}>
          <div className="card-listagem mt-4">
            <div className="card-listagem-text grabbable">
              <p>{data[labelTitle]}</p>
              <p>{data[labelSubtitle]}</p>
            </div>
          </div>
        </div>
      ))}
    </ReactDragListView>
  );
};
