"use client";
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { startOfYear, endOfYear } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEdicao } from "@/hooks/useEdicao";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import "./style.scss";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useRouter } from "next/navigation";
import { ptBR } from "date-fns/locale";
import { UserContext } from "@/context/user";
import { useSweetAlert } from "@/hooks/useAlert";
import { useCommittee } from "@/hooks/useCommittee";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const formEdicaoSchema = z.object({
  titulo: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "Nome do evento é obrigatório!"),

  descricao: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "Descrição do evento é obrigatório!"),

  inicio: z
    .string({
      invalid_type_error: "Data e horário de início são obrigatórios!",
    })
    .datetime({
      message: "Data ou horário inválidos!",
    }),

  final: z
    .string({ invalid_type_error: "Data e horário de fim são obrigatórios!" })
    .datetime({
      message: "Data ou horário inválidos!",
    }),

  local: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "Local do Evento é obrigatório!"),

  sala: z.string({ invalid_type_error: "Campo Inválido" }).optional(),

  comissao: z
    .array(
      z.object({
        label: z.string(),
        value: z.string({
          invalid_type_error: "Campo inválido!",
        }),
      })
    )
    .optional(),

  apoio: z
    .array(
      z.object({
        label: z.string(),
        value: z.string({
          invalid_type_error: "Campo inválido!",
        }),
      })
    )
    .optional(),

  apoioAd: z
    .array(
      z.object({
        label: z.string(),
        value: z.string({
          invalid_type_error: "Campo inválido!",
        }),
      })
    )
    .optional(),

  comunicacao: z
    .array(
      z.object({
        label: z.string(),
        value: z.string({
          invalid_type_error: "Campo inválido!",
        }),
      })
    )
    .optional(),

  sessoes: z.number({
    invalid_type_error: "O número de sessões é obrigatório!",
  }),
  duracao: z.number({
    invalid_type_error: "Informar a duração é obrigatório!",
  }),
  submissao: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "O texto para submissão é obrigatório!"),

  limite: z
    .string({
      invalid_type_error: "A data limite para submissão é obrigatória!",
    })
    .datetime({
      message: "Data inválida!",
    }),

  coordinatorId: z.string().optional(),
  partnersText: z.string().optional(),
});
type FormEdicaoSchema = z.infer<typeof formEdicaoSchema>;

interface FormEdicao {
  edicaoData?: any;
}

