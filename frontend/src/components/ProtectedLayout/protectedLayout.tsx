import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import "./protectedLayout.scss";
import { useRouter } from "next/navigation";
import { useEdicao } from "@/hooks/useEdicao";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { signed } = useContext(AuthContext);

  const { getEdicaoByYear } = useEdicao();

  useEffect(() => {
    getEdicaoByYear("2024");
  }, []);

  if (!signed) {
    setTimeout(() => {
      router.push("/Login");
    }, 3000);

    return (
      <div className="d-flex flex-column align-items-center justify-content-center protected-layout">
        <h1 className="title-protected-layout">
          <Image
            src={"/assets/images/emoji_frown.svg"}
            alt="Emoji Triste"
            width={60}
            height={60}
          />
          Ops! Você não possui acesso e será redirecionado para o login!
        </h1>
      </div>
    );
  }

  return children;
};
