"use client";

import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useSession } from "@/hooks/useSession";

import "./style.scss";
import { getDurationInMinutes } from "@/utils/formatDate";
import { formatOptions } from "@/utils/formatOptions";

const formSessaoGeralSchema = z.object({
  titulo: z.string({
    required_error: "Título é obrigatório!",
    invalid_type_error: "Campo inválido!",
  }),

  nome: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: "O campo deve conter apenas letras.",
    })
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

  final: z
    .string({
      required_error: "Data e horário de fim são obrigatórios!",
      invalid_type_error: "Campo inválido!",
    })
    .datetime({
      message: "Data ou horário inválidos!",
    })
    .nullable(),
});

export default function FormSessaoGeral() {
  const { formGeralFields, confirmButton, eventEditionId } = ModalSessaoMock;
  const { createSession, updateSession, sessao } = useSession();

  type FormSessaoGeralSchema = z.infer<typeof formSessaoGeralSchema>;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSessaoGeralSchema>({
    resolver: zodResolver(formSessaoGeralSchema),
    defaultValues: {
      inicio: null,
      final: null,
    },
  });

  const roomsOptions = formatOptions(formGeralFields.sala.options, "name");

  const filterTimes = (time: Date) => {
    const hour = time.getHours();
    return hour < 12 && hour > 6;
  };

  const handleFormSessaoGeral = (data: FormSessaoGeralSchema) => {
    const { titulo, nome, sala, inicio, final } = data;

    if (!titulo || !sala || !inicio || !final) {
      throw new Error("Campos obrigatórios em branco.");
    }

    const duration = getDurationInMinutes(inicio, final);

    const body = {
      type: "General",
      eventEditionId,
      title: titulo,
      speakerName: nome,
      roomId: sala,
      startTime: inicio,
      duration,
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
      onSubmit={handleSubmit(handleFormSessaoGeral)}
    >
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          {formGeralFields.titulo.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={formGeralFields.titulo.placeholder}
          {...register("titulo")}
        />
        <p className="text-danger error-message">{errors.titulo?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formGeralFields.nome.label}
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-nome-input"
          placeholder={formGeralFields.nome.placeholder}
          {...register("nome")}
        />
        <p className="text-danger error-message">{errors.nome?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formGeralFields.sala.label}
        </label>
        <select
          id="sg-sala-select"
          className="form-select"
          {...register("sala")}
        >
          <option hidden>{formGeralFields.sala.placeholder}</option>
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
          {formGeralFields.inicio.label}
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
                minDate={new Date()}
                maxDate={addDays(new Date(), 3)}
                isClearable
                filterTime={filterTimes}
                placeholderText={formGeralFields.inicio.placeholder}
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
          {formGeralFields.final.label}
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
                minDate={new Date()}
                maxDate={addDays(new Date(), 3)}
                isClearable
                filterTime={filterTimes}
                placeholderText={formGeralFields.final.placeholder}
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
          className="btn btn-primary button-modal-component button-sessao-geral"
        >
          {confirmButton.label}
        </button>
      </div>
    </form>
  );
}
