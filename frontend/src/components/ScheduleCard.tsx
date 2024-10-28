import Image from 'next/image'
import PersonIcon from '@/assets/images/person_icon.svg'

type ScheduleCardContent = {
    type: "apresentacao" | "outro";
    title: string;
    paragraph: string;
}

const ScheduleCardProps = {
    type:"outro",
    title:"",
    paragraph:"",
}

export default function ScheduleCard() {

    if (ScheduleCardProps.type == "apresentacao") {    
        return (
            <div className="card border border-warning">
                <div className="card-body d-flex flex-column align-items-center">
                    <h6><strong>Abertura (Autitório A)</strong></h6>
                    <p>Prof. Daniela Barreiro Claro (coordenadora do PGCOMP-UFBA)</p>
                </div>
            </div>
        )
    }  return (
        <div className="card border border-warning">
            <div className="card-body d-flex flex-row align-items-center gap-2">
                <div>
                    <Image
                        src={PersonIcon}
                        alt="PGCOMP Logo"
                        width={65}
                        height={65}
                    />
                </div>
                <div>
                    <h6><strong>Nome do(a) Apresentador(a)</strong></h6>
                    <p>Titulo da pesquisa</p>
                </div>
            </div>
        </div>
    )
};
