import Premiacao from "@/templates/Premiacao/Premiacao";

export default function PremiacaoCategoria({
  titulo,
  descricao,
  premiacoes,
}: PremiacaoCategoriaProps) {
  return (
    <Premiacao titulo={titulo} descricao={descricao} premiacoes={premiacoes} />
  );
}
