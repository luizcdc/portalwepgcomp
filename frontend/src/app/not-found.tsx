"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

import "./not-found.scss";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/home");
    }, 3000);
  }, []);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center not-found-layout">
      <h1 className="title-not-found-layout">
        <Image
          src={"/assets/images/emoji_frown.svg"}
          alt="Emoji Triste"
          width={60}
          height={60}
        />
        Ops! Essa página não existe e você será redirecionado para a tela
        inicial!
      </h1>
    </div>
  );
}
