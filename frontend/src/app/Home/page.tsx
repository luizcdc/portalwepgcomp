"use client";

import Carousel from "@/components/Carousel/Carousel";
import LocalEvento from "@/components/LocalEvento";
import Orientacao from "@/components/Orientacao";
import Realizacao from "@/components/Realizacao";
import SearchGroups from "@/components/SearchGroups";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Carousel />
      <Orientacao />
      <SearchGroups />
      <LocalEvento />
      <Realizacao />
    </div>
  );
}
