"use client";

import "./style.scss";
import PresentationModal from "@/components/Modals/ModalApresentação/PresentationModal";
import Modal from "../../components/UI/Modal/Modal";
import Banner from "@/components/UI/Banner";
import { useContext, useEffect, useRef, useState } from "react";
import { usePresentation } from "@/hooks/usePresentation";
import moment from "moment";
import ScheduleCard from "@/components/ScheduleCard";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useSession } from "@/hooks/useSession";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

export default function MinhasBancas() {
  const { presentationBookmarks, getPresentationBookmarks, deletePresentationBookmark } = usePresentation();
  const {listPresentionBlockByPanelist, presentationBlockByPanelistList} = useSession();
  const openModal = useRef<HTMLButtonElement | null>(null);
  const { user } = useContext(AuthContext);

  const colorsSession = [
    "#03A61C","#FFA90F","#008CD8","#03A61C","#FFA90F","#008CD8","#03A61C","#FFA90F","#008CD8"
  ];

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);

  useEffect(() => {
    if (!presentationBookmarks?.bookmarkedPresentations?.length) {
      return;
    }  
    const newSessionsList = presentationBookmarks.bookmarkedPresentations
      .filter((item) =>
        item.submission?.title?.toLowerCase().includes(searchValue.trim().toLowerCase()));

    setSessionsListValues(newSessionsList); 
  }, [presentationBookmarks, searchValue]);

  const [modalContent, setModalContent] =
    useState<any>(sessionsListValues);

  function openModalPresentation(item) {
    setModalContent({ ...modalContent, ...item });
    openModal.current?.click();
  };

  useEffect(()=>{
    const eventEditionId = getEventEditionIdStorage() ?? "";
    if(eventEditionId)
    listPresentionBlockByPanelist(eventEditionId,user?.id ?? "");
  },[]);

  return (
    <>
    <Banner title="Minhas bancas" />

    <div className="minhas-bancas">
      <p>Esta página exibe as bancas pelas quais você, como professor orientador, é responsável. As apresentações estão organizadas por sessão, e cada sessão é destacada com uma cor distinta para facilitar a identificação.</p>
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
        </div>

        <Modal
          content={<PresentationModal props={modalContent} />}
          reference={openModal}
        />
    </div>
      </>
  );
}
