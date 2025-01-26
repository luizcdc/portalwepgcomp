"use client";

import moment from "moment";
import "moment/locale/pt-br";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import PresentationModal from "../Modals/ModalApresentação/PresentationModal";
import ScheduleCard from "../ScheduleCard/ScheduleCard";
import Calendar from "../UI/calendar";
import Modal from "../UI/Modal/Modal";

import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useEdicao } from "@/hooks/useEdicao";
import { useSession } from "@/hooks/useSession";

import "./style.scss";

export default function ScheduleSection() {
  const { listSessions, sessoesList, listRooms, roomsList } = useSession();
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
    const finalDate = moment(endDate).subtract(1, "day");

    while (currentDate.isSameOrBefore(finalDate)) {
      currentDate.add(1, "day");
      datesArray.push(currentDate.format("YYYY-MM-DD"));
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

    if (Edicao?.id) listRooms(Edicao?.id);
  }, [Edicao]);

  const colorsSession = ["#F2CB05", "#03A61C", "#FF1A25", "#0066BA"];

  return (
    <div id="Programacao">
      <div className="d-flex flex-column w-100 full-content">
        <h1 className="fw-bold text-center display-4 progamacao-title">
          Programação
        </h1>

        <div className="d-flex justify-content-center programacao-dias">
          {dates.map((date, index) => (
            <button
              key={index}
              className="d-flex align-items-center fw-bold flex-start fs-5 date-button"
              style={{
                backgroundColor: selectedDate === date ? "#FFA90F" : "white",
                color: selectedDate === date ? "white" : "#FFA90F",
              }}
              onClick={() => changeDate(date)}
            >
              <Calendar color={selectedDate === date ? "white" : "#FFA90F"} />
              {moment(date).format("DD [de] MMMM")}
            </button>
          ))}
        </div>

        {roomsList.map((item, index) => (
          <div className="programacao-sala" key={index}>
            <h3 className="fw-bold text-white m-0 text-center w-100 list-item">
              {item.name}
            </h3>
            <h5 className="m-0 list-paragraph"></h5>
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
              ?.toSorted(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              )
              ?.map((item, index) => {
                if (item.type === "General") {
                  return (
                    <div
                      key={index + item.id}
                      className="d-flex align-items-center w-100 default-gap"
                    >
                      <h5 className="m-0 list-paragraph">
                        {moment(item.startTime).format("HH:mm")}
                      </h5>
                      <ScheduleCard
                        type="GeneralSession"
                        author={item?.speakerName ?? ""}
                        title={item?.title ?? ""}
                        onClickEvent={() => {}}
                        cardColor="white"
                      />
                      <div className="m-0 programacao-item-aux"></div>
                    </div>
                  );
                }

                return item.presentations
                  ?.toSorted(
                    (a, b) => a.positionWithinBlock - b.positionWithinBlock
                  )
                  .map((pres) => {
                    return (
                      <div
                        key={index + pres.id}
                        className="d-flex align-items-center w-100 default-gap"
                      >
                        <h5 className="m-0 list-paragraph">
                          {moment(pres.startTime).format("HH:mm")}
                        </h5>
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
