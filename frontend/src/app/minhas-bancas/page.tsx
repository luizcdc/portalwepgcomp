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

export default function MinhasBancas() {
  const { presentationBookmarks, getPresentationBookmarks, deletePresentationBookmark } = usePresentation();
  const openModal = useRef<HTMLButtonElement | null>(null);
  const { user } = useContext(AuthContext);

  const colorsSession = [
    "#03A61C","#FFA90F","#008CD8","#03A61C","#FFA90F","#008CD8","#03A61C","#FFA90F","#008CD8"
  ];

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);

  const responseSessions = [
    {
      id: "dc313927-1a7c-45ea-a72b-4b3b700ebe02",
      eventEditionId: "9f6b8707-0f34-4054-b56c-049a26db000e",
      roomId: "84a569c5-e5d9-47f6-b898-8618792d4d66",
      type: "Presentation",
      title: "Apresentações de Pesquisa em IA",
      speakerName: null,
      startTime: "2025-05-01T12:00:00.000Z",
      duration: 45,
      createdAt: "2025-01-11T00:54:45.851Z",
      updatedAt: "2025-01-11T00:54:45.851Z",
      presentations: [
        {
          id: "0239b42e-89a3-45cf-b26a-87578f7a7f49",
          submissionId: "24aaa1d4-e0d2-4a16-aa25-6173e809b21e",
          presentationBlockId: "dc313927-1a7c-45ea-a72b-4b3b700ebe02",
          positionWithinBlock: 0,
          status: "ToPresent",
          startTime: "2025-05-01T12:00:00.000Z",
          createdAt: "2025-01-11T00:54:45.861Z",
          updatedAt: "2025-01-11T00:54:45.861Z",
          submission: {
            id: "24aaa1d4-e0d2-4a16-aa25-6173e809b21e",
            advisorId: "6cbfd4f4-acde-4767-a020-0b8b3e3599aa",
            mainAuthorId: "aa0e52fc-281f-4fcf-8a66-66b46d2877c4",
            eventEditionId: "9f6b8707-0f34-4054-b56c-049a26db000e",
            title: "The Impact of AI in Modern Research",
            abstract:
              "A study on how AI impacts modern research methodologies.",
            pdfFile: "path/to/document1.pdf",
            phoneNumber: "123-456-7890",
            proposedPresentationBlockId: null,
            proposedPositionWithinBlock: null,
            coAdvisor: null,
            status: "Submitted",
            createdAt: "2025-01-11T00:54:45.304Z",
            updatedAt: "2025-01-11T00:54:45.304Z",
            mainAuthor: {
              id: "aa0e52fc-281f-4fcf-8a66-66b46d2877c4",
              name: "Doutorando Admin",
              email: "docadmin@example.com",
            },
            advisor: {
              id: "6cbfd4f4-acde-4767-a020-0b8b3e3599aa",
              name: "Professor Superadmin",
              email: "profsuperadmin@example.com",
            },
          },
        },
        {
          id: "52fdcf5c-95d6-40e2-9d5c-30a3c9b354e9",
          submissionId: "a4d3a2ed-f36e-4cab-978c-24b38bdfa296",
          presentationBlockId: "dc313927-1a7c-45ea-a72b-4b3b700ebe02",
          positionWithinBlock: 1,
          status: "ToPresent",
          startTime: "2025-05-01T12:15:00.000Z",
          createdAt: "2025-01-11T00:54:45.866Z",
          updatedAt: "2025-01-11T00:54:45.866Z",
          submission: {
            id: "a4d3a2ed-f36e-4cab-978c-24b38bdfa296",
            advisorId: "bc8ad699-311f-4d38-a92b-0546f8183f6d",
            mainAuthorId: "7ee8143c-30c4-4dcb-a407-0c5c85368227",
            eventEditionId: "9f6b8707-0f34-4054-b56c-049a26db000e",
            title: "Quantum Computing Advances",
            abstract: "Exploring the latest advancements in quantum computing.",
            pdfFile: "path/to/document2.pdf",
            phoneNumber: "123-456-7891",
            proposedPresentationBlockId: null,
            proposedPositionWithinBlock: null,
            coAdvisor: null,
            status: "Submitted",
            createdAt: "2025-01-11T00:54:45.312Z",
            updatedAt: "2025-01-11T00:54:45.312Z",
            mainAuthor: {
              id: "7ee8143c-30c4-4dcb-a407-0c5c85368227",
              name: "Doutorando Default",
              email: "docdefault@example.com",
            },
            advisor: {
              id: "bc8ad699-311f-4d38-a92b-0546f8183f6d",
              name: "Professor Admin",
              email: "profadmin@example.com",
            },
          },
        },
        {
          id: "661b4361-df7b-4df1-8bba-8f543bb7cf64",
          submissionId: "b1db7a11-f7dc-4c6b-ab9d-55468378d8d5",
          presentationBlockId: "dc313927-1a7c-45ea-a72b-4b3b700ebe02",
          positionWithinBlock: 2,
          status: "ToPresent",
          startTime: "2025-05-01T12:30:00.000Z",
          createdAt: "2025-01-11T00:54:45.870Z",
          updatedAt: "2025-01-11T00:54:45.870Z",
          submission: {
            id: "b1db7a11-f7dc-4c6b-ab9d-55468378d8d5",
            advisorId: "6d9c7e5e-b581-492a-906b-c6bd23696179",
            mainAuthorId: "09f15a3d-eda4-4bc9-b663-2676754f68a8",
            eventEditionId: "9f6b8707-0f34-4054-b56c-049a26db000e",
            title: "Blockchain Technology in Finance",
            abstract:
              "An analysis of blockchain technology applications in finance.",
            pdfFile: "path/to/document3.pdf",
            phoneNumber: "123-456-7892",
            proposedPresentationBlockId: null,
            proposedPositionWithinBlock: null,
            coAdvisor: null,
            status: "Submitted",
            createdAt: "2025-01-11T00:54:45.322Z",
            updatedAt: "2025-01-11T00:54:45.322Z",
            mainAuthor: {
              id: "09f15a3d-eda4-4bc9-b663-2676754f68a8",
              name: "Doutorando Default 2",
              email: "docdefault2@example.com",
            },
            advisor: {
              id: "6d9c7e5e-b581-492a-906b-c6bd23696179",
              name: "Professor Default",
              email: "profdefault@example.com",
            },
          },
        },
      ],
      panelists: [
        {
          id: "5e9de258-81ea-478e-bc69-cc6cd7b72e1d",
          presentationBlockId: "dc313927-1a7c-45ea-a72b-4b3b700ebe02",
          userId: "6cbfd4f4-acde-4767-a020-0b8b3e3599aa",
          status: "Confirmed",
          createdAt: "2025-01-11T00:54:45.891Z",
          updatedAt: "2025-01-11T00:54:45.891Z",
          user: {
            id: "6cbfd4f4-acde-4767-a020-0b8b3e3599aa",
            name: "Professor Superadmin",
            email: "profsuperadmin@example.com",
            profile: "Professor",
            level: "Superadmin",
            isActive: true,
            createdAt: "2025-01-11T00:54:45.237Z",
            updatedAt: "2025-01-11T00:54:45.237Z",
          },
        },
        {
          id: "5fd35f1d-06cb-4ca2-8327-b9bfa1eb777e",
          presentationBlockId: "dc313927-1a7c-45ea-a72b-4b3b700ebe02",
          userId: "bc8ad699-311f-4d38-a92b-0546f8183f6d",
          status: "Confirmed",
          createdAt: "2025-01-11T00:54:45.896Z",
          updatedAt: "2025-01-11T00:54:45.896Z",
          user: {
            id: "bc8ad699-311f-4d38-a92b-0546f8183f6d",
            name: "Professor Admin",
            email: "profadmin@example.com",
            profile: "Professor",
            level: "Admin",
            isActive: true,
            createdAt: "2025-01-11T00:54:45.237Z",
            updatedAt: "2025-01-11T00:54:45.237Z",
          },
        },
        {
          id: "11533efa-917f-405d-b89e-5d28c77daa3a",
          presentationBlockId: "dc313927-1a7c-45ea-a72b-4b3b700ebe02",
          userId: "6d9c7e5e-b581-492a-906b-c6bd23696179",
          status: "Confirmed",
          createdAt: "2025-01-11T00:54:45.901Z",
          updatedAt: "2025-01-11T00:54:45.901Z",
          user: {
            id: "6d9c7e5e-b581-492a-906b-c6bd23696179",
            name: "Professor Default",
            email: "profdefault@example.com",
            profile: "Professor",
            level: "Default",
            isActive: true,
            createdAt: "2025-01-11T00:54:45.237Z",
            updatedAt: "2025-01-11T00:54:45.237Z",
          },
        },
        {
          id: "146450db-88eb-4a67-a27d-087221f5b786",
          presentationBlockId: "dc313927-1a7c-45ea-a72b-4b3b700ebe02",
          userId: "3d7bf943-9537-4893-be5d-70a58f39362b",
          status: "Confirmed",
          createdAt: "2025-01-11T00:54:45.905Z",
          updatedAt: "2025-01-11T00:54:45.905Z",
          user: {
            id: "3d7bf943-9537-4893-be5d-70a58f39362b",
            name: "Professor Default 2",
            email: "profdefault2@example.com",
            profile: "Professor",
            level: "Default",
            isActive: true,
            createdAt: "2025-01-11T00:54:45.237Z",
            updatedAt: "2025-01-11T00:54:45.237Z",
          },
        },
      ],
      availablePositionsWithInBlock: [],
    },
    {
      id: "330e7ced-b935-4177-8114-a981595cd6df",
      eventEditionId: "9f6b8707-0f34-4054-b56c-049a26db000e",
      roomId: "84a569c5-e5d9-47f6-b898-8618792d4d66",
      type: "Presentation",
      title: "Apresentações de Pesquisa em Computação Quântica",
      speakerName: null,
      startTime: "2025-05-01T13:00:00.000Z",
      duration: 45,
      createdAt: "2025-01-11T00:54:45.857Z",
      updatedAt: "2025-01-11T00:54:45.857Z",
      presentations: [
        {
          id: "06a0a468-edcc-4dfc-9ce0-a3a20705c9ea",
          submissionId: "1efb1e1e-fb66-43c3-b570-4fe472fae6f6",
          presentationBlockId: "330e7ced-b935-4177-8114-a981595cd6df",
          positionWithinBlock: 0,
          status: "ToPresent",
          startTime: "2025-05-01T13:00:00.000Z",
          createdAt: "2025-01-11T00:54:45.875Z",
          updatedAt: "2025-01-11T00:54:45.875Z",
          submission: {
            id: "1efb1e1e-fb66-43c3-b570-4fe472fae6f6",
            advisorId: "6cbfd4f4-acde-4767-a020-0b8b3e3599aa",
            mainAuthorId: "e086fb9b-7b83-4aca-8699-68f039dfb45d",
            eventEditionId: "9f6b8707-0f34-4054-b56c-049a26db000e",
            title: "Machine Learning in Healthcare",
            abstract: "Investigating ML applications in healthcare diagnosis.",
            pdfFile: "path/to/document4.pdf",
            phoneNumber: "123-456-7893",
            proposedPresentationBlockId: null,
            proposedPositionWithinBlock: null,
            coAdvisor: null,
            status: "Submitted",
            createdAt: "2025-01-11T00:54:45.328Z",
            updatedAt: "2025-01-11T00:54:45.328Z",
            mainAuthor: {
              id: "e086fb9b-7b83-4aca-8699-68f039dfb45d",
              name: "Doutorando Default 3",
              email: "docdefault3@example.com",
            },
            advisor: {
              id: "6cbfd4f4-acde-4767-a020-0b8b3e3599aa",
              name: "Professor Superadmin",
              email: "profsuperadmin@example.com",
            },
          },
        },
        {
          id: "96fa5f29-ebe1-49da-b47a-8ad4147f09f8",
          submissionId: "82e76672-fe03-4c96-b759-c1b8bb6bc856",
          presentationBlockId: "330e7ced-b935-4177-8114-a981595cd6df",
          positionWithinBlock: 1,
          status: "ToPresent",
          startTime: "2025-05-01T13:15:00.000Z",
          createdAt: "2025-01-11T00:54:45.879Z",
          updatedAt: "2025-01-11T00:54:45.879Z",
          submission: {
            id: "82e76672-fe03-4c96-b759-c1b8bb6bc856",
            advisorId: "bc8ad699-311f-4d38-a92b-0546f8183f6d",
            mainAuthorId: "b016a107-ca9a-42c4-8975-51b539fc2695",
            eventEditionId: "9f6b8707-0f34-4054-b56c-049a26db000e",
            title: "Cloud Computing Security",
            abstract: "Analysis of security challenges in cloud computing.",
            pdfFile: "path/to/document5.pdf",
            phoneNumber: "123-456-7894",
            proposedPresentationBlockId: null,
            proposedPositionWithinBlock: null,
            coAdvisor: null,
            status: "Submitted",
            createdAt: "2025-01-11T00:54:45.336Z",
            updatedAt: "2025-01-11T00:54:45.336Z",
            mainAuthor: {
              id: "b016a107-ca9a-42c4-8975-51b539fc2695",
              name: "Doutorando Default 4",
              email: "docdefault4@example.com",
            },
            advisor: {
              id: "bc8ad699-311f-4d38-a92b-0546f8183f6d",
              name: "Professor Admin",
              email: "profadmin@example.com",
            },
          },
        },
        {
          id: "43f72083-cb53-4b6a-8e75-a9b524d02c67",
          submissionId: "a077b777-7a34-4c6a-9582-b16149115a36",
          presentationBlockId: "330e7ced-b935-4177-8114-a981595cd6df",
          positionWithinBlock: 2,
          status: "ToPresent",
          startTime: "2025-05-01T13:30:00.000Z",
          createdAt: "2025-01-11T00:54:45.884Z",
          updatedAt: "2025-01-11T00:54:45.884Z",
          submission: {
            id: "a077b777-7a34-4c6a-9582-b16149115a36",
            advisorId: "6d9c7e5e-b581-492a-906b-c6bd23696179",
            mainAuthorId: "49322d0a-608d-480a-b1e1-5a41c226aa5c",
            eventEditionId: "9f6b8707-0f34-4054-b56c-049a26db000e",
            title: "Internet of Things Networks",
            abstract: "Study of IoT network architectures and protocols.",
            pdfFile: "path/to/document6.pdf",
            phoneNumber: "123-456-7895",
            proposedPresentationBlockId: null,
            proposedPositionWithinBlock: null,
            coAdvisor: null,
            status: "Submitted",
            createdAt: "2025-01-11T00:54:45.347Z",
            updatedAt: "2025-01-11T00:54:45.347Z",
            mainAuthor: {
              id: "49322d0a-608d-480a-b1e1-5a41c226aa5c",
              name: "Doutorando Default 5",
              email: "docdefault5@example.com",
            },
            advisor: {
              id: "6d9c7e5e-b581-492a-906b-c6bd23696179",
              name: "Professor Default",
              email: "profdefault@example.com",
            },
          },
        },
      ],
      panelists: [],
      availablePositionsWithInBlock: [],
    },
  ];


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
  }


  const handleDelete = async (submissionId: any) => {
    await deletePresentationBookmark(submissionId);

    const updatedSubmissions = sessionsListValues.filter(
      (submission) => submission.id !== submissionId
    );
    setSessionsListValues(updatedSubmissions);
  };

  return (
    <>
    <Banner title="Minhas bancas" />

    <div className="conteudo">
      <h2>Minhas bancas</h2>
      <p>Esta página exibe as bancas pelas quais você, como professor orientador, é responsável. As apresentações estão organizadas por sessão, e cada sessão é destacada com uma cor distinta para facilitar a identificação.</p>
        <div
          className="d-flex flex-column"
          style={{
            gap: "20px",
          }}
        >
          {!!responseSessions?.length &&
                      responseSessions
                        ?.toSorted(
                          (a, b) =>
                            new Date(a.startTime).getTime() -
                            new Date(b.startTime).getTime()
                        )
                        // ?.filter(
                        //   item => 
                        //     item.panelists.find(panelist=> panelist.userId == user?.id)
                        // )

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
