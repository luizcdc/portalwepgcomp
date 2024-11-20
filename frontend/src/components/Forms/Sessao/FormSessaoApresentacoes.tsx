"use client";

import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import { addDays } from "date-fns";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FormSessaoApresentacoes() {
  const { formApresentacoesFields } = ModalSessaoMock;
  const [selectedDate, setSelectedDate] = useState<any>(null);

  const filterTimes = (time: Date) => {
    const hour = time.getHours();
    return hour < 12 && hour > 6;
  };

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
          <DatePicker
            id="inicio"
            showIcon
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            className="form-control"
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
