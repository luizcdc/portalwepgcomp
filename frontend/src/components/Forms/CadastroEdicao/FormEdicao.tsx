export function FormEdicao() {
  return (
    <form className='row g-3'>
      <div className='col-12 mb-1'>
        <label className='form-label fw-bold form-title'>
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
        <label className='form-label fw-bold form-title'>
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
        <label className='form-label fw-bold form-title'>
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

      <div>
        Comissão Organizadora
        <div className='col-12 mb-1'>
          <label className='form-label fw-bold form-title'>
            Coordenador(a) geral
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <input
            type='select'
            className='form-control input-title'
            id='coordenador'
            placeholder='Escolha o(s) usuário(s)'
          />
          <p className='text-danger error-message'></p>
        </div>
        <div className='col-12 mb-1'>
          <label className='form-label fw-bold form-title'>
            Comissão organizadora
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <input
            type='select'
            className='form-control input-title'
            id='comissão'
            placeholder='Escolha o(s) usuário(s)'
          />
          <p className='text-danger error-message'></p>
        </div>
        <div className='col-12 mb-1'>
          <label className='form-label fw-bold form-title'>
            Apoio
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <input
            type='select'
            className='form-control input-title'
            id='apoio'
            placeholder='Escolha o(s) usuário(s)'
          />
          <p className='text-danger error-message'></p>
        </div>
      </div>

      <div>
        Sessões e apresentações
        <div className='col-12 mb-1'>
          <label className='form-label fw-bold form-title'>
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
        <div>
          <div className='col-12 mb-1'>
            <label className='form-label fw-bold form-title'>
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
            <label className='form-label fw-bold form-title'>
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
          <label className='form-label fw-bold form-title'>
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
          <label className='form-label fw-bold form-title'>
            Texto da Chamada para Submissão de Trabalhos
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <input
            type='text'
            className='form-control input-title'
            id='submissao'
            placeholder='digite o texto aqui'
          />
          <p className='text-danger error-message'></p>
        </div>
        <div>
          <div className='col-12 mb-1'>
            <label className='form-label fw-bold form-title'>
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

          <div>
            <label className='form-label fw-bold form-title'>
              Quem poderá avaliar as apresentações?
              <span className='text-danger ms-1 form-title'>*</span>
            </label>
            <div className='form-check me-3'>
              <input
                type='radio'
                className='form-check-input'
                id='radio1'
                value='Somente usuários logados'
              />
              <label
                className='form-check-label fw-bold input-title'
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
                className='form-check-label fw-bold input-title'
                htmlFor='radio1'
              >
                Ouvintes
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className='d-grid gap-2 col-3 mx-auto'>
        <button
          type='submit'
          className='btn text-white fs-5 fw-bold submit-button'
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
