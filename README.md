# Sistema para divulgação, organização e gerenciamento do WEPGCOMP, evento anual de workshops dos alunos do PGCOMP-UFBA

## Descrição

Este projeto é desenvolvido como parte da disciplina **IC045/MATE85 - Tópicos em Sistemas de Informação e Web**, com o objetivo de criar o portal do **Workshop de Estudantes de Pós-Graduação em Computação (WEPGCOMP)**. O sistema permite a gestão de eventos acadêmicos, incluindo o cadastro de participantes, avaliação de apresentações, emissão de certificados, e organização de sessões.

## Tecnologias Utilizadas

- **Back-end**: NodeJS com NestJS:^10.0.0
- **Front-end**: React:^18 e Next:14.2.15
- **Banco de Dados**: PostgreSQL:17.2
- **Mensageria**: RabbitMQ:4.0
- **IaC**: Docker
- **Cloud**: Vercel/AWS

## Metodologia de Desenvolvimento

A equipe está utilizando a metodologia **Kanban** com o auxílio da plataforma **Notion** para gerenciar as tarefas e acompanhar o progresso. O projeto segue um cronograma de entregas semanais.

- Link para o Notion: <a href="https://www.notion.so/119c125c059980578b0eed38349acd82?v=119c125c059980bf8e95000c9a20dde6" target="_blank">Notion Board</a>

## Requisitos do Sistema

Os requisitos completos do sistema estão documentados no link abaixo:

- Link para os Requisitos: <a href="https://docs.google.com/document/d/199d8fJW4-9MX11Lvd4mdy-Vo0Pyx4ZHa53IuHKbWSn0/edit" target="_blank">Requisitos do Sistema</a>

## Arquitetura

- Diagrama de classe: <a href="https://drive.google.com/file/d/1yvpeU6gOZpoEaSvrlkwTapG1A-reHNgG/view" target="_blank">Banco</a>
- Arquitetura do sistema: <a href="https://drive.google.com/file/d/10DCdoz47Gm00mArdla0npXITgNYR1KtJ/view" target="_blank">Arquitetura</a>

## Protótipo

O protótipo do sistema está sendo desenvolvido no **Figma**, onde todas as telas e fluxos do usuário estão disponíveis para visualização e feedback.

- Link para o Figma: <a href="https://www.figma.com/design/02Aslfd2qo4q6pjYxSkoYS/Portal-Web-PGCOMP-team-library?node-id=2365-175&node-type=canvas&t=NHVtl7ASVgSDVt2j-0" target="_blank">Figma Design</a>

## Requisitos do Software

De modo a facilitar o desenvolvimento e implantação do software, o projeto acompanha o arquivo docker-compose.yml para instalação da aplicação em ambiente de desenvolvimento e de produção. Com o Docker não é necessário a instalação on-demand das tecnologias em #Tecnologias Utilizadas.

Para executar os arquivos docker-compose.yml é necessário a instalação do docker como dependência em <https://docs.docker.com/get-started/>.

## Como Executar o Projeto

<!-- Para obter instruções detalhadas sobre a instalação do projeto, consulte o documento [Documento de Implantação/Instalação WEPGCOMP](https://docs.google.com/document/d/1K5SnhxKYCfnvJq_T8P_5-zqXeQSpqMXPh2FfLYe_G0Y). Os passos resumidos para execução local estão descritos abaixo. --->

1. **Clone o Repositório**:

   ```bash
   git clone https://github.com/luizcdc/portalwepgcomp
   cd portalwepgcomp
   ```

2. **Configure as variáveis de ambiente**:

   1. ```cp backend/.env.example backend/.env```
   2. ```cp frontend/.env.example frontend/.env```
   3. Ajuste as configurações da sua conta da AWS.

   Obs.: As variáveis com dados sensíveis estarão sem valor atribuído, e deverão ser consultadas na documentação via Notion.

3. **Execute os Containers**:

   ```docker compose up```

4. **Popule o banco de dados**:

   Sempre que estiver subindo o banco de dados pela primeira vez, popule o banco com o seguinte script abaixo. PS: é preciso que os contêineres do docker estejam em execução.

   ```docker compose exec backend npm run seed```

## Testes Locais

Para verificar se o sistema foi configurado corretamente, execute os seguintes comandos:

- **Backend**:
  - ```docker compose exec backend npm run test```
- **Frontend**:
  - ```docker compose exec frontend npm run test```

## Solução de Problemas

1. **Matar os containers e buildar a aplicação novamente**:
   1. ```docker compose down –volumes```
   2. ```docker compose up –build```
2. **Resetar os Migrations**:
   1. ```sudo rm -rf backend/prisma/migrations/*```
   2. Então mate os containers e build a aplicação novamente
3. **Erro ao conectar ao banco de dados**:
   1. Verifique se o PostgreSQL está em execução e se as credenciais no arquivo .env estão corretas.
4. **Erro ao iniciar o servidor**:
   1. Verifique as mensagens de erro no console e garanta que todas as variáveis de ambiente estão configuradas corretamente.
5. **Problemas com migrações do Prisma**:
   1. Execute ```docker compose exec backend npx prisma migrate reset``` para resetar o estado do banco de dados e aplicar as migrações novamente (atenção: isso apaga os dados do banco).

## Ambientes

- **Frontend**
- Produção: <https://portal-wepgcomp-client.vercel.app>
- Desenvolvimento: <https://portal-wepgcomp-client-development.vercel.app>

- **Backend**
- Produção: <https://portal-wepgcomp-api.vercel.app>
- Swagger produção: <https://portal-wepgcomp-api.vercel.app/docs>
- Desenvolvimento: <https://portal-wepgcomp-api-development.vercel.app>
- Swagger desenvolvimento: <https://portal-wepgcomp-api-development.vercel.app/docs>

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
