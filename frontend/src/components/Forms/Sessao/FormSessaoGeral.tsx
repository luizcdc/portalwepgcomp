"use client";

import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useSession } from "@/hooks/useSession";

import "./style.scss";
import { getDurationInMinutes } from "@/utils/formatDate";
import { formatOptions } from "@/utils/formatOptions";
import { useEffect } from "react";
import { useEdicao } from "@/hooks/useEdicao";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

dayjs.extend(utc);
dayjs.extend(timezone);

const formSessaoAuxiliarSchema = z.object({
  titulo: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Título é obrigatório."),

  nome: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .optional(),

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

  final: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .datetime({
      message: "Data ou horário inválidos!",
    })
    .min(1, "Data e horário de final são obrigatórios!")
    .nullable(),
});

export default function FormSessaoAuxiliar() {
  const { formAuxiliarFields, confirmButton } = ModalSessaoMock;
  const { createSession, updateSession, sessao, setSessao, roomsList } =
    useSession();
  const { Edicao } = useEdicao();

  type FormSessaoAuxiliarSchema = z.infer<typeof formSessaoAuxiliarSchema>;

  const defaultValues = sessao?.id
    ? {
        titulo: sessao?.title ?? "",
        nome: sessao?.speakerName ?? "",
        sala: sessao?.roomId ?? "",
        inicio: sessao?.startTime ?? null,
        final: sessao?.startTime ?? null,
      }
    : {
        inicio: null,
        final: null,
      };

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormSessaoAuxiliarSchema>({
    resolver: zodResolver(formSessaoAuxiliarSchema),
    defaultValues,
  });

  const roomsOptions = formatOptions(roomsList, "name");

  const filterTimes = (time: Date) => {
    const hour = time.getHours();
    return hour < 22 && hour > 6;
  };

  const handleFormSessaoAuxiliar = (data: FormSessaoAuxiliarSchema) => {
    const { titulo, nome, sala, inicio, final } = data;

    const eventEditionId = getEventEditionIdStorage();

    if (!titulo || !sala || !inicio || !final) {
      throw new Error("Campos obrigatórios em branco.");
    }

    const duration = getDurationInMinutes(inicio, final);

    const body = {
      type: "General",
      eventEditionId: eventEditionId ?? "",
      title: titulo,
      speakerName: nome,
      roomId: sala,
      startTime: inicio,
      duration,
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
      setValue("titulo", sessao?.title ?? "");
      setValue("nome", sessao?.speakerName ?? "");
      setValue("sala", sessao?.roomId);
      setValue("inicio", sessao?.startTime);
      setValue(
        "final",
        dayjs(sessao?.startTime)
          .add(sessao?.duration ?? 0, "minute")
          .toISOString()
      );
    } else {
      setValue("titulo", "");
      setValue("nome", "");
      setValue("sala", "");
      setValue("inicio", "");
      setValue("final", "");
    }
  }, [sessao?.id]);

  return (
    <form
      className="row g-3 form-sessao"
      onSubmit={handleSubmit(handleFormSessaoAuxiliar)}
    >
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          {formAuxiliarFields.titulo.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={formAuxiliarFields.titulo.placeholder}
          {...register("titulo")}
        />
        <p className="text-danger error-message">{errors.titulo?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formAuxiliarFields.nome.label}
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-nome-input"
          placeholder={formAuxiliarFields.nome.placeholder}
          {...register("nome")}
        />
        <p className="text-danger error-message">{errors.nome?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formAuxiliarFields.sala.label}
        </label>
        <select
          id="sg-sala-select"
          className="form-select"
          {...register("sala")}
        >
          <option value="" hidden>
            {formAuxiliarFields.sala.placeholder}
          </option>
          {roomsOptions?.map((op, i) => (
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
          {formAuxiliarFields.inicio.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>

        <div className="input-group listagem-template-content-input">
          <Controller
            control={control}
            name="inicio"
            render={({ field }) => (
              <DatePicker
                id="sg-inicio-data"
                showIcon
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                selected={field.value ? new Date(field.value) : null}
                showTimeSelect
                className="form-control datepicker"
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={dayjs(Edicao?.startDate || "")
                  .add(1, "day")
                  .tz("America/Sao_Paulo", true)
                  .toDate()}
                maxDate={dayjs(Edicao?.endDate || "")
                  .tz("America/Sao_Paulo", true)
                  .toDate()}
                isClearable
                filterTime={filterTimes}
                placeholderText={formAuxiliarFields.inicio.placeholder}
                toggleCalendarOnIconClick
              />
            )}
          />
        </div>
        <p className="text-danger error-message">{errors.inicio?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label
          htmlFor="datetime-local"
          className="form-label fw-bold form-title"
        >
          {formAuxiliarFields.final.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>

        <div className="input-group listagem-template-content-input">
          <Controller
            control={control}
            name="final"
            render={({ field }) => (
              <DatePicker
                id="sg-final-data"
                showIcon
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                selected={field.value ? new Date(field.value) : null}
                showTimeSelect
                className="form-control datepicker"
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={dayjs(Edicao?.startDate || "")
                  .add(1, "day")
                  .tz("America/Sao_Paulo", true)
                  .toDate()}
                maxDate={dayjs(Edicao?.endDate || "")
                  .tz("America/Sao_Paulo", true)
                  .toDate()}
                isClearable
                filterTime={filterTimes}
                placeholderText={formAuxiliarFields.final.placeholder}
                toggleCalendarOnIconClick
              />
            )}
          />
        </div>
        <p className="text-danger error-message">{errors.final?.message}</p>
      </div>
      <div className="d-flex justify-content-center">
        <button
          type="submit"
          id="sg-submit-button"
          className="btn btn-primary button-modal-component button-sessao-auxiliar"
          disabled={!Edicao?.isActive}
        >
          {confirmButton.label}
        </button>
      </div>
    </form>
  );
}
