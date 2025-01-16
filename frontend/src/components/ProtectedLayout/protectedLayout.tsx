import React, { useEffect } from "react";
import "./protectedLayout.scss";
import { useRouter } from "next/navigation";
import { getUserLocalStorage } from "@/context/AuthProvider/util";
import { useSweetAlert } from "@/hooks/useAlert";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
    }
  }, []);

  // if (!signed) {
  //   return (
  //     <div className="d-flex flex-column align-items-center justify-content-center protected-layout">
  //       <h1 className="title-protected-layout">
  //         <Image
  //           src={"/assets/images/emoji_frown.svg"}
  //           alt="Emoji Triste"
  //           width={60}
  //           height={60}
  //         />
  //         Ops! Você não possui acesso e será redirecionado para o login!
  //       </h1>
  //     </div>
  //   );
  // }

  return children;
};
