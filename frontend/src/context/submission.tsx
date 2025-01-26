import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { submissionApi } from "@/services/submission";

interface SubmissionProps {
  children: ReactNode;
}

interface SubmissionProviderData {
  loadingSubmissionList: boolean;
  loadingSubmission: boolean;
  submissionList: Submission[];
  submission: Submission | null;
  getSubmissions: (params: GetSubmissionParams) => void;
  getSubmissionById: (idSubmission: string) => void;
  createSubmission: (body: SubmissionParams) => Promise<boolean>;
  updateSubmissionById: (
    idSubmission: string,
    body: SubmissionParams
  ) => Promise<boolean>;
  deleteSubmissionById: (idSubmission: string) => void;
}

export const SubmissionContext = createContext<SubmissionProviderData>(
  {} as SubmissionProviderData
);

export const SubmissionProvider = ({ children }: SubmissionProps) => {
  const [loadingSubmissionList, setLoadingSubmissionList] =
    useState<boolean>(false);
  const [loadingSubmission, setLoadingSubmission] = useState<boolean>(false);
  const [submissionList, setSubmissionList] = useState<Submission[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const { showAlert } = useSweetAlert();

  const getSubmissions = async (params: GetSubmissionParams) => {
    setLoadingSubmissionList(true);

    try {
      const response = await submissionApi.getSubmissions(params);
      setSubmissionList(response);
    } catch (err: any) {
      console.error(err);
      setSubmissionList([]);

      showAlert({
        icon: "error",
        title: "Erro ao listar apresentações",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a busca.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingSubmissionList(false);
    }
  };

  const getSubmissionById = async (idSubmission: string) => {
    setLoadingSubmission(true);

    try {
      const response = await submissionApi.getSubmissionById(idSubmission);
      setSubmission(response);
    } catch (err: any) {
      console.error(err);
      setSubmission(null);

      showAlert({
        icon: "error",
        title: "Erro ao buscar apresentação",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a busca.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingSubmission(false);
    }
  };

  const createSubmission = async (body: SubmissionParams) => {
    setLoadingSubmission(true);

    return submissionApi
      .createSubmission(body)
      .then((response) => {
        setSubmission(response);

        getSubmissions({ eventEditionId: body.eventEditionId });

        const modalElementButton = document.getElementById(
          "editarApresentacaoModalClose"
        ) as HTMLButtonElement;

        if (modalElementButton) {
          modalElementButton.click();
        }

        showAlert({
          icon: "success",
          title: "Apresentação cadastrada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });

        return true;
      })
      .catch((err) => {
        setSubmission(null);

        showAlert({
          icon: "error",
          title: "Erro ao cadastrar apresentação",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });

        return false;
      })
      .finally(() => {
        setLoadingSubmission(false);
      });
  };

  const updateSubmissionById = async (
    idSubmission: string,
    body: SubmissionParams
  ) => {
    setLoadingSubmission(true);

    return submissionApi
      .updateSubmissionById(idSubmission, body)
      .then((response) => {
        setSubmission(response);

        getSubmissions({ eventEditionId: body.eventEditionId });

        const modalElementButton = document.getElementById(
          "editarApresentacaoModalClose"
        ) as HTMLButtonElement;

        if (modalElementButton) {
          modalElementButton.click();
        }

        showAlert({
          icon: "success",
          title: "Apresentação editada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });

        return true;
      })
      .catch((err) => {
        setSubmission(null);

        showAlert({
          icon: "error",
          title: "Erro ao editar apresentação",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro durante a edição. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });

        return false;
      })
      .finally(() => {
        setLoadingSubmission(false);
      });
  };

  const deleteSubmissionById = async (idSubmission: string) => {
    setLoadingSubmission(true);

    try {
      const response = await submissionApi.deleteSubmissionById(idSubmission);
      setSubmission(response);

      showAlert({
        icon: "success",
        title: "Apresentação removida com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error(err);
      setSubmission(null);

      showAlert({
        icon: "error",
        title: "Erro ao remover apresentação",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a remoção. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingSubmission(false);
    }
  };

  return (
    <SubmissionContext.Provider
      value={{
        loadingSubmission,
        loadingSubmissionList,
        submission,
        submissionList,
        getSubmissions,
        getSubmissionById,
        createSubmission,
        updateSubmissionById,
        deleteSubmissionById,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};
