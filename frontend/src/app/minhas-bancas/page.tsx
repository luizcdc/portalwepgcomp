"use client";

import Image from "next/image";

import PresentationModal from "@/components/Modals/ModalApresentação/PresentationModal";
import Modal from "../../components/UI/Modal/Modal";
import Banner from "@/components/UI/Banner";
import { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import ScheduleCard from "@/components/ScheduleCard";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useSession } from "@/hooks/useSession";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

import "./style.scss";

export default function MinhasBancas() {
  const { listPresentionBlockByPanelist, presentationBlockByPanelistList } =
    useSession();
  const openModal = useRef<HTMLButtonElement | null>(null);
  const { user } = useContext(AuthContext);

  const colorsSession = [
    "#03A61C",
    "#FFA90F",
    "#008CD8",
    "#03A61C",
    "#FFA90F",
    "#008CD8",
    "#03A61C",
    "#FFA90F",
    "#008CD8",
  ];

  const [modalContent, setModalContent] = useState<any>(
    presentationBlockByPanelistList
  );

  function openModalPresentation(item) {
    setModalContent({ ...modalContent, ...item });
    openModal.current?.click();
  }

  useEffect(() => {
    const eventEditionId = getEventEditionIdStorage() ?? "";
    if (eventEditionId)
      listPresentionBlockByPanelist(eventEditionId, user?.id ?? "");
  }, []);

  return (
    <>
      <Banner title="Minhas bancas" />

      <div className="minhas-bancas">
        <p>
          Esta página exibe as bancas pelas quais você, como professor
          orientador, é responsável. As apresentações estão organizadas por
          sessão, e cada sessão é destacada com uma cor distinta para facilitar
          a identificação.
        </p>
        <div
          className="d-flex flex-column"
          style={{
            gap: "20px",
          }}
        >
          {!!presentationBlockByPanelistList?.length &&
            presentationBlockByPanelistList
              ?.toSorted(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              )
              ?.map((item, index) => {
                return item.presentations
                  ?.toSorted(
                    (a, b) => a.positionWithinBlock - b.positionWithinBlock
                  )
                  .map((pres) => {
                    return (
                      <div
                        key={index + pres.id}
                        className="d-flex align-items-center w-100"
                        style={{
                          gap: "20px",
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
          {!presentationBlockByPanelistList.length && (
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

        <Modal
          content={<PresentationModal props={modalContent} />}
          reference={openModal}
        />
      </div>
    </>
  );
}
