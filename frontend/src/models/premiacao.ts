// Component
export type PremiacaoCategoriaProps = {
    titulo: string;
    descricao: string;
    premiacoes: { titulo: string; subtitulo: string; nota: number }[];
};

// Template
interface PremiacaoItem {
    titulo: string;
    subtitulo: string;
    nota: number;
}

export interface PremiacaoListProps {
    titulo: string;
    descricao: string;
    premiacoes: PremiacaoItem[];
}