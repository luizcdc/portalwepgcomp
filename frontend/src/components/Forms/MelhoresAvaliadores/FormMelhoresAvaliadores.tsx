"use client";
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { UserContext } from "@/context/user";
import { useSweetAlert } from "@/hooks/useAlert";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";
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
    .optional(),
  eventEditionId: z.string(),
});
type formMelhorAvaliadorSchema = z.infer<typeof formMelhorAvaliadorSchema>;

export function FormMelhorAvaliador() {
  const { showAlert } = useSweetAlert();
  const { user } = useContext(AuthContext);
  const { confirmButton } = ModalSessaoMock;
  const { getAdvisors, advisors } = useContext(UserContext);
  const [advisorsLoaded, setAdvisorsLoaded] = useState(false);
  const { premiacaoAvaliadores, createAwardedPanelists } = usePremiacao();

  const [avaliadoresOptions, setAvaliadoresOptions] = useState<OptionType[]>(
    []
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<formMelhorAvaliadorSchema>({
    resolver: zodResolver(formMelhorAvaliadorSchema),
  });

  useEffect(() => {
    if (!advisorsLoaded) {
      getAdvisors();
      setAdvisorsLoaded(true);
    }
  }, [advisorsLoaded, getAdvisors]);

  const handleFormAvaliadores = async (data: formMelhorAvaliadorSchema) => {
    const { avaliadores } = data;

    const body = {
      eventEditionId: "",
      panelists: avaliadores?.map((v) => v.value) || [],
    } as AvaliadorParams;

    if (!user) {
      showAlert({
        icon: "error",
        text: "Você precisa estar logado para escolher os avaliadores.",
        confirmButtonText: "Retornar",
      });

      return;
    }

    await createAwardedPanelists(body);
  };

  useEffect(() => {
    if (advisors.length > 0) {
      const users = advisors.map((v) => ({
        value: v.id ?? "",
        label: v.name ?? "",
      }));
      setAvaliadoresOptions(users);
    }
  }, [advisors]);

  const onInvalid = (errors) => console.error(errors);

  return (
    <form
      className='row g-3 w-75'
      onSubmit={handleSubmit(handleFormAvaliadores, onInvalid)}
    >
      <div className='col-12 mb-1'>
        <Controller
          name='avaliadores'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id='comissao-select'
              isMulti
              options={avaliadoresOptions}
              placeholder='Escolha o(s) usuário(s)'
              isClearable
            />
          )}
        />
        <p className='text-danger error-message'>
          {errors.avaliadores?.message}
        </p>
      </div>

      <div className='d-grid gap-2 col-3 mx-auto'>
        <button type='submit' className='btn text-white fs-5 submit-button'>
          {confirmButton.label}
        </button>
      </div>
    </form>
  );
}
