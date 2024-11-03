"use client";

import Carousel from "@/components/Carousel/Carousel";
import LocalEvento from "@/components/LocalEvento";
import Orientacao from "@/components/Orientacao";
import SearchGroups from "@/components/SearchGroups";

export default function Home() {
  return (
    <div>
      <Carousel />
      <Orientacao />
      <SearchGroups />
      <LocalEvento />
    </div>
  );
}
