"use client"

import Banner from "@/components/UI/Banner";
import Gerenciar from "@/components/GerenciarUsuario/Gerenciar"
import ModalAceitacaoAlteracaoUsuario from "@/components/Modals/ModalAceitacaoAlteracaoUsuario/ModalAceitacaoAlteracaoUsuario";

export default function Gerenciamento(){

    return(

        <div
        className="d-flex flex-column"
        style={{
            gap: "30px",
        }}>
            <Banner title="Gerenciamento de Usuários"/>
            <Gerenciar/>
        </div>
    );
}