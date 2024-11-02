"use client"

import PersonIcon from '@/assets/images/person_icon.svg'
import Image from 'next/image';

interface presentationData {
    titulo: string,
    doutorando: string,
    emailDoutorando: string,
    orientador: string,
    data: string,
    local: string,
    horario: string,
    descricao: string,
}

export default function PresentationModal({props} : {props: presentationData}) {
    return (
        <div style={{padding: "0 25px 25px 25px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start"}}>
            <div style={{display: "flex", alignItems:"center", gap: "15px", borderBottom: "1px solid #000000", paddingBottom: "15px", width: "100%"}}>
                    <Image
                        src={PersonIcon}
                        alt="PGCOMP Logo"
                        width={110}
                        height={110}
                        priority={true}
                    />
                    <h3 style={{fontSize: "18px",fontWeight: "600",lineHeight: "27px", textAlign: "left"}}>{props.titulo}</h3>
            </div>
            <div>
                <h4 style={{fontSize: "15px", fontWeight: "400", textAlign: "left"}}><strong>{props.doutorando}   | </strong>{props.emailDoutorando}</h4>
                <h4 style={{fontSize: "15px", fontWeight: "400", textAlign: "left"}}>Orientador(a): Prof. {props.orientador}</h4>
            </div>
            <div>
                <p style={{backgroundColor: "#F17F0C", color: "white", borderRadius: "5px", padding: "4px 10px", margin: "0px"}}>{props.data} - {props.local} - {props.horario}</p>
            </div>
            <p><strong>Descrição da pesquisa: </strong>{props.descricao}</p>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <button style={{border: "2px solid #FFA90F", borderRadius: "20px", color: "#FFA90F", padding: "3px 20px", backgroundColor: "white"}}>Acessar Apresentação</button>
            </div>
        </div>
    );
}