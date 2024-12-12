"use client";
import { useRef, useState } from "react";

import { MockupPresentention, MockupSchedule } from "@/mocks/Schedule";
import PresentationModal from "../Modals/ModalApresentação/PresentationModal";
import ScheduleCard from "../ScheduleCard";
import Calendar from "../UI/calendar";
import Modal from "../UI/Modal/Modal";
import "./style.scss";

export default function ScheduleSection() {
  const [date, setDate] = useState<number>(0);
  //const [schedule, setSchedule] = useState<[]>()
  const openModal = useRef<HTMLButtonElement | null>(null);
  const [modalContent, setModalContent] =
    useState<PresentationData>(MockupPresentention);

  function changeDate(date: number) {
    setDate(date);
  }

  function openModalPresentation(item) {
    setModalContent({ ...modalContent, doutorando: item.author });
    openModal.current?.click();
  }

  return (
    <div
      id="Programacao"
    >
      <div
        className="d-flex flex-column w-100"
        style={{
          gap: "15px",
        }}
      >
        <h1
          className="fw-bold text-center display-4 progamacao-title"
        >
          Programação
        </h1>
        <div className="d-flex justify-content-center programacao-dias">
          <button
            className="d-flex align-items-center fw-bold flex-start"
            style={{
              fontSize: "16px",
              lineHeight: "30px",
              gap: "10px",
              backgroundColor: date == 0 ? "#FFA90F" : "white",
              color: date == 0 ? "white" : "#FFA90F",
              padding: "10px 25px",
              borderRadius: "25px",
              border: date == 0 ? "3px solid #FFA90F" : "3px solid #FFA90F",
            }}
            onClick={() => changeDate(0)}
          >
            <Calendar color={date == 0 ? "white" : "#FFA90F"} />
            12 de novembro
          </button>
          <button
            className="d-flex text-start align-items-center"
            style={{
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "30px",
              gap: "10px",
              backgroundColor: date == 1 ? "#FFA90F" : "white",
              color: date == 1 ? "white" : "#FFA90F",
              padding: "10px 25px",
              borderRadius: "25px",
              border: date == 1 ? "3px solid #FFA90F" : "3px solid #FFA90F",
            }}
            onClick={() => changeDate(1)}
          >
            <Calendar color={date == 1 ? "white" : "#FFA90F"} />
            13 de novembro
          </button>
          <button
            className="d-flex align-items-center text-start"
            style={{
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "30px",
              gap: "10px",
              backgroundColor: date == 2 ? "#FFA90F" : "white",
              color: date == 2 ? "white" : "#FFA90F",
              padding: "10px 25px",
              borderRadius: "25px",
              border: date == 2 ? "3px solid #FFA90F" : "3px solid #FFA90F",
            }}
            onClick={() => changeDate(2)}
          >
            <Calendar color={date == 2 ? "white" : "#FFA90F"} />
            14 de novembro
          </button>
        </div>
        <div
          className="programacao-sala"
        >
          <p
            className="fw-bold text-white m-0 text-center w-100"
            style={{
              fontSize: "13px",
              lineHeight: "50px",
            }}
          >
            SALA A
          </p>
          <p className="m-0" style={{ width: "44px" }}></p>
        </div>

        <div className="d-flex flex-column programacao-item">
          {MockupSchedule[date].map((item, index) => {
            return (
              <div
                key={index + item.author}
                className="d-flex align-items-center w-100"
                style={{
                  gap: "40px",
                }}
              >
                <p className="m-0" style={{ width: "44px" }}>
                  09:00
                </p>
                <ScheduleCard
                  type={item.type}
                  author={item.author}
                  title={item.title}
                  onClickEvent={() => openModalPresentation(item)}
                />
                <div className="m-0 programacao-item-aux"></div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        content={<PresentationModal props={modalContent} />}
        reference={openModal}
      />
    </div>
  );
}
