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

  sala: z.string({
    required_error: "Sala é obrigatória!",
    invalid_type_error: "Campo inválido!",
  }),

  inicio: z
    .string({
      required_error: "Data e horário de início são obrigatórios!",
      invalid_type_error: "Campo inválido!",
    })
    .datetime({
      message: "Data ou horário inválidos!",
    })
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
  const { formApresentacoesFields, confirmButton, eventEditionId } =
    ModalSessaoMock;
  const { createSession, updateSession, sessao } = useSession();

  type FormSessaoApresentacoesSchema = z.infer<
    typeof formSessaoApresentacoesSchema
  >;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSessaoApresentacoesSchema>({
    resolver: zodResolver(formSessaoApresentacoesSchema),
    defaultValues: {
      inicio: null,
    },
  });

  const salasOptions = formatOptions(
    formApresentacoesFields.sala.options,
    "name"
  );

  const apresentacoesOptions = formatOptions(
    formApresentacoesFields.apresentacoes.options,
    "name"
  );

  const avaliadoresOptions = formatOptions(
    formApresentacoesFields.avaliadores.options,
    "name"
  );

  const filterTimes = (time: Date) => {
    const hour = time.getHours();
    return hour < 12 && hour > 6;
  };

  const handleFormSessaoApresentacoes = (
    data: FormSessaoApresentacoesSchema
  ) => {
    const { apresentacoes, sala, inicio, avaliadores } = data;

    if (!sala || !inicio) {
      throw new Error("Campos obrigatórios em branco.");
    }

    const body = {
      type: "Presentation",
      eventEditionId,
      apresentacoes: apresentacoes?.map((v) => v.value) || [],
      roomId: sala,
      startTime: inicio,
      avaliadores: avaliadores?.map((v) => v.value) || [],
    } as SessaoParams;

    if (sessao?.id) {
      updateSession(sessao?.id, body);
      return;
    }

    createSession(body);
  };

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
        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.sala.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <select
          id="sa-sala-select"
          className="form-select"
          {...register("sala")}
        >
          <option hidden>{formApresentacoesFields.sala.placeholder}</option>
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
                // minDate={new Date()}
                // maxDate={addDays(new Date(), 3)}
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
