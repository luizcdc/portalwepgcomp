import React, { useEffect } from "react";
import "./protectedLayout.scss";
import { useRouter } from "next/navigation";
import { getUserLocalStorage } from "@/context/AuthProvider/util";
import { useSweetAlert } from "@/hooks/useAlert";
import { useEdicao } from "@/hooks/useEdicao";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getEdicaoByYear } = useEdicao();

  const router = useRouter();

  const { showAlert } = useSweetAlert();

  useEffect(() => {
    const signed = getUserLocalStorage();
    if (!signed) {
      setTimeout(() => {
        router.push("/login");
      }, 3000);

      showAlert({
        icon: "error",
        text: "Ops! Você não possui acesso e será redirecionado para o login!",
        confirmButtonText: "Retornar",
      });
    } else {
      const currentYear = String(new Date().getFullYear());

      getEdicaoByYear(currentYear);
    }
  }, []);

  return children;
};
