## Instalação

Instalação dos pacotes:

```bash
npm install
```

Para rodar o servidor de desenvolvimento:

```bash
npm run dev
```

Vai abrir [http://localhost:3000](http://localhost:3000) no seu browser para acessar a aplicação.

## Qualidade

Utilizamos Jest para execução dos testes unitários, para rodar basta executar os comandos:

```bash
npm run test
// or
npm run tes:watch
```

O ESLint é utilizado para que possamos manter um padrão de desenvolvimento na escrita do código fonte, para obter um relatório basta executar:

```bash
npm run lint
```

## Estrutura de pastas

|- _-_tests__ - Onde se encontram os testes unitários do projeto
|- src - Pasta central do projeto, onde o código fonte principal é desenvolvido
|-----|- app - Configurações globais de exibição e roteamento das páginas
|-----|- components - Componentes genéricos e específicos utilizados pelas páginas
|-----|- pages - Páginas do projeto

## Configurações

**packacge.json** - Dependências do projeto
**jest.config.ts** - Teste unitário
**tsconfig.json** - Compilação do JSON
**next.config.mjs.ts** - Next
**sonar-project.properties** - Sonar

## Variáveis de ambiente

Devem ser inseridas igualmente nas variáveis de produção (**.env.production**), desenvolvimento (**.env.developmentß**) e local(**.env.local**).

## Ambientes da aplicação

PRODUÇÃO - https://portal-wepgcomp-client.vercel.app
DESENVOLVIMENTO - https://portal-wepgcomp-client-development.vercel.app