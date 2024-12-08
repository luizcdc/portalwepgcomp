"use client"

import {MockOrganizacao} from "../../mocks/Organizacao"
import "./style.scss";

/* interface OrganizacaoProps {
    coordenador: string,
    comissao: string[],
    ti: string[],
    comunicaco: string[],
    administracao: string[]
} */

export default function Organizacao(/*{props} : {props: OrganizacaoProps}*/) {
    function formatTeam(team: string[]) {
        let stringTeam = '';
        team.forEach((item) => {stringTeam+=item+','})
        stringTeam = stringTeam.slice(0, -1)
        return stringTeam;
    }

    return (
        <div className="organizacao-container"> 
            <h1 className="organizacao-titulo">Organização</h1>
            <div className="organizacao-conteudo">
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Coordenação geral:</span> {MockOrganizacao.coordenador}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Comissão organizadora:</span> {formatTeam(MockOrganizacao.comissao)}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Apoio à TI:</span> {formatTeam(MockOrganizacao.ti)}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Comunicação:</span> {formatTeam(MockOrganizacao.comunicaco)}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Apoio administrativo:</span> {formatTeam(MockOrganizacao.administracao)}</p>
            </div>
        </div>
    );
}