"use client";
import React, { useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import { options } from "./../../../mocks/Forms";
import "./style.scss";

export function FormEdicao() {
  const [selectedOptions, setSelectedOptions] = useState<
    MultiValue<OptionType>
  >([]);

  const handleChange = (
    selected: MultiValue<OptionType> | SingleValue<OptionType>
  ) => {
    setSelectedOptions(selected as MultiValue<OptionType>);
  };

  return (
    <form className='row g-3 w-75'>
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
        />
        <p className='text-danger error-message'></p>
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
        />
        <p className='text-danger error-message'></p>
      </div>

      <div className='col-12 mb-1'>
        <label className='form-label form-title'>
          Data e horário de início e fim do evento
          <span className='text-danger ms-1 form-title'>*</span>
        </label>
        <div className='d-flex flex-row justify-content-start gap-2 '>
          <input
            type='date'
            className='form-control input-title'
            id='dataInicio'
          />
          <p className='text-danger error-message'></p>

          <input
            type='date'
            className='form-control input-title'
            id='dataFim'
          />
          <p className='text-danger error-message'></p>
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
        />
        <p className='text-danger error-message'></p>
      </div>

      <div className='d-flex flex-column justify-content-center'>
        <div className='fs-4'> Comissão Organizadora </div>
        <div className='col-12 mb-1'>
          <label className='form-label  form-title'>
            Coordenador(a) geral
            <span className='text-danger ms-1 form-title'>*</span>
          </label>

          <Select
            id='multi-select'
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            placeholder='Escolha o(s) usuário(s)'
            className='basic-multi-select'
            classNamePrefix='select'
          />

          <p className='text-danger error-message'></p>
        </div>
        <div className='col-12 mb-1'>
          <label className='form-label  form-title'>
            Comissão organizadora
            <span className='text-danger ms-1 form-title'>*</span>
          </label>

          <Select
            id='multi-select'
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            placeholder='Escolha o(s) usuário(s)'
            className='basic-multi-select'
            classNamePrefix='select'
          />
          <p className='text-danger error-message'></p>
        </div>
        <div className='col-12 mb-1'>
          <label className='form-label  form-title'>
            Apoio
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <Select
            id='multi-select'
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            placeholder='Escolha o(s) usuário(s)'
            className='basic-multi-select'
            classNamePrefix='select'
          />
          <p className='text-danger error-message'></p>
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
          />
          <p className='text-danger error-message'></p>
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
            />
            <p className='text-danger error-message'></p>
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
          />
          <p className='text-danger error-message'></p>
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
          />
          <p className='text-danger error-message'></p>
        </div>

        <div className='d-flex flex-row justify-content-start align-items-center gap-4'>
          <div className='col-12 mb-1 w-50'>
            <label className='form-label form-title'>
              Data limite para a submissão
              <span className='text-danger ms-1 form-title'>*</span>
            </label>
            <input
              type='date'
              className='form-control input-title'
              id='dataSubmissao'
            />
            <p className='text-danger error-message'></p>
          </div>

          <div className='d-flex flex-column justify-content-start'>
            <label className='form-label form-title'>
              Quem poderá avaliar as apresentações?
              <span className='text-danger ms-1 form-title'>*</span>
            </label>
            <div className='d-flex flex-row justify-content-start'>
              <div className='form-check me-3'>
                <input
                  type='radio'
                  className='form-check-input'
                  id='radio1'
                  value='Somente usuários logados'
                />
                <label
                  className='form-check-label input-title'
                  htmlFor='radio1'
                >
                  Somente usuários logados
                </label>
              </div>

              <div className='form-check me-3'>
                <input
                  type='radio'
                  className='form-check-input'
                  id='radio2'
                  value='Ouvintes'
                />
                <label
                  className='form-check-label input-title'
                  htmlFor='radio1'
                >
                  Ouvintes
                </label>
              </div>
            </div>
          </div>
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