export function FormEdicao({ edicaoData }: Readonly<FormEdicao>) {
  const { showAlert } = useSweetAlert();
  const { createEdicao, updateEdicao, Edicao } = useEdicao();
  const { getCommitterAll, committerList } = useCommittee();
  const { user } = useContext(AuthContext);
  const { getAdvisors, advisors } = useContext(UserContext);
  const [advisorsLoaded, setAdvisorsLoaded] = useState(false);
  const [avaliadoresOptions, setAvaliadoresOptions] = useState<OptionType[]>(
    []
  );
  const router = useRouter();
  const { confirmButton } = ModalSessaoMock;
  registerLocale("pt-BR", ptBR);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormEdicaoSchema>({
    resolver: zodResolver(formEdicaoSchema),
    defaultValues: {
      inicio: "",
      final: "",
      limite: "",
    },
  });

  useEffect(() => {
    if (edicaoData && Object.keys(edicaoData).length) {
      setValue("titulo", edicaoData.name);
      setValue("descricao", edicaoData.description);
      setValue("inicio", edicaoData.startDate);
      setValue("final", edicaoData.endDate);
      setValue("local", edicaoData.location);
      setValue("sala", edicaoData?.roomName);
      setValue("coordinatorId", user?.id);
      setValue(
        "comissao",
        committerList
          ?.filter((value) => value.role === "OrganizingCommittee")
          ?.map((v) => {
            return { value: v.userId, label: v.userName };
          })
      );
      setValue(
        "apoio",
        committerList
          ?.filter((value) => value.role === "ITSupport")
          ?.map((v) => {
            return { value: v.userId, label: v.userName };
          })
      );
      setValue(
        "apoioAd",
        committerList
          ?.filter((value) => value.role === "AdministativeSupport")
          ?.map((v) => {
            return { value: v.userId, label: v.userName };
          })
      );
      setValue(
        "comunicacao",
        committerList
          ?.filter((value) => value.role === "Communication")
          ?.map((v) => {
            return { value: v.userId, label: v.userName };
          })
      );
      setValue("duracao", edicaoData.presentationDuration);
      setValue("sessoes", edicaoData.presentationsPerPresentationBlock);
      setValue("submissao", edicaoData.callForPapersText);
      setValue("limite", edicaoData.submissionDeadline);
      setValue("partnersText", "");
    }
  }, [committerList]);

  useEffect(() => {
    if (!advisorsLoaded) {
      getAdvisors();
      setAdvisorsLoaded(true);
    }
  }, [advisorsLoaded, getAdvisors]);

  const handleFormEdicao = async (data: FormEdicaoSchema) => {
    const {
      titulo,
      descricao,
      inicio,
      final,
      local,
      sala,
      comissao,
      apoio,
      apoioAd,
      comunicacao,
      sessoes,
      duracao,
      submissao,
      limite,
    } = data;

    if (!user) {
      showAlert({
        icon: "error",
        text: "Você precisa estar logado para realizar a submissão.",
        confirmButtonText: "Retornar",
      });

      return;
    }

    const body = {
      ...edicaoData,
      name: titulo,
      description: descricao,
      location: local,
      roomName: !edicaoData?.id ? sala : undefined,
      coordinatorId: user?.id,
      organizingCommitteeIds: comissao?.map((v) => v.value) || [],
      itSupportIds: apoio?.map((v) => v.value) || [],
      administrativeSupportIds: apoioAd?.map((v) => v.value) || [],
      communicationIds: comunicacao?.map((v) => v.value) || [],
      presentationDuration: duracao,
      presentationsPerPresentationBlock: sessoes,
      callForPapersText: submissao,
      startDate: inicio,
      submissionDeadline: limite,
      endDate: final,
      partnersText: "",
    } as EdicaoParams;

    if (edicaoData?.id) {
      updateEdicao(edicaoData?.id, body);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      const status = await createEdicao(body);

      if (status) {
        router.push("/home");
      }
    }
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

  useEffect(() => {
    if (edicaoData?.id) {
      getCommitterAll(edicaoData?.id);
    }
  }, [edicaoData]);

  const onInvalid = (errors) => console.error(errors);

  return (
    <form
      className="row g-3 w-75"
      onSubmit={handleSubmit(handleFormEdicao, onInvalid)}
    >
      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Nome do evento
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="nomeEvento"
          placeholder="WEPGCOMP 202.."
          {...register("titulo")}
        />
        <p className="text-danger error-message">{errors.titulo?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Descrição do evento
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="descricao"
          placeholder="Sobre o WEPGCOMP..."
          {...register("descricao")}
        />
        <p className="text-danger error-message">{errors.descricao?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Data e horário de início e fim do evento
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <div className="d-flex flex-row justify-content-start gap-2 ">
          <Controller
            name="inicio"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="ed-inicio-data"
                onChange={(date) =>
                  field.onChange(
                    dayjs(date).subtract(1, "day").toISOString() || null
                  )
                }
                selected={
                  field.value ? dayjs(field.value).add(1, "day").toDate() : null
                }
                showIcon
                className="form-control datepicker"
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                minDate={startOfYear(new Date())}
                maxDate={endOfYear(new Date())}
                placeholderText="(ex.: 22/10/2024)"
                isClearable
                toggleCalendarOnIconClick
              />
            )}
          />
          <p className="text-danger error-message">{errors.inicio?.message}</p>

          <Controller
            name="final"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="ed-final-data"
                onChange={(date) =>
                  field.onChange(
                    dayjs(date)
                      .set("hour", 23)
                      .set("minute", 59)
                      .toISOString() || null
                  )
                }
                selected={field.value ? dayjs(field.value).toDate() : null}
                showIcon
                className="form-control datepicker"
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                minDate={startOfYear(new Date())}
                maxDate={endOfYear(new Date())}
                placeholderText="(ex.: 22/10/2024)"
                isClearable
                toggleCalendarOnIconClick
              />
            )}
          />
          <p className="text-danger error-message">{errors.final?.message}</p>
        </div>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label  form-title">
          Local do evento
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="local"
          placeholder="Digite o local do evento"
          {...register("local")}
        />
        <p className="text-danger error-message">{errors.local?.message}</p>
      </div>

      {!edicaoData?.id && (
        <div className="col-12 mb-1">
          <label className="form-label  form-title">Sala do evento</label>
          <input
            type="text"
            className="form-control input-title"
            id="local"
            placeholder="Digite a sala do evento"
            {...register("sala")}
          />
          <p className="text-danger error-message">{errors.sala?.message}</p>
        </div>
      )}

      <div className="d-flex flex-column justify-content-center">
        <div className="fs-4"> Comissão Organizadora </div>
        <div className="col-12 mb-1">
          <label className="form-label  form-title">
            Comissão organizadora
            <span className="text-danger ms-1 form-title">*</span>
          </label>
          <Controller
            name="comissao"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="comissao-select"
                isMulti
                options={avaliadoresOptions}
                placeholder="Escolha o(s) usuário(s)"
                isClearable
              />
            )}
          />
          <p className="text-danger error-message">
            {errors.comissao?.message}
          </p>
        </div>
        <div className="col-12 mb-1">
          <label className="form-label  form-title">
            Apoio TI
            <span className="text-danger ms-1 form-title">*</span>
          </label>
          <Controller
            name="apoio"
            control={control}
            render={({ field }) => (
              <Select
                id="apoio-select"
                {...field}
                isMulti
                options={avaliadoresOptions}
                placeholder="Escolha o(s) usuário(s)"
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />

          <p className="text-danger error-message">{errors.apoio?.message}</p>
        </div>

        <div className="col-12 mb-1">
          <label className="form-label  form-title">
            Apoio Administrativo
            <span className="text-danger ms-1 form-title">*</span>
          </label>
          <Controller
            name="apoioAd"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="apoioAd-select"
                isMulti
                options={avaliadoresOptions}
                placeholder="Escolha o(s) usuário(s)"
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />

          <p className="text-danger error-message">{errors.apoioAd?.message}</p>
        </div>

        <div className="col-12 mb-1">
          <label className="form-label  form-title">
            Comunicação
            <span className="text-danger ms-1 form-title">*</span>
          </label>
          <Controller
            name="comunicacao"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="comunicacao-select"
                isMulti
                options={avaliadoresOptions}
                placeholder="Escolha o(s) usuário(s)"
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />

          <p className="text-danger error-message">
            {errors.comunicacao?.message}
          </p>
        </div>
      </div>

      <div className="d-flex flex-column justify-content-start">
        <div className="fs-4"> Sessões e apresentações </div>

        <div className="d-flex flex-row justify-content-start w-50 gap-3">
          <div className="col-12 mb-1">
            <label className="form-label form-title">
              Número de sessões
              <span className="text-danger ms-1 form-title">*</span>
            </label>
            <input
              type="number"
              className="form-control input-title"
              id="quantidadeSessão"
              placeholder="Quantidade de sessões"
              {...register("sessoes", { valueAsNumber: true })}
            />
            <p className="text-danger error-message">
              {errors.sessoes?.message}
            </p>
          </div>

          <div className="col-12 mb-1">
            <label className="form-label  form-title">
              Duração da Apresentação (minutos)
              <span className="text-danger ms-1 form-title">*</span>
            </label>
            <input
              type="number"
              className="form-control input-title"
              id="sessao"
              placeholder="ex.: 20 minutos"
              {...register("duracao", { valueAsNumber: true })}
            />
            <p className="text-danger error-message"></p>
          </div>
        </div>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Texto da Chamada para Submissão de Trabalhos
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="submissao"
          placeholder="Digite o texto aqui"
          {...register("submissao")}
        />
        <p className="text-danger error-message">{errors.submissao?.message}</p>
      </div>

      <div className="d-flex flex-column justify-content-start align-items-center gap-4">
        <div className="col-12 mb-1">
          <label className="form-label form-title">
            Data limite para a submissão
            <span className="text-danger ms-1 form-title">*</span>
          </label>
          <div className="input-group listagem-template-content-input w-100">
            <Controller
              control={control}
              name="limite"
              render={({ field }) => (
                <DatePicker
                  id="ed-deadline-data"
                  showIcon
                  onChange={(date) =>
                    field.onChange(date?.toISOString() || null)
                  }
                  selected={field.value ? new Date(field.value) : null}
                  placeholderText="(ex.: 22/10/2024)"
                  className="form-control datepicker"
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                  minDate={startOfYear(new Date())}
                  maxDate={endOfYear(new Date())}
                  isClearable
                  toggleCalendarOnIconClick
                />
              )}
            />
          </div>
          <p className="text-danger error-message">{errors.limite?.message}</p>
        </div>
      </div>

      <div className="d-grid gap-2 col-3 mx-auto">
        <button
          type="submit"
          className="btn text-white fs-5 submit-button"
          disabled={!Edicao?.isActive}
        >
          {confirmButton.label}
        </button>
      </div>
    </form>
  );
}
