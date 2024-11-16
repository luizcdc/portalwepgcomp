"use client";

import { ModalSessaoMock } from "@/mocks/ModalSessoes";

export default function FormSessaoGeral(){
  const { formGeralFields } = ModalSessaoMock;

    return <form className="row g-3" onSubmit={() => {}}>
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
    </form>
}