"use client"

import { useEffect, useMemo } from "react";
import { useCommittee } from "@/hooks/useCommittee";
import "./style.scss";

/* interface OrganizacaoProps {
    coordenador: string,
    comissao: string[],
    ti: string[],
    comunicaco: string[],
    administracao: string[]
} */

export default function Organizacao(/*{props} : {props: OrganizacaoProps}*/) {
    const { getCommitterAll, committerList } = useCommittee();

    useEffect(() => {
        getCommitterAll();
    }, []);

    const coordenador = useMemo(() => {
        const coord = committerList.find(
            (member) => member.level === "Coordinator" && member.role === "OrganizingCommittee"
        );
        return coord ? coord.userName : " ";
    }, [committerList]);

    const groupedMembers = useMemo(() => {
        const groups: Record<string, string[]>  = {
            comissao: [],
            ti: [],
            comunicacao: [],
            administracao: [],
        };

        if (committerList.length === 0) return groups;

        committerList.forEach((member) => {
            // Exclui coordenador da lista de 'comissao'
            if (member.level === "Coordinator") return;

            switch (member.role) {
                case "OrganizingCommittee":
                    groups.comissao.push(member.userName);
                    break;
                case "ITSupport":
                    groups.ti.push(member.userName);
                    break;
                case "Communication":
                    groups.comunicacao.push(member.userName);
                    break;
                case "AdministativeSupport":
                    groups.administracao.push(member.userName);
                    break;
                default:
                    break;
            }
        });

        return groups;
    }, [committerList]);
    
    function formatTeam(team: string[]) {
        if (!Array.isArray(team)) {
            return ""; 
        }
    
        let stringTeam = '';
        if (team.length > 0) {
            team.forEach((item) => {
                stringTeam += item + ',';
            });
            stringTeam = stringTeam.slice(0, -1); 
        } else {
            return ""; 
        }     
       return stringTeam;
    }

    return (
        <div style={{width: "86%", margin: "0 auto", color: "black", padding: "30px 0"}}> 
            <h1 style={{fontSize: "50px",fontWeight: "700",lineHeight: "80px",textAlign: "center", color: "#054B75"}}>Organização</h1>
            <div style={{fontSize: "20px",fontWeight: "400",lineHeight: "30px",textAlign: "left"}}>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Coordenação geral:</span> {coordenador}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Comissão organizadora:</span> {formatTeam(groupedMembers.comissao)}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Apoio à TI:</span> {formatTeam(groupedMembers.ti)}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Comunicação:</span> {formatTeam(groupedMembers.comunicacao)}</p>
                <p><span style={{fontWeight: "700", color: "#F17F0C"}}>Apoio administrativo:</span> {formatTeam(groupedMembers.administracao)}</p>
            </div>
        </div>
    );
}