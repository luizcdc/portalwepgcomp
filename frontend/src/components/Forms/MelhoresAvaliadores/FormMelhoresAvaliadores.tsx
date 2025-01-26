"use client";
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useSweetAlert } from "@/hooks/useAlert";
import { usePremiacao } from "@/hooks/usePremiacao";

const formMelhorAvaliadorSchema = z.object({
  avaliadores: z
    .array(
      z.object({
        label: z.string(),
        value: z.string({
          invalid_type_error: "Campo inválido!",
        }),
      })
    )
    .max(3, { message: "Você deve selecionar até 3 avaliadores!" }),
  eventEditionId: z.string(),
});
type formMelhorAvaliadorSchema = z.infer<typeof formMelhorAvaliadorSchema>;

export function FormMelhorAvaliador() {
  const { showAlert } = useSweetAlert();
  const { user } = useContext(AuthContext);
  const [panelistsLoaded, setPanelistsLoaded] = useState(false);
  const { createAwardedPanelists, getPanelists, listPanelists } =
    usePremiacao();

  const [avaliadoresOptions, setAvaliadoresOptions] = useState<OptionType[]>(
    []
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<formMelhorAvaliadorSchema>({
    resolver: zodResolver(formMelhorAvaliadorSchema),
    defaultValues: {
      eventEditionId: getEventEditionIdStorage() ?? "",
    },
  });

  useEffect(() => {
    if (!panelistsLoaded) {
      getPanelists(getEventEditionIdStorage() ?? "");
      setPanelistsLoaded(true);
    }
  }, [panelistsLoaded, getPanelists]);

  const handleFormAvaliadores = async (data: formMelhorAvaliadorSchema) => {
    const { avaliadores, eventEditionId } = data;

    const body = {
      eventEditionId,
      panelists: avaliadores?.map((v) => ({ userId: v.value })) || [],
    } as AvaliadorParams;

    if (!user) {
      showAlert({
        icon: "error",
        text: "Você precisa estar logado para escolher os avaliadores.",
        confirmButtonText: "Retornar",
      });

      return;
    }

    if (avaliadores?.length > 3) {
      showAlert({
        icon: "error",
        text: "Você deve selecionar até 3 avaliadores.",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (eventEditionId) {
      await createAwardedPanelists(body);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  useEffect(() => {
    if (listPanelists.length > 0) {
      const users = listPanelists.map((v) => ({
        value: v.id ?? "",
        label: v.name ?? "",
      }));
      setAvaliadoresOptions(users);
    }
  }, [listPanelists]);

  const onInvalid = (errors) => console.error(errors);

  return (
    <form
      className='row g-3 w-80'
      onSubmit={handleSubmit(handleFormAvaliadores, onInvalid)}
    >
      <div className='col-12 mb-1'>
        <Controller
          name='avaliadores'
          control={control}
          rules={{ required: "Você deve selecionar exatamente 3 avaliadores!" }}
          render={({ field }) => (
            <Select
              {...field}
              id='melhoresAvaliadores-select'
              isMulti
              options={avaliadoresOptions}
              placeholder='Escolha o(s) usuário(s)'
              isClearable
              onChange={(selected) => field.onChange(selected)}
              value={field.value || []}
            />
          )}
        />
        <p className='text-danger error-message'>
          {errors.avaliadores?.message}
        </p>
      </div>
    </form>
  );
}
