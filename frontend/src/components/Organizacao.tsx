"use client"

import {MockOrganizacao} from "./../mocks/Organizacao"

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
        <div style={{width: "90%", margin: "0 auto", color: "black", padding: "30px 0"}}> 
            <h1 style={{fontSize: "50px",fontWeight: "700",lineHeight: "80px",textAlign: "center", color: "#054B75"}}>Organização</h1>
            <div style={{fontSize: "20px",fontWeight: "400",lineHeight: "30px",textAlign: "left"}}>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Coordenação geral:</span> {MockOrganizacao.coordenador}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Comissão organizadora:</span> {formatTeam(MockOrganizacao.comissao)}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Apoio à TI:</span> {formatTeam(MockOrganizacao.ti)}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Comunicação:</span> {formatTeam(MockOrganizacao.comunicaco)}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Apoio administrativo:</span> {formatTeam(MockOrganizacao.administracao)}</p>
            </div>
        </div>
    );
}