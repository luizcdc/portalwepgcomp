"use client";

import { FormContato } from "./Forms/Contato/FormContato";

export default function Contato() {
  return (
    <div className="d-flex flex-column align-items-start">
      <div className="container">
        <div className="fs-1 fw-bold text-white mb-3">Contato</div>
        <FormContato />
      </div>
    </div>
  );
}
