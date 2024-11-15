import Premiacao from "@/templates/Premiacao/Premiacao";

type PremiacaoCategoriaProps = {
    titulo: string;
    descricao: string;
    premiacoes: { titulo: string; medalha: 'gold' | 'silver' | 'bronze' }[];
    medalWidth: number;
    medalHeight: number;
};

export default function PremiacaoCategoria({ titulo, descricao, premiacoes, medalWidth, medalHeight }: PremiacaoCategoriaProps) {
    return (
        <Premiacao
            titulo={titulo}
            descricao={descricao}
            premiacoes={premiacoes}
            medalWidth={medalWidth}
            medalHeight={medalHeight}
        />
    );
}