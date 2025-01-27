"use client";

import Image from "next/image";

import Banner from "@/components/UI/Banner";
import { useContext, useEffect } from "react";

import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useSession } from "@/hooks/useSession";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

import "./style.scss";
import PresentationCard from "@/components/CardApresentacao/PresentationCard";
import { usePresentation } from "@/hooks/usePresentation";

export default function MinhasBancas() {
  const { listPresentionBlockByPanelist, presentationBlockByPanelistList } =
    useSession();
  const { user } = useContext(AuthContext);
  const { deletePresentationBookmark } = usePresentation();

  const handleDelete = async (submissionId: any) => {
    await deletePresentationBookmark(submissionId);
  };

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
          avaliador, é responsável. As apresentações estão organizadas por
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
              ?.map((item) => {
                return item.presentations
                  ?.toSorted(
                    (a, b) => a.positionWithinBlock - b.positionWithinBlock
                  )
                  .map((pres) => {
                    return (
                      <PresentationCard
                        key={pres.id}
                        id={pres.id}
                        title={pres?.submission?.title ?? ""}
                        subtitle={pres?.submission?.abstract ?? ""}
                        name={pres?.submission?.mainAuthor?.name ?? ""}
                        pdfFile={pres?.submission?.pdfFile ?? ""}
                        email={pres?.submission?.mainAuthor?.email ?? ""}
                        advisorName={pres?.submission?.advisor?.name ?? ""}
                        onDelete={() => handleDelete(pres.submissionId)}
                      />
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
      </div>
    </>
  );
}
