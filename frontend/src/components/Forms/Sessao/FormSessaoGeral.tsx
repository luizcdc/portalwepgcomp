"use client";

import Calendar from "@/components/UI/calendar";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";

export default function FormSessaoGeral() {
  const { formGeralFields } = ModalSessaoMock;

  return (
    <form className="row g-3" onSubmit={() => {}}>
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formGeralFields.titulo.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="titulo"
          placeholder={formGeralFields.titulo.placeholder}
        />
        <p className="text-danger error-message"></p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formGeralFields.nome.label}
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="nome"
          placeholder={formGeralFields.nome.placeholder}
        />
        <p className="text-danger error-message"></p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formGeralFields.sala.label}
        </label>
        <select
          id="sala"
          className="form-select"
          aria-label="Default select example"
        >
          <option selected hidden>
            {formGeralFields.sala.placeholder}
          </option>
          {formGeralFields.sala.options?.map((op, i) => (
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
          {formGeralFields.inicio.label}
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
            placeholder={formGeralFields.inicio.placeholder}
            type="datetime-local"
            className="form-control"
            id="inicio"
            aria-describedby="button-addon2"
          />
        </div>
        <p className="text-danger error-message"></p>
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
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            disabled
          >
            <Calendar color={"#FFA90F"} />
          </button>
          <input
            placeholder={formGeralFields.final.placeholder}
            type="datetime-local"
            className="form-control"
            id="final"
            aria-describedby="button-addon2"
          />
        </div>
        <p className="text-danger error-message"></p>
      </div>
    </form>
  );
}
