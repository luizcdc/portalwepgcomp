import Premiacao from "@/templates/Premiacao/Premiacao";

type PremiacaoCategoriaProps = {
    titulo: string;
    descricao: string;
    premiacoes: { titulo: string; subtitulo: string; nota: number }[];
};

export default function PremiacaoCategoria({ titulo, descricao, premiacoes }: PremiacaoCategoriaProps) {
    return (
        <Premiacao
            titulo={titulo}
            descricao={descricao}
            premiacoes={premiacoes}
        />
    );
}