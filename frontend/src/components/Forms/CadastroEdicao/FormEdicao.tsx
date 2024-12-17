"use client";
import { useContext } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatOptions } from "@/utils/formatOptions";
import { useEdicao } from "@/hooks/useEdicao";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import "./style.scss";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useRouter } from "next/navigation";

const formEdicaoSchema = z.object({
  titulo: z.string({
    required_error: "Nome do evento é obrigatório!",
    invalid_type_error: "Campo inválido!",
  }),

  descricao: z.string({
    required_error: "Descrição do evento é obrigatório!",
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

  local: z.string({
    required_error: "Local do Evento é obrigatório!",
    invalid_type_error: "Campo inválido!",
  }),
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

  sessoes: z.number().optional(),
  duracao: z.number().optional(),
  submissao: z.string({
    required_error: "O texto para submissão é obrigatório!",
    invalid_type_error: "Campo inválido!",
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
  type FormEdicaoSchema = z.infer<typeof formEdicaoSchema>;
  const { createEdicao, updateEdicao, Edicao } = useEdicao();
  const { user } = useContext(AuthContext);
  const router = useRouter();
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

  const { formApresentacoesFields, confirmButton } = ModalSessaoMock;

  const avaliadoresOptions = formatOptions(
    formApresentacoesFields.avaliadores.options,
    "name"
  );

  const handleFormEdicao = async (data: FormEdicaoSchema) => {
    const {
      titulo,
      descricao,
      inicio,
      final,
      local,
      comissao,
      apoio,
      apoioAd,
      comunicacao,
      sessoes,
      duracao,
      submissao,
      limite,
    } = data;

    const body = {
      name: titulo,
      description: descricao,
      location: local,
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

    if (Edicao?.id) {
      await updateEdicao(Edicao?.id, body);
      return;
    }

    await createEdicao(body);
    router.push("/Home");
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
            name='inicio'
            control={control}
            render={({ field }) => (
              <DatePicker
                id='ed-inicio-data'
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                selected={field.value ? new Date(field.value) : null}
                showIcon
                className='form-control datepicker'
                dateFormat='dd/MM/yyyy'
                minDate={new Date()}
                maxDate={addDays(new Date(), 3)}
                placeholderText={formApresentacoesFields.inicio.placeholder}
                isClearable
                toggleCalendarOnIconClick
              />
            )}
          />
          <p className='text-danger error-message'>{errors.inicio?.message}</p>

          <Controller
            name='final'
            control={control}
            render={({ field }) => (
              <DatePicker
                id='ed-final-data'
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                selected={field.value ? new Date(field.value) : null}
                showIcon
                className='form-control datepicker'
                dateFormat='dd/MM/yyyy'
                minDate={new Date()}
                maxDate={addDays(new Date(), 3)}
                placeholderText={formApresentacoesFields.inicio.placeholder}
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
            Comissão organizadora
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <Controller
            name='comissao'
            control={control}
            render={() => (
              <Select
                id='ed-select'
                isMulti
                options={avaliadoresOptions}
                placeholder='Escolha o(s) usuário(s)'
                className='basic-multi-select'
                classNamePrefix='select'
              />
            )}
          />
          <p className='text-danger error-message'>
            {errors.comissao?.message}
          </p>
        </div>
        <div className='col-12 mb-1'>
          <label className='form-label  form-title'>
            Apoio TI
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <Controller
            name='apoio'
            control={control}
            render={() => (
              <Select
                id='ed-select'
                isMulti
                options={avaliadoresOptions}
                placeholder='Escolha o(s) usuário(s)'
                className='basic-multi-select'
                classNamePrefix='select'
              />
            )}
          />

          <p className='text-danger error-message'>{errors.apoio?.message}</p>
        </div>

        <div className='col-12 mb-1'>
          <label className='form-label  form-title'>
            Apoio Administrativo
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <Controller
            name='apoioAd'
            control={control}
            render={() => (
              <Select
                id='ed-select'
                isMulti
                options={avaliadoresOptions}
                placeholder='Escolha o(s) usuário(s)'
                className='basic-multi-select'
                classNamePrefix='select'
              />
            )}
          />

          <p className='text-danger error-message'>{errors.apoioAd?.message}</p>
        </div>

        <div className='col-12 mb-1'>
          <label className='form-label  form-title'>
            Comunicação
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <Controller
            name='comunicacao'
            control={control}
            render={() => (
              <Select
                id='ed-select'
                isMulti
                options={avaliadoresOptions}
                placeholder='Escolha o(s) usuário(s)'
                className='basic-multi-select'
                classNamePrefix='select'
              />
            )}
          />

          <p className='text-danger error-message'>
            {errors.comunicacao?.message}
          </p>
        </div>
      </div>

      <div className='d-flex flex-column justify-content-start'>
        <div className='fs-4'> Sessões e apresentações </div>

        <div className='d-flex flex-row justify-content-start w-50 gap-3'>
          <div className='col-12 mb-1'>
            <label className='form-label form-title'>
              Número de sessões
              <span className='text-danger ms-1 form-title'>*</span>
            </label>
            <input
              type='number'
              className='form-control input-title'
              id='quantidadeSessão'
              placeholder='Quantidade de sessões'
              {...register("sessoes", { valueAsNumber: true })}
            />
            <p className='text-danger error-message'>
              {errors.sessoes?.message}
            </p>
          </div>

          <div className='col-12 mb-1'>
            <label className='form-label  form-title'>
              Duração da Apresentação
              <span className='text-danger ms-1 form-title'>*</span>
            </label>
            <input
              type='number'
              className='form-control input-title'
              id='sessao'
              placeholder='ex.: 20 minutos'
              {...register("duracao", { valueAsNumber: true })}
            />
            <p className='text-danger error-message'></p>
          </div>
        </div>
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
        <p className='text-danger error-message'>{errors.submissao?.message}</p>
      </div>

      <div className='d-flex flex-column justify-content-start align-items-center gap-4'>
        <div className='col-12 mb-1'>
          <label className='form-label form-title'>
            Data limite para a submissão
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <div className='input-group listagem-template-content-input w-100'>
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
                  placeholderText={formApresentacoesFields.inicio.placeholder}
                  className='form-control datepicker'
                  dateFormat='dd/MM/yyyy'
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 3)}
                  isClearable
                  toggleCalendarOnIconClick
                />
              )}
            />
          </div>
          <p className='text-danger error-message'>{errors.limite?.message}</p>
        </div>
      </div>

      <div className='d-grid gap-2 col-3 mx-auto'>
        <button type='submit' className='btn text-white fs-5 submit-button'>
          {confirmButton.label}
        </button>
      </div>
    </form>
  );
}
