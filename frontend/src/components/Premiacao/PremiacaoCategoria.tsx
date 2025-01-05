import Premiacao from "@/templates/Premiacao/Premiacao";

export default function PremiacaoCategoria({
  categoria,
  premiacoes,
  avaliadores
}: PremiacaoCategoriaProps) {
  return (
    <Premiacao categoria={categoria} premiacoes={premiacoes} avaliadores={avaliadores} />
  );
}
