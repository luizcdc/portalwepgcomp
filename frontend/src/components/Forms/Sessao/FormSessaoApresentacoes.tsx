"use client";

import Calendar from "@/components/UI/calendar";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";

export default function FormSessaoApresentacoes() {
  const { formApresentacoesFields } = ModalSessaoMock;

  return (
    <form className="row g-3" onSubmit={() => {}}>
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.apresentacoes.label}
        </label>
        <select
          id="sala"
          className="form-select"
          aria-label="Default select example"
        >
          <option selected hidden>
            {formApresentacoesFields.apresentacoes.placeholder}
          </option>
          {formApresentacoesFields.apresentacoes.options?.map((op, i) => (
            <option id={`apresentacoes-op${i}`} key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        <p className="text-danger error-message"></p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.sala.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <select
          id="sala"
          className="form-select"
          aria-label="Default select example"
        >
          <option selected hidden>
            {formApresentacoesFields.sala.placeholder}
          </option>
          {formApresentacoesFields.sala.options?.map((op, i) => (
            <option id={`sala-op${i}`} key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        <p className="text-danger error-message"></p>
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
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            disabled
          >
            <Calendar color={"#FFA90F"} />
          </button>
          <input
            placeholder={formApresentacoesFields.inicio.placeholder}
            type="datetime-local"
            className="form-control"
            id="inicio"
            aria-describedby="button-addon2"
          />
        </div>
        <p className="text-danger error-message"></p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.avaliadores.label}
        </label>
        <select
          id="sala"
          className="form-select"
          aria-label="Default select example"
        >
          <option selected hidden>
            {formApresentacoesFields.avaliadores.placeholder}
          </option>
          {formApresentacoesFields.avaliadores.options?.map((op, i) => (
            <option id={`avaliadores-op${i}`} key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        <p className="text-danger error-message"></p>
      </div>
    </form>
  );
}
