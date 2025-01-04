"use client";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import PresentationModal from "../Modals/ModalApresentação/PresentationModal";
import ScheduleCard from "../ScheduleCard";
import Calendar from "../UI/calendar";
import Modal from "../UI/Modal/Modal";

import { useEdicao } from "@/hooks/useEdicao";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useSession } from "@/hooks/useSession";

import moment from "moment";
import "moment/locale/pt-br";

import "./style.scss";

export default function ScheduleSection() {
  const { listSessions, sessoesList, listRooms, roomsList  } = useSession();
  const { Edicao } = useEdicao();

  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const openModal = useRef<HTMLButtonElement | null>(null);
  const [modalContent, setModalContent] = useState<Presentation>(
    {} as Presentation
  );

  useEffect(() => {
    moment.locale("pt-br");
  }, []);

  function generateDatesBetween(startDate: string, endDate: string): string[] {
    const datesArray: string[] = [];
    const currentDate = moment(startDate);
    const finalDate = moment(endDate);

    while (currentDate.isSameOrBefore(finalDate)) {
      datesArray.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "day");
    }

    return datesArray;
  }

  function changeDate(date: string) {
    setSelectedDate(date);
  }

  function openModalPresentation(item: Presentation) {
    setModalContent(item);
    openModal.current?.click();
  }

  useEffect(() => {
    const eventEditionId = getEventEditionIdStorage();

    if (eventEditionId && Edicao?.startDate && Edicao?.endDate) {
      listSessions(eventEditionId);
      const generatedDates = generateDatesBetween(
        Edicao.startDate,
        Edicao.endDate
      );
      setDates(generatedDates);
      setSelectedDate(generatedDates[0]);
    }

    if (Edicao?.id)
      listRooms(Edicao?.id);
  }, [Edicao]);

  const colorsSession = [
    "#FFE4B5",
    "#FFB6C1",
    "#ADD8E6",
    "#90EE90",
    "#FFFFE0",
    "#FFDAB9",
    "#FFC0CB",
    "#AFEEEE",
    "#98FB98",
    "#FFFACD",
    "#FFCCCB",
    "#87CEFA",
    "#7CFC00",
    "#FAFAD2",
    "#F08080",
    "#B0E0E6",
    "#00FF7F",
    "#FFF5EE",
    "#FFDEAD",
    "#B0C4DE",
    "#F5FFFA",
    "#FFEB99",
    "#FFD1DC",
    "#CAE7FF",
    "#DFFFD6",
    "#FFFFF0",
    "#FFC3A0",
    "#B3E5FC",
    "#DFF6FF",
    "#E6FFE6",
  ];

  return (
    <div id="Programacao">
      <div
        className="d-flex flex-column w-100"
        style={{
          gap: "15px",
        }}
      >
        <h1 className="fw-bold text-center display-4 progamacao-title">
          Programação
        </h1>

        <div className="d-flex justify-content-center programacao-dias">
          {dates.map((date, index) => (
            <button
              key={index}
              className="d-flex align-items-center fw-bold flex-start"
              style={{
                fontSize: "16px",
                lineHeight: "30px",
                gap: "10px",
                backgroundColor: selectedDate === date ? "#FFA90F" : "white",
                color: selectedDate === date ? "white" : "#FFA90F",
                padding: "10px 25px",
                borderRadius: "25px",
                border: "3px solid #FFA90F",
              }}
              onClick={() => changeDate(date)}
            >
              <Calendar color={selectedDate === date ? "white" : "#FFA90F"} />
              {moment(date).format("DD [de] MMMM")}
            </button>
          ))}
        </div>

        {roomsList.map((item) => (
          <div className="programacao-sala">
            <p
              className="fw-bold text-white m-0 text-center w-100"
              style={{
                fontSize: "13px",
                lineHeight: "50px",
              }}
            >
              {item.name}
            </p>
            <p className="m-0" style={{ width: "44px" }}></p>
          </div>
        ))}
        

        <div className="d-flex flex-column programacao-item">
          {!!sessoesList?.length &&
            sessoesList
              ?.filter(
                (item) =>
                  moment(item.startTime).format("YYYY-MM-DD") ===
                  moment(selectedDate).format("YYYY-MM-DD")
              )
              ?.map((item, index) => {
                if (item.type === "General") {
                  return (
                    <div
                      key={index + item.id}
                      className="d-flex align-items-center w-100"
                      style={{
                        gap: "40px",
                      }}
                    >
                      <p className="m-0" style={{ width: "44px" }}>
                        {moment(item.startTime).format("HH:mm")}
                      </p>
                      <ScheduleCard
                        type="GeneralSession"
                        author={item?.speakerName ?? ""}
                        title={item?.title ?? ""}
                        onClickEvent={() => {}}
                      />
                      <div className="m-0 programacao-item-aux"></div>
                    </div>
                  );
                }

                return item.presentations?.map((pres) => {
                  return (
                    <div
                      key={index + pres.id}
                      className="d-flex align-items-center w-100"
                      style={{
                        gap: "40px",
                      }}
                    >
                      <p className="m-0" style={{ width: "44px" }}>
                        {moment(pres.startTime).format("HH:mm")}
                      </p>
                      <ScheduleCard
                        type="PresentationSession"
                        author={pres?.submission?.mainAuthor?.name ?? ""}
                        title={pres?.submission?.title ?? ""}
                        onClickEvent={() => openModalPresentation(pres)}
                        cardColor={colorsSession[index]}
                      />
                      <div className="m-0 programacao-item-aux"></div>
                    </div>
                  );
                });
              })}

          {!sessoesList?.filter(
            (item) =>
              moment(item.startTime).format("YYYY-MM-DD") ===
              moment(selectedDate).format("YYYY-MM-DD")
          )?.length && (
            <div className="d-flex align-items-center justify-content-center p-3 mt-4 me-5">
              <h4 className="empty-list mb-0">
                <Image
                  src="/assets/images/empty_box.svg"
                  alt="Lista vazia"
                  width={90}
                  height={90}
                />
                Essa lista ainda está vazia
              </h4>
            </div>
          )}
        </div>
      </div>

      <Modal
        content={<PresentationModal props={modalContent} />}
        reference={openModal}
      />
    </div>
  );
}
