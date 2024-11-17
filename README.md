# Sistema para divulgação, organização e gerenciamento do WEPGCOMP, evento anual de workshops dos alunos do PGCOMP-UFBA.

## Descrição
Este projeto é desenvolvido como parte da disciplina **IC045/MATE85 - Tópicos em Sistemas de Informação e Web**, com o objetivo de criar o portal do **Workshop de Estudantes de Pós-Graduação em Computação (WEPGCOMP)**. O sistema permite a gestão de eventos acadêmicos, incluindo o cadastro de participantes, avaliação de apresentações, emissão de certificados, e organização de sessões.

## Tecnologias Utilizadas
- **Back-end**: NodeJS com Express
- **Front-end**: React/Next
- **Banco de Dados**: PostgreSQL
- **Cloud**: Vercel

## Metodologia de Desenvolvimento
A equipe está utilizando a metodologia **Kanban** com o auxílio da plataforma **Notion** para gerenciar as tarefas e acompanhar o progresso. O projeto segue um cronograma de entregas semanais.

- Link para o Notion: <a href="https://www.notion.so/119c125c059980578b0eed38349acd82?v=119c125c059980bf8e95000c9a20dde6" target="_blank">Notion Board</a>

## Requisitos do Sistema
Os requisitos completos do sistema estão documentados no link abaixo:

- Link para os Requisitos: <a href="https://docs.google.com/document/d/199d8fJW4-9MX11Lvd4mdy-Vo0Pyx4ZHa53IuHKbWSn0/edit" target="_blank">Requisitos do Sistema</a>

## Arquitetura
- Diagrama de classe: <a href="https://cdn.discordapp.com/attachments/1293365993137115136/1296668731837120514/DER-WEPGCOMP.drawio.png?ex=6717bd9c&is=67166c1c&hm=9f53e124314a9a84b6f20d8cc89607a0221fe3bfc9968fb3381e2910bb5d6ca5&" target="_blank">Banco</a>
- Arquitetura do sistema: <a href="https://drive.google.com/file/d/10DCdoz47Gm00mArdla0npXITgNYR1KtJ/view" target="_blank">Arquitetura</a>

## Protótipo
O protótipo do sistema está sendo desenvolvido no **Figma**, onde todas as telas e fluxos do usuário estão disponíveis para visualização e feedback.

- Link para o Figma: <a href="https://www.figma.com/design/02Aslfd2qo4q6pjYxSkoYS/Portal-Web-PGCOMP-team-library?node-id=2365-175&node-type=canvas&t=NHVtl7ASVgSDVt2j-0" target="_blank">Figma Design</a>


## Como Executar o Projeto (Exemplo)

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/usuario/projeto-wepgcomp.git
   cd projeto-wepgcomp
   ```
2. **Instalar Dependências**:
   ```bash
   npm install
   ```
3. **Executar o Back-end**:
   ```bash
   cd backend
   cp .env.example .env
   npm run start
   ```

   Obs.: As variáveis de ambiente com dados sensíveis estarão sem valor atribuído, e deverão ser consultadas na documentação via Notion.
4. **Executar o Front-end**:
   ```bash
   npm run start-frontend
   ```
5. O projeto será hospedado na **Vercel** para deploy contínuo e fácil acesso.

## Colaboradores

- **Alexandre Cury Lima** - [alexandre.cury@ufba.br](mailto:alexandre.cury@ufba.br)
- **Álvaro Souza Olivera** - [alvaro.oliveira@ufba.br](mailto:alvaro.oliveira@ufba.br)
- **Antonio de Sousa Cruz Neto** - [antoniocruznb@gmail.com](mailto:antoniocruznb@gmail.com)
- **Caio Nery Matos Santos** - [caionms@ufba.br](mailto:caionms@ufba.br)
- **Ernesto Santana dos Reis Filho** - [ernestosrf98@gmail.com](mailto:ernestosrf98@gmail.com)
- **Felipe Rezende** - [felipe.rezende@ufba.br](mailto:felipe.rezende@ufba.br)
- **Gabriel Borges Calheiros** - [gabrielcalheiros@ufba.br](mailto:gabrielcalheiros@ufba.br)
- **Henrique Torres Hatakeyama** - [henrique.torres@ufba.br](mailto:henrique.torres@ufba.br)
- **Iuri Rodrigues Santos** - [iurirs@ufba.br](mailto:iurirs@ufba.br)
- **Juliana Gomes Ribeiro** - [julianacrispina@gmail.com](mailto:julianacrispina@gmail.com)
- **Luiz Cláudio Dantas Cavalcanti** - [luizdantas.cavalcanti@gmail.com](mailto:luizdantas.cavalcanti@gmail.com)
- **Márcio dos Santos Junior** - [santosmarcio@ufba.br](mailto:santosmarcio@ufba.br)
- **Marcos Vinícius Queiroz** - [kieroth29@gmail.com](mailto:kieroth29@gmail.com)
- **Paloma Batista Calmon de Passos** - [palomabcp06@gmail.com](mailto:palomabcp06@gmail.com)
- **Silas Nunes** - [silasnunes105@gmail.com](mailto:silasnunes105@gmail.com)
- **Thiago Luiz Antunes Seixas** - [thiago.seixas@ufba.br](mailto:thiago.seixas@ufba.br)

## Licença
Este projeto está licenciado sob a [Licença MIT](LICENSE).
