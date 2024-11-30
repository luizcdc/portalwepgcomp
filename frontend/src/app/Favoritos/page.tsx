"use client";

import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { FavoritosMock } from "@/mocks/Favoritos";
import Listagem from "@/templates/Listagem/Listagem";
import { useEffect, useState } from "react";

export default function Favoritos() {
  const { title, userArea, cardsMock } = FavoritosMock;

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] =
    useState<any[]>(cardsMock);

  useEffect(() => {
    const newSessionsList =
      cardsMock?.filter((v) => v.name?.includes(searchValue.trim())) ?? [];
    setSessionsListValues(newSessionsList);
  }, [searchValue]);

  return (
    <ProtectedLayout>
      <div
        className="d-flex flex-column"
        style={{
          gap: "50px",
        }}
      >
        <Listagem
          title={title}
          cardsList={sessionsListValues}
          isFavorites
          searchValue={searchValue}
          onChangeSearchValue={(value) => setSearchValue(value)}
          searchPlaceholder={userArea.search}
        />
      </div>
    </ProtectedLayout>
  );
}
