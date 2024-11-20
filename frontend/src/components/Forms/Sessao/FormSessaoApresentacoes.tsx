"use client";

import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import "./style.scss";

const formSessaoApresentacoesSchema = z.object({
  apresentacoes: z
    .string({
      invalid_type_error: "Campo inválido!",
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

  avaliadores: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .optional(),
});

export default function FormSessaoApresentacoes() {
  const { formApresentacoesFields, confirmButton } = ModalSessaoMock;

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
      apresentacoes: "",
      sala: "",
      inicio: null,
      avaliadores: "",
    },
  });

  const filterTimes = (time: Date) => {
    const hour = time.getHours();
    return hour < 12 && hour > 6;
  };

  const handleFormSessaoApresentacoes = (
    data: FormSessaoApresentacoesSchema
  ) => {
    console.log(data);
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
        <select
          id="sa-apresentacoes-select"
          className="form-select"
          {...register("apresentacoes")}
        >
          <option hidden>
            {formApresentacoesFields.apresentacoes.placeholder}
          </option>
          {formApresentacoesFields.apresentacoes.options?.map((op, i) => (
            <option id={`apresentacoes-op${i}`} key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
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
          {formApresentacoesFields.sala.options?.map((op, i) => (
            <option id={`sala-op${i}`} key={op} value={op}>
              {op}
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
                minDate={new Date()}
                maxDate={addDays(new Date(), 3)}
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
        <select
          id="sa-avaliadores-select"
          className="form-select"
          {...register("avaliadores")}
        >
          <option hidden>
            {formApresentacoesFields.avaliadores.placeholder}
          </option>
          {formApresentacoesFields.avaliadores.options?.map((op, i) => (
            <option id={`avaliadores-op${i}`} key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
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
