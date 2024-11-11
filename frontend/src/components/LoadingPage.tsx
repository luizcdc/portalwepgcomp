export default function Loading() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center m-5">
      <div className="spinner-border text-success" role="status"></div>
      <span className="text-success fw-bold fs-2">Carregando...</span>
    </div>
  );
}
