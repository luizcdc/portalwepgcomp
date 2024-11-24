import React, { useContext } from "react";
import Image from "next/image";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import "./protectedLayout.scss";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { signed } = useContext(AuthContext);

  if (!signed) {
    return (
      <h1 className='title-protected-layout'>
        <Image
          src={"/assets/images/emoji_frown.svg"}
          alt='Emoji Triste'
          width={60}
          height={60}
        />
        Ops! Você não possui acesso!
      </h1>
    );
  }

  return children;
};
