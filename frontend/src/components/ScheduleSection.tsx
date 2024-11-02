'use client'
import {Poppins} from "next/font/google"
import ScheduleCard from "./ScheduleCard"
import { useRef, useState } from "react"
import Calendar from "./UI/Calendar"
import Modal from "./UI/Modal"
import PresentationModal from "./PresentationModal"

const mockup = [
    {
        "type":"outro",
        "title":"Abertura (Autitório A)",
        "author" : "Prof. Daniela Barreiro Claro (coordenadora do PGCOMP-UFBA)"
    },
    {
        "type":"outro",
        "title":"Coffee break",
        "author" : ""
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"outro",
        "title":"Almoço",
        "author" : ""
    },
    {
        "type":"outro",
        "title":"Palestra - Nome",
        "author" : "Prof. Fred Durão"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
]

const mockupb = [
    {
        "type":"outro",
        "title":"Abertura (Autitório A)",
        "author" : "Prof. Daniela Barreiro Claro (coordenadora do PGCOMP-UFBA)"
    },
    {
        "type":"outro",
        "title":"Coffee break",
        "author" : ""
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa B",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa B",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"outro",
        "title":"Almoço",
        "author" : ""
    },
    {
        "type":"outro",
        "title":"Palestra - Nome",
        "author" : "Prof. Fred Durão"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
]

const mockupc = [
    {
        "type":"outro",
        "title":"Abertura (Autitório A)",
        "author" : "Prof. Daniela Barreiro Claro (coordenadora do PGCOMP-UFBA)"
    },
    {
        "type":"outro",
        "title":"Coffee break",
        "author" : ""
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa C",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa C",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"outro",
        "title":"Almoço",
        "author" : ""
    },
    {
        "type":"outro",
        "title":"Palestra - Nome",
        "author" : "Prof. Fred Durão"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
    {
        "type":"apresentacao",
        "title":"Titulo da pesquisa",
        "author" : "Nome do(a) Apresentador(a)"
    },
]

const mockupPresentention =
    {
        "titulo": "Titulo da Apresentação",
        "doutorando": "Maria de Jesus",
        "emailDoutorando": "mariadejesus@ufba.br",
        "orientador": "Dr. João da Silva",
        "data": "11/11",
        "local": "Sala A ",
        "horario": "14:30",
        "descricao": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vestibulum justo vitae eros efficitur, sit amet tristique lacus accumsan. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean vitae lacus sit amet ligula vehicula congue nec nec nisl. Proin vel eros nec lacus consequat cursus. Integer efficitur ipsum in enim fermentum fermentum. Nulla volutpat consectetur ante, at convallis sapien auctor et. Duis auctor est sed massa posuere, at scelerisque ipsum porttitor.",
    }

const mockup2 = [mockup, mockupb, mockupc]

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

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});


export default function ScheduleSection() {
    const [date, setDate] = useState<number>(0)
    const [schedule, setSchedule] = useState<[]>()
    const openModal = useRef<HTMLButtonElement | null>(null);
    const [modalContent, setModalContent] = useState<presentationData>(mockupPresentention);

    function changeDate(date: number) {
        setDate(date);
    }

    function openModalPresentation(item) {
        setModalContent({ ...modalContent, doutorando: item.author });
        openModal.current?.click()
    }

    

   return (
        <div style={{fontFamily:poppins.style.fontFamily, width: "80vw", margin: "0 auto", padding: "20px 0 50px 0", borderBottom: '1px solid #000000'}}>
            <div style={{display: "flex", flexDirection: "column", width: "100%", gap: "15px"}}>
                <h1 style={{fontSize: "50px", fontWeight: "700", lineHeight: "50px", textAlign: "center", color: "#054B75", marginBottom: '40px'}}>Programação</h1>
                <div style={{display: "flex", gap: "30px", justifyContent: "center"}}>
                    <button style={{fontSize: "16px",fontWeight: "700",lineHeight: '30px',textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: date == 0 ? "#FFA90F" :"white",color: date == 0 ? "white" :"#FFA90F", padding: '10px 25px', borderRadius: '25px', border: date == 0 ? "3px solid #FFA90F" :"3px solid #FFA90F"}} onClick={() => changeDate(0)}>
                        <Calendar color={date == 0 ? "white" :"#FFA90F"}/>
                        12 de novembro
                    </button>
                    <button style={{fontSize: "16px",fontWeight: "700",lineHeight: '30px',textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: date == 1 ? "#FFA90F" :"white",color: date == 1 ? "white" :"#FFA90F", padding: '10px 25px', borderRadius: '25px', border: date == 1 ? "3px solid #FFA90F" :"3px solid #FFA90F"}} onClick={() => changeDate(1)}>
                        <Calendar color={date == 1 ? "white" :"#FFA90F"}/>
                        13 de novembro
                    </button>
                    <button style={{fontSize: "16px",fontWeight: "700",lineHeight: '30px',textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: date == 2 ? "#FFA90F" :"white",color: date == 2 ? "white" :"#FFA90F", padding: '10px 25px', borderRadius: '25px', border: date == 2 ? "3px solid #FFA90F" :"3px solid #FFA90F"}} onClick={() => changeDate(2)}>
                        <Calendar color={date == 2 ? "white" :"#FFA90F"}/>
                        14 de novembro
                    </button>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "40px", width: "100%"}}>
                    <p style={{margin: '0', width: '44px'}}></p>
                    <div style={{backgroundColor: '#0065A3', borderRadius: '10px', width: "89.26%", margin: '0 auto', border: "1px solid #0065A3"}}>
                        <p style={{color: 'white', fontSize: '13px', fontWeight: '700',lineHeight: '50px', margin: '0', textAlign: "center"}}>SALA A</p>
                    </div>
                    <p style={{margin: '0', width: '44px'}}></p>
                </div>
                
                <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {mockup2[date].map((item, index) => {
                        return (
                            <div key={index + item.author} style={{display: "flex", alignItems: "center", gap: "40px", width: "100%"}} >
                                <p style={{margin: '0', width: '44px'}}>09:00</p>
                                <ScheduleCard type={item.type} author={item.author} title={item.title} onClickEvent={() => openModalPresentation(item) } />
                                <div style={{margin: '0', width: '44px'}}></div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Modal content={<PresentationModal
                props={modalContent}
            />} reference={openModal}  />
        </div>
    )
};
