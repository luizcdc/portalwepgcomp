"use client";

import { ModalSessaoMock } from "@/mocks/ModalSessoes";

import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useSession } from "@/hooks/useSession";

import "./style.scss";
import { formatOptions } from "@/utils/formatOptions";
import { useUsers } from "@/hooks/useUsers";
import { useEdicao } from "@/hooks/useEdicao";
import { useEffect } from "react";
import { useSubmission } from "@/hooks/useSubmission";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

const formSessaoApresentacoesSchema = z.object({
  apresentacoes: z
    .array(
      z.object({
        label: z.string(),
        value: z.string({
          invalid_type_error: "Campo inválido!",
        }),
      })
    )
    .optional(),

  n_apresentacoes: z
    .number({
      invalid_type_error: "Campo inválido!",
    })
    .refine((value) => value > 0, {
      message:
        "Número de apresentações é obrigatório e deve ser maior que zero!",
    }),

  sala: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Sala é obrigatória!"),

  inicio: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .datetime({
      message: "Data ou horário inválidos!",
    })
    .min(1, "Data e horário de início são obrigatórios!")
    .nullable(),

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
});

export default function FormSessaoApresentacoes() {
  const { formApresentacoesFields, confirmButton } = ModalSessaoMock;
  const { createSession, updateSession, sessao, setSessao } = useSession();
  const { userList } = useUsers();
  const { submissionList } = useSubmission();
  const { Edicao } = useEdicao();

  type FormSessaoApresentacoesSchema = z.infer<
    typeof formSessaoApresentacoesSchema
  >;

  const defaultValues = sessao?.id
    ? {
        apresentacoes: [],
        n_apresentacoes: sessao?.numPresentations ?? 0,
        sala: sessao?.roomId ?? "",
        inicio: sessao?.startTime ?? null,
        avaliadores: [],
      }
    : {
        inicio: null,
        n_apresentacoes: 0,
      };

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormSessaoApresentacoesSchema>({
    resolver: zodResolver(formSessaoApresentacoesSchema),
    defaultValues,
  });

  const salasOptions = formatOptions(
    formApresentacoesFields.sala.options,
    "name"
  );

  const apresentacoesOptions = submissionList?.map((v) => {
    return {
      value: v.id,
      label: v?.title || "",
    };
  });

  const avaliadoresOptions = formatOptions(userList, "name");

  const filterTimes = (time: Date) => {
    const hour = time.getHours();
    return hour < 22 && hour > 6;
  };

  const handleFormSessaoApresentacoes = (
    data: FormSessaoApresentacoesSchema
  ) => {
    const { apresentacoes, sala, inicio, n_apresentacoes, avaliadores } = data;

    const eventEditionId = getEventEditionIdStorage();

    if (!sala || !inicio) {
      throw new Error("Campos obrigatórios em branco.");
    }

    const body = {
      type: "Presentation",
      eventEditionId: eventEditionId ?? "",
      submissions: apresentacoes?.length
        ? apresentacoes?.map((v) => v.value)
        : undefined,
      roomId: sala,
      startTime: inicio,
      numPresentations: n_apresentacoes,
      panelists: avaliadores?.length
        ? avaliadores?.map((v) => v.value)
        : undefined,
    } as SessaoParams;

    if (sessao?.id) {
      updateSession(sessao?.id, eventEditionId ?? "", body).then((status) => {
        if (status) {
          reset();
          setSessao(null);
        }
      });
      return;
    }

    createSession(eventEditionId ?? "", body).then((status) => {
      if (status) {
        reset();
        setSessao(null);
      }
    });
  };

  useEffect(() => {
    if (sessao) {
      setValue(
        "apresentacoes",
        sessao?.presentations?.map((v) => {
          return {
            value: v.submission?.id ?? "",
            label: v.submission?.title ?? "",
          };
        })
      );
      setValue("n_apresentacoes", sessao?.numPresentations ?? 0);
      setValue("sala", sessao?.roomId);
      setValue("inicio", sessao?.startTime);
      setValue(
        "avaliadores",
        sessao?.panelists?.map((v) => {
          return { value: v.userId, label: v.user?.name ?? "" };
        })
      );
    } else {
      setValue("apresentacoes", []);
      setValue("n_apresentacoes", 0);
      setValue("sala", "");
      setValue("inicio", "");
      setValue("avaliadores", []);
    }
  }, [sessao?.id]);

  return (
    <form
      className="row g-3 form-sessao"
      onSubmit={handleSubmit(handleFormSessaoApresentacoes)}
    >
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.apresentacoes.label}
        </label>
        <Controller
          name="apresentacoes"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              id="sa-apresentacoes-select"
              isClearable
              placeholder={formApresentacoesFields.apresentacoes.placeholder}
              options={apresentacoesOptions}
            />
          )}
        />

        <p className="text-danger error-message">
          {errors.apresentacoes?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          {formApresentacoesFields.n_apresentacoes.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="number"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={formApresentacoesFields.n_apresentacoes.placeholder}
          {...register("n_apresentacoes", { valueAsNumber: true })}
        />
        <p className="text-danger error-message">
          {errors.n_apresentacoes?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.sala.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <select
          id="sa-sala-select"
          className="form-select"
          {...register("sala")}
        >
          <option value="" hidden>
            {formApresentacoesFields.sala.placeholder}
          </option>
          {salasOptions?.map((op, i) => (
            <option id={`sala-op${i}`} key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        <p className="text-danger error-message">{errors.sala?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label
          htmlFor="datetime-local"
          className="form-label fw-bold form-title"
        >
          {formApresentacoesFields.inicio.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <div className="input-group listagem-template-content-input">
          <Controller
            control={control}
            name="inicio"
            render={({ field }) => (
              <DatePicker
                id="sa-inicio-data"
                showIcon
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                selected={field.value ? new Date(field.value) : null}
                showTimeSelect
                className="form-control datepicker"
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={new Date(Edicao?.startDate || "")}
                maxDate={new Date(Edicao?.endDate || "")}
                isClearable
                filterTime={filterTimes}
                placeholderText={formApresentacoesFields.inicio.placeholder}
                toggleCalendarOnIconClick
              />
            )}
          />
        </div>
        <p className="text-danger error-message">{errors.inicio?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.avaliadores.label}
        </label>
        <Controller
          name="avaliadores"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              id="sa-avaliadores-select"
              isClearable
              placeholder={formApresentacoesFields.avaliadores.placeholder}
              options={avaliadoresOptions}
            />
          )}
        />
        <p className="text-danger error-message">
          {errors.avaliadores?.message}
        </p>
      </div>

      <div className="d-flex justify-content-center">
        <button
          type="submit"
          id="sa-submit-button"
          className="btn btn-primary button-modal-component button-sessao-geral"
        >
          {confirmButton.label}
        </button>
      </div>
    </form>
  );
}
