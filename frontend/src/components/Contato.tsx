"use client";

export default function Contato() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        gap: "20px",
        color: "white"
      }}
    >
      <div className='fs-1 fw-bold text-left text-white'>Contato</div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        <div>
          <label className='form-label fs-6 fw-semibold text-white'>
            Nome:
          </label>
          <input
            type='nome'
            className='form-control'
            id='name'
            placeholder='Insira seu nome'
            style={{
              width: "300px",
              height: "40px",
              borderWidth: "1px",
              borderColor: "white",
              backgroundColor: "#0074BA",
            }}
          />
        </div>

        <div>
          <label className='form-label fs-6 fw-semibold text-white'>
            E-mail:
          </label>
          <input
            type='email'
            className='form-control'
            id='email'
            placeholder='Insira seu e-mail'
            style={{
              width: "300px",
              height: "40px",
              borderWidth: "1px",
              borderColor: "white",
              backgroundColor: "#0074BA",
            }}
          />
        </div>
      </div>

      <div>
        <label className='form-label fs-6 fw-semibold text-white'>
          Mensagem:
        </label>
        <input
          type='text'
          className='form-control'
          id='message'
          placeholder='Digite sua mensagem'
          style={{
            width: "620px",
            height: "137px",
            borderWidth: "1px",
            borderColor: "white",
            backgroundColor: "#0074BA",
          }}
        />
      </div>

      <div
        style={{
          border: "solid",
          backgroundColor: "white",
          color: "#054B75",
          borderColor: "white",
          borderRadius: "8px",
          width: "620px",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Entrar
      </div>
    </div>
  );
}
