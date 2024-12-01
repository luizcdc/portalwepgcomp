"use client";
import React, { useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { options } from "./../../../mocks/Forms";
import "./style.scss";
import { useEdicao } from "@/hooks/useEdicao";

const formEdicaoSchema = z.object({
  titulo: z
    .string({
      required_error: "Nome do evento é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: "O campo deve conter apenas letras.",
    }),

  descricao: z
    .string({
      required_error: "Descrição do evento é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: "O campo deve conter apenas letras.",
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

  local: z
    .string({
      required_error: "Local do Evento é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: "O campo deve conter apenas letras.",
    }),

  coordenador: z
    .array(
      z.object({
        label: z.string(),
        value: z.string({
          invalid_type_error: "Campo inválido!",
        }),
      })
    )
    .optional(),

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

  salas: z.string().optional(),
  sessoes: z.string().optional(),
  duracao: z.string().optional(),
  submissao: z
    .string({
      required_error: "O texto para submissão é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: "O campo deve conter apenas letras.",
    }),
  limite: z
    .string({
      required_error: "A data limite para submissão é obrigatória!",
      invalid_type_error: "Campo inválido!",
    })
    .datetime({
      message: "Data inválida!",
    })
    .nullable(),
});

export function FormEdicao() {
  const [selectedOptions, setSelectedOptions] = useState<
    MultiValue<OptionType>
  >([]);

  const handleChange = (
    selected: MultiValue<OptionType> | SingleValue<OptionType>
  ) => {
    setSelectedOptions(selected as MultiValue<OptionType>);
  };

  type FormEdicaoSchema = z.infer<typeof formEdicaoSchema>;
  const { createEdicao, updateEdicao, Edicao } = useEdicao();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormEdicaoSchema>({
    resolver: zodResolver(formEdicaoSchema),
    defaultValues: {
      inicio: null,
      final: null,
      limite: null,
    },
  });

  const filterTimes = (time: Date) => {
    const hour = time.getHours();
    return hour < 12 && hour > 6;
  };

  const handleFormEdicao = (data: FormEdicaoSchema) => {
    const {
      titulo,
      descricao,
      inicio,
      final,
      local,
      coordenador,
      comissao,
      apoio,
      salas,
      sessoes,
      duracao,
      submissao,
      limite,
    } = data;

    if (
      !titulo ||
      !descricao ||
      !inicio ||
      !final ||
      !local ||
      !coordenador ||
      !comissao ||
      !apoio ||
      !salas ||
      !sessoes ||
      !duracao ||
      !submissao ||
      !limite
    ) {
      throw new Error("Campos obrigatórios em branco.");
    }

    const body = {
      name: titulo,
      description: descricao,
      location: local,
      coordinatorId: coordenador?.map((v) => v.value) || [],
      comissao: comissao?.map((v) => v.value) || [],
      apoio: apoio?.map((v) => v.value) || [],
      presentationDuration: duracao,
      salas: salas,
      sessoes: sessoes,
      callForPapersText: submissao,
      startDate: inicio,
      submissionDeadline: limite,
      endDate: final,
    } as EdicaoParams;

    if (Edicao?.id) {
      updateEdicao(Edicao?.id, body);
      return;
    }

    createEdicao(body);
  };

  return (
    <form className='row g-3 w-75' onSubmit={handleSubmit(handleFormEdicao)}>
      <div className='col-12 mb-1'>
        <label className='form-label form-title'>
          Nome do evento
          <span className='text-danger ms-1 form-title'>*</span>
        </label>
        <input
          type='text'
          className='form-control input-title'
          id='nomeEvento'
          placeholder='WEPGCOMP 202..'
          {...register("titulo")}
        />
        <p className='text-danger error-message'>{errors.titulo?.message}</p>
      </div>

      <div className='col-12 mb-1'>
        <label className='form-label form-title'>
          Descrição do evento
          <span className='text-danger ms-1 form-title'>*</span>
        </label>
        <input
          type='text'
          className='form-control input-title'
          id='descricao'
          placeholder='Sobre o WEPGCOMP...'
          {...register("descricao")}
        />
        <p className='text-danger error-message'>{errors.descricao?.message}</p>
      </div>

      <div className='col-12 mb-1'>
        <label className='form-label form-title'>
          Data e horário de início e fim do evento
          <span className='text-danger ms-1 form-title'>*</span>
        </label>
        <div className='d-flex flex-row justify-content-start gap-2 '>
                  <Controller
                  name="inicio"
          control={control}
          render={({ field }) => (

            <DatePicker
            id="ed-inicio-data"
                showIcon
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                selected={field.value ? new Date(field.value) : null}
                className="form-control datepicker"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={addDays(new Date(), 3)}
                isClearable
                toggleCalendarOnIconClick
            />
          )}
                  />
          <p className='text-danger error-message'>{errors.inicio?.message}</p>

                   <Controller
                  name="final"
          control={control}
          render={({ field }) => (

            <DatePicker
            id="ed-final-data"
                showIcon
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                selected={field.value ? new Date(field.value) : null}
                className="form-control datepicker"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={addDays(new Date(), 3)}
                isClearable
                toggleCalendarOnIconClick
            />
          )}
                  />
          <p className='text-danger error-message'>{errors.final?.message}</p>
        </div>
      </div>

      <div className='col-12 mb-1'>
        <label className='form-label  form-title'>
          Local do evento
          <span className='text-danger ms-1 form-title'>*</span>
        </label>
        <input
          type='text'
          className='form-control input-title'
          id='local'
          placeholder='Digite o local do evento'
          {...register("local")}
        />
        <p className='text-danger error-message'>{errors.local?.message}</p>
      </div>

      <div className='d-flex flex-column justify-content-center'>
        <div className='fs-4'> Comissão Organizadora </div>
        <div className='col-12 mb-1'>
          <label className='form-label  form-title'>
            Coordenador(a) geral
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <Controller
          name="coordenador"
          control={control}
          render={({ field }) => (
          <Select
            id='ed-select'
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            placeholder='Escolha o(s) usuário(s)'
            className='basic-multi-select'
            classNamePrefix='select'
          />
          )}
          />

          <p className='text-danger error-message'>{errors.coordenador?.message}</p>
        </div>
        <div className='col-12 mb-1'>
          <label className='form-label  form-title'>
            Comissão organizadora
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
<Controller
          name="comissao"
          control={control}
          render={({ field }) => (
          <Select
          {...field}
            id='ed-select'
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            placeholder='Escolha o(s) usuário(s)'
            className='basic-multi-select'
            classNamePrefix='select'
          />
           )}
          />
          <p className='text-danger error-message'>{errors.comissao?.message}</p>
        </div>
        <div className='col-12 mb-1'>
          <label className='form-label  form-title'>
            Apoio
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <Controller
          name="apoio"
          control={control}
          render={({ field }) => (
          <Select
          {...field}
            id='ed-select'
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            placeholder='Escolha o(s) usuário(s)'
            className='basic-multi-select'
            classNamePrefix='select'
          />

          )}
          />

          <p className='text-danger error-message'>{errors.apoio?.message}</p>
        </div>
      </div>

      <div className='d-flex flex-column justify-content-start'>
        <div className='fs-4'> Sessões e apresentações </div>
        <div className='col-12 mb-1'>
          <label className='form-label form-title'>
            Número de salas
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <input
            type='text'
            className='form-control input-title'
            id='salas'
            placeholder='Número de salas (sempre serão alocadas como A, B,C...)'
            {...register("salas")}
          />
          <p className='text-danger error-message'> {errors.salas?.message}</p>
        </div>

        <div className='d-flex flex-row justify-content-start w-50 gap-3'>
          <div className='col-12 mb-1'>
            <label className='form-label form-title'>
              Número de sessões
              <span className='text-danger ms-1 form-title'>*</span>
            </label>
            <input
              type='text'
              className='form-control input-title'
              id='quantidadeSessão'
              placeholder='Quantidade de sessões'
              {...register("sessoes")}
            />
            <p className='text-danger error-message'>
              {errors.sessoes?.message}
            </p>
          </div>

          <div className='col-12 mb-1'>
            <label className='form-label  form-title'>
              Duração da Sessão
              <span className='text-danger ms-1 form-title'>*</span>
            </label>
            <input
              type='text'
              className='form-control input-title'
              id='sessao'
              placeholder='ex.: 20 minutos'
            />
            <p className='text-danger error-message'></p>
          </div>
        </div>

        <div className='col-12 mb-1'>
          <label className='form-label form-title'>
            Duração das apresentações
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <input
            type='text'
            className='form-control input-title'
            id='duracaoSessao'
            placeholder='ex: 20 minutos, ou seja, 12 minutos + 5 para perguntas + 3 para organização da próxima apresentação'
            {...register("duracao")}
          />
          <p className='text-danger error-message'>{errors.duracao?.message}</p>
        </div>

        <div className='col-12 mb-1'>
          <label className='form-label form-title'>
            Texto da Chamada para Submissão de Trabalhos
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <input
            type='text'
            className='form-control input-title'
            id='submissao'
            placeholder='Digite o texto aqui'
            {...register("submissao")}
          />
          <p className='text-danger error-message'>
            {errors.submissao?.message}
          </p>
        </div>

        <div className='d-flex flex-row justify-content-start align-items-center gap-4'>
          <div className='col-12 mb-1'>
            <label className='form-label form-title'>
              Data limite para a submissão
              <span className='text-danger ms-1 form-title'>*</span>
            </label>
              <Controller
                control={control}
                name='limite'
                render={({ field }) => (
                  <DatePicker
                    id='ed-deadline-data'
                    showIcon
                    onChange={(date) =>
                      field.onChange(date?.toISOString() || null)
                    }
                    selected={field.value ? new Date(field.value) : null}
                    className='form-control datepicker'
                    dateFormat='dd/MM/yyyy'
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 3)}
                    isClearable
                    toggleCalendarOnIconClick
                  />
                )}
              />
            <p className='text-danger error-message'>
              {errors.limite?.message}
            </p>
          </div>
        </div>

      <div className='d-grid gap-2 col-3 mx-auto'>
        <button type='submit' className='btn text-white fs-5 submit-button'>
          Salvar
        </button>
      </div>
    </form>
  );
}
