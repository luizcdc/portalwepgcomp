"use client";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import PresentationModal from "../Modals/ModalApresentação/PresentationModal";
import ScheduleCard from "../ScheduleCard";
import Calendar from "../UI/calendar";
import Modal from "../UI/Modal/Modal";
import "./style.scss";
import { usePresentation } from "@/hooks/usePresentation";
import { Presentation } from "@/models/presentation";
import moment from "moment";
import "moment/locale/pt-br";
import { useEdicao } from "@/hooks/useEdicao";

export default function ScheduleSection() {
  const { getPresentationAll, presentationList } = usePresentation();
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
    if (Edicao?.id && Edicao.startDate && Edicao.endDate) {
      getPresentationAll(Edicao?.id);
      const generatedDates = generateDatesBetween(
        Edicao.startDate,
        Edicao.endDate
      );
      setDates(generatedDates);
      setSelectedDate(generatedDates[0]);
    }
  }, [Edicao]);

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

        <div className="programacao-sala">
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
          {!!presentationList?.length &&
            presentationList
              // .filter(
              //   (item) =>
              //     moment(item.presentationTime).format("YYYY-MM-DD") ===
              //     moment(selectedDate).format("YYYY-MM-DD")
              // )
              ?.map((item, index) => (
                <div
                  key={index + item.submission.mainAuthor?.name}
                  className="d-flex align-items-center w-100"
                  style={{
                    gap: "40px",
                  }}
                >
                  <p className="m-0" style={{ width: "44px" }}>
                    {moment(item.presentationTime).format("HH:mm")}
                  </p>
                  <ScheduleCard
                    type={item.submission.type}
                    author={item.submission.mainAuthor?.name}
                    title={item.submission.title}
                    onClickEvent={() => openModalPresentation(item)}
                  />
                  <div className="m-0 programacao-item-aux"></div>
                </div>
              ))}

          {!presentationList?.length && (
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
