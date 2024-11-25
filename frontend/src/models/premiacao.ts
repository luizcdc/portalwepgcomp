/* eslint-disable @typescript-eslint/no-unused-vars */

// Component
type PremiacaoCategoriaProps = {
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

interface PremiacaoListProps {
    titulo: string;
    descricao: string;
    premiacoes: PremiacaoItem[];
}