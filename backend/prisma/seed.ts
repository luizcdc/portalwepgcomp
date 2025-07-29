import {
  CommitteeLevel,
  CommitteeRole,
  PresentationBlockType,
  PresentationStatus,
  PrismaClient,
  Profile,
  SubmissionStatus,
  UserLevel,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function createEmailByName(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .slice(0, 2)
    .join('.');
}

async function main() {
  console.log('Seeding 2024 Edition...');

  const edition2024 = await prisma.eventEdition.create({
    data: {
      name: 'WEPGCOMP 2024',
      description:
        'Um evento para estudantes de doutorado apresentarem suas pesquisas.',
      callForPapersText: 'Envie seus artigos para avaliação e apresentação.',
      partnersText: '<b>Apoiado por:</b><br>Instituto Qualquercoisa',
      location: 'UFBA, Salvador, Bahia, Brasil',
      startDate: new Date('2024-11-12'),
      endDate: new Date('2024-11-15'), //
      submissionStartDate: new Date('2024-01-01'),
      submissionDeadline: new Date('2024-11-08'),
      isActive: true,
      isEvaluationRestrictToLoggedUsers: true,
      presentationDuration: 20,
      presentationsPerPresentationBlock: 6,
    },
  });

  const rooms = await prisma.room.createManyAndReturn({
    data: [
      {
        eventEditionId: edition2024.id,
        name: 'Sala A',
        description: 'Sala A',
      },
      {
        eventEditionId: edition2024.id,
        name: 'Sala B',
        description: 'Sala B',
      },
    ],
  });

  const comiteeMembers = [
    {
      name: 'Bruno Pereira dos Santos',
      email: 'bruno.pereira@ufba.br',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Superadmin,
      isVerified: true,
    },
    {
      name: 'Rafael Augusto de Melo',
      email: 'rafael.melo@ufba.br',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Superadmin,
      isVerified: true,
    },
    {
      name: 'Robespierre Dantas da Rocha Pita',
      email: 'robespierre.dantas@ufba.br',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Superadmin,
      isVerified: true,
    },
    {
      name: 'Rodrigo Rocha Gomes e Souza',
      email: 'rodrigo.rocha@ufba.br',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Superadmin,
      isVerified: true,
    },
    {
      name: 'Bianco Oliveira',
      email: 'bianco.oliveira@ufba.br',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Admin,
      isVerified: true,
    },
    {
      name: 'Bruno Morais',
      email: 'bruno.morais@ufba.br',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Admin,
      isVerified: true,
    },
  ];

  const comiteeUsers = await prisma.userAccount.createManyAndReturn({
    data: comiteeMembers.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    })),
  });

  const committeeMembersData = comiteeUsers.map((user, index) => ({
    eventEditionId: edition2024.id,
    userId: user.id,
    level: index < 4 ? CommitteeLevel.Coordinator : CommitteeLevel.Committee,
    role:
      index < 4 ? CommitteeRole.OrganizingCommittee : CommitteeRole.ITSupport,
  }));

  await prisma.committeeMember.createMany({
    data: committeeMembersData,
  });

  const professors = [
    'Antonio Lopes Apolinario Junior', //4
    'Manoel Gomes de Mendonça Neto', //5
    'Eduardo Santana de Almeida', //6
    'Marcos Ennes Barreto', //7
    'Rita Suzana Pitangueira Maciel', //8
    'Laís do Nascimento Salvador', //9
    'Ivan do Carmo Machado', //10
    'Daniela Barreiro Claro', //11
    'Gustavo Bittencourt Figueiredo', //12
    'Frederico Araújo Durão', //13
    'Leobino Nascimento Sampaio', //14
    'Vaninha Vieira dos Santos', //15
    'Cássio Vinicius Serafim Prazeres', //16
    'Maycon Leone Maciel Peixoto', //17
    'Christina Von Flach Garcia Chavez', //18
    'Ricardo Araújo Rios', //19
    'George Marconi de Araújo Lima', //20
    'Ecivaldo de Souza Matos', //21
    'Gecynalda Soares da Silva Gomes', //22
  ].map((name) => {
    const emailName = createEmailByName(name);
    return {
      name,
      email: `${emailName}@ufba.br`,
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Default,
      isVerified: true,
    };
  });

  await prisma.userAccount.createMany({
    data: professors.map((professor) => ({
      ...professor,
      password: bcrypt.hashSync(professor.password, 10),
    })),
  });

  const professorUsers = await prisma.userAccount.findMany({
    where: {
      profile: Profile.Professor,
    },
  });

  const panelistsAndPresentations = await [
    {
      name: 'Rafaela Souza Alcântara',
      presentation:
        'Redução de Artefatos Metálicos em Tomografias Odontológicas Utilizando Processamento Espectral',
      professor: 'Antonio Lopes Apolinario Junior',
      advisorId: professorUsers[4].id,
      topic: 'CA: Computação Visual (CVIS)',
    },
    {
      name: 'Carlos Frederico Jansen Muakad',
      presentation:
        'Catalogação de fontes de literatura cinza em engenharia de software',
      professor: 'Manoel Gomes de Mendonça Neto',
      advisorId: professorUsers[5].id,
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Lucas Amparo Barbosa',
      presentation: '',
      professor: 'Antonio Lopes Apolinario Junior',
      advisorId: professorUsers[4].id,
      topic: 'CA: Computação Visual (CVIS)',
    },
    {
      name: 'Roselane Silva Farias',
      presentation:
        'The Neuroscience of Testing: Enhancing Quality Assurance Through Cognitive Insights',
      professor: 'Eduardo Santana de Almeida',
      advisorId: professorUsers[6].id,
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Tiago Fernandes Machado',
      presentation:
        'Análise de classificação multi-label nos desfechos da doença falciforme',
      professor: 'Marcos Ennes Barreto',
      advisorId: professorUsers[7].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Jenifer Vieira Toledo Tavares',
      presentation:
        'A Guide to Evaluating and Customizing Software Development Processes Using Hybrid Methods Based on Scrum',
      professor: 'Rita Suzana Pitangueira Maciel',
      advisorId: professorUsers[8].id,
      topic: 'ESS: Evolução de Software',
    },
    {
      name: 'João Alberto Castelo Branco Oliveira',
      presentation:
        'Enhancing Explainable Recommender Systems through Automated Ontology Population and Data Provenance Assurance',
      professor: 'Laís do Nascimento Salvador',
      advisorId: professorUsers[9].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Joselito Mota Júnior',
      presentation:
        'A comprehensive study of issue labeling in GitHub repositories',
      professor: 'Ivan do Carmo Machado',
      advisorId: professorUsers[10].id,
      topic: 'ESS: Medição, Mineração e Visualização de Software',
    },
    {
      name: 'Larrissa Dantas Xavier da Silva',
      presentation: '',
      professor: 'Daniela Barreiro Claro',
      advisorId: professorUsers[11].id,
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Eonassis Oliveira Santos',
      presentation:
        'Cascading-Failure Disaster Recovery based on Time Varying Graph in EONs',
      professor: 'Gustavo Bittencourt Figueiredo',
      advisorId: professorUsers[12].id,
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Diego Correa da Silva',
      presentation:
        'Exploiting Calibration as a Multi-Objective Recommender System',
      professor: 'Frederico Araújo Durão',
      advisorId: professorUsers[13].id,
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Andre Luiz Romano Madureira',
      presentation: 'Otimizando Comunicações NDN  em redes MANET',
      professor: 'Leobino Nascimento Sampaio',
      advisorId: professorUsers[14].id,
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Maria Clara Pestana Sartori',
      presentation:
        'United for humanity: developing a collaborative model based on crowdsourcing to engage volunteers in crisis recovery campaigns',
      professor: 'Vaninha Vieira dos Santos',
      advisorId: professorUsers[15].id,
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Adriana Viriato Ribeiro',
      presentation:
        'Serviços de Saúde Avançados: Conectividade e Segurança em Sistemas de Vida Assistida',
      professor: 'Leobino Nascimento Sampaio',
      advisorId: professorUsers[14].id,
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'George Pacheco Pinto',
      presentation: 'FoT-PDS: Towards Data Privacy in a Fog of Things',
      professor: 'Cássio Vinicius Serafim Prazeres',
      advisorId: professorUsers[16].id,
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Lidiany Cerqueira Santos',
      presentation:
        'Exploring Empathy in Software Engineering Based on the Practitioners’ Perspective',
      professor: 'Manoel Gomes de Mendonça Neto',
      advisorId: professorUsers[5].id,
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Beatriz Silva de Santana',
      presentation:
        'Modelo de recomendações para melhoria da segurança psicológica no desenvolvimento de software',
      professor: 'Manoel Gomes de Mendonça Neto',
      advisorId: professorUsers[5].id,
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Elivelton Oliveira Rangel',
      presentation:
        'A Data-Driven Approach to Assess Emergency Response in Urban Areas based on Historical Ambulance Calls',
      professor: 'Maycon Leone Maciel Peixoto',
      advisorId: professorUsers[17].id,
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Ricardo Eugênio Porto Vieira',
      presentation:
        'Perceived Diversity in Software Engineering:  An Update and Extended Systematic Literature Review',
      professor: 'Manoel Gomes de Mendonça Neto',
      advisorId: professorUsers[5].id,
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Marcos Vinicius Bião Cerqueira',
      presentation:
        'Sistema de recomendação de recursos educacionais baseados em competência',
      professor: 'Laís do Nascimento Salvador',
      advisorId: professorUsers[9].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Cleberton Carvalho Soares',
      presentation:
        'Maturity level of software systems to comply with the General  Data Protection Law (LGPD)',
      professor: 'Rita Suzana Pitangueira Maciel',
      advisorId: professorUsers[8].id,
      topic: 'ESS: Qualidade de Software',
    },
    {
      name: 'Alexsandre Emanoel Gonçalves',
      presentation:
        'Mecanismos para Offloading de Dados em Redes 5G Heterogêneas',
      professor: 'Gustavo Bittencourt Figueiredo',
      advisorId: professorUsers[12].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Tássio Guerreiro Antunes Virgínio',
      presentation:
        'Dispersion of Test Smells in mobile projects using the Flutter framework',
      professor: 'Ivan do Carmo Machado',
      advisorId: professorUsers[10].id,
      topic: 'ESS: Qualidade de Software',
    },
    {
      name: 'Mirlei Moura da Silva',
      presentation:
        'Mixed Data Mining: a study focused on numerical and time series data.',
      professor: 'Robespierre Dantas da Rocha Pita',
      advisorId: professorUsers[2].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Beatriz Brito do Rêgo',
      presentation:
        'Formação de Profissionais de Computação para Ciência Aberta',
      professor: 'Christina Von Flach Garcia Chavez',
      advisorId: professorUsers[18].id,
      topic: 'ESS: Educação em Engenharia de Software.',
    },
    {
      name: 'Leandro Santos da Cruz',
      presentation:
        'Um Framework para Implementação Eficaz do Ensino Baseado em Competências no Ensino Superior de Computação.',
      professor: 'Laís do Nascimento Salvador',
      advisorId: professorUsers[9].id,
      topic: '',
    },
    {
      name: 'Railana Santana Lago',
      presentation: 'Towards Automated Refactoring of Smelly Test Code',
      professor: 'Ivan do Carmo Machado',
      advisorId: professorUsers[10].id,
      topic: 'ESS: Qualidade de Software',
    },
    {
      name: 'Brenno de Mello Alencar',
      presentation:
        'Concept Drift on Delayed Partially Labeled Data Streamslmente rotulados',
      professor: 'Ricardo Araújo Rios',
      advisorId: professorUsers[19].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Mateus Carvalho da Silva',
      presentation:
        'Abordagens de programação inteira mista para consolidação de frete com frota heterogênea terceirizada, frete morto e custos de múltiplas entrega',
      professor: 'Rafael Augusto de Melo',
      advisorId: professorUsers[1].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Mayka de Souza Lima',
      presentation:
        'A Conceptual Framework for the Design of Virtual Learning Environments',
      professor: 'Rita Suzana Pitangueira Maciel',
      advisorId: professorUsers[8].id,
      topic: 'ESS: Educação em Engenharia de Software.',
    },
    {
      name: 'Marcos Vinícois dos Santos Ferreira',
      presentation: 'Fuzzifying Chaos in Dynamical Systems',
      professor: 'Ricardo Araújo Rios',
      advisorId: professorUsers[19].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Antonio Carlos Marcelino de Paula',
      presentation:
        'Burnout in Software Projects: An Analysis of Stack Exchange Discussions',
      professor: 'Manoel Gomes de Mendonca Neto',
      advisorId: professorUsers[5].id,
      topic: 'ESS: Engenharia de Software Experimental',
    },
    {
      name: 'Allan Sérgio Gonçalves Alves',
      presentation: '',
      professor: 'George Marconi de Araújo Lima',
      advisorId: professorUsers[20].id,
      topic: 'SC: Sistemas Embarcados e de Tempo Real (SETR)',
    },
    {
      name: 'Edeyson Andrade Gomes',
      presentation:
        'Uma abordagem baseada em ontologia para auxiliar a aplicação de princípios curriculares orientados a competências em recursos educacionais abertos.',
      professor: 'Laís do Nascimento Salvador',
      advisorId: professorUsers[9].id,
      topic:
        'CA: Interação Humano-Computador (IHC) e Informática e Educação (IEDU)',
    },
    {
      name: 'Jamile de Barros Vasconcelos',
      presentation:
        'Avaliação segura de amostras em análise temporal baseada em medições para projetos de sistemas de tempo real',
      professor: 'George Marconi de Araújo Lima',
      advisorId: professorUsers[20].id,
      topic: 'SC: Sistemas Embarcados e de Tempo Real (SETR)',
    },
    {
      name: 'Moara Sousa Brito Lessa',
      presentation:
        'Aplicação da aprendizagem baseada em projetos no ensino de ES: uma investigação no contexto da educação baseada em competências',
      professor: 'Laís do Nascimento Salvador',
      advisorId: professorUsers[9].id,
      topic:
        'CA: Interação Humano-Computador (IHC) e Informática e Educação (IEDU)',
    },
    {
      name: 'Tadeu Nogueira Costa de Andrade',
      presentation:
        'Métodos estatísticos e de inteligência computacional para análise temporal em sistemas de tempo real',
      professor: 'George Marconi de Araújo Lima',
      advisorId: professorUsers[20].id,
      topic: 'SC: Sistemas Embarcados e de Tempo Real (SETR)',
    },
    {
      name: 'Diego Zabot',
      presentation:
        'Stimulating the development of Computational Reasoning by game design strategies',
      professor: 'Ecivaldo de Souza Matos',
      advisorId: professorUsers[21].id,
      topic:
        'CA: Interação Humano-Computador (IHC) e Informática e Educação (IEDU)',
    },
    {
      name: 'Claudio Junior Nascimento da Silva',
      presentation:
        'TinyFED - Integrating Federated Learning into resource-constrained devices',
      professor: 'Cássio Vinicius Serafim Prazeres',
      advisorId: professorUsers[16].id,
      topic: 'SC: Sistemas Distribuídos (SD)',
    },
    {
      name: 'Ailton Santos Ribeiro',
      presentation:
        'Rumo a Avatares Inclusivos: Um Estudo sobre a Autorrepresentação em Ambientes Virtuais',
      professor: 'Vaninha Vieira dos Santos',
      advisorId: professorUsers[15].id,
      topic:
        'CA: Interação Humano-Computador (IHC) e Informática e Educação (IEDU)',
    },
    {
      name: 'Nilson Rodrigues Sousa',
      presentation:
        'Integrated Architecture for IoT Device Management in Smart Cities',
      professor: 'Cássio Vinicius Serafim Prazeres',
      advisorId: professorUsers[16].id,
      topic: 'SC: Sistemas Distribuídos (SD)',
    },
    {
      name: 'Edmilson dos Santos de Jesus',
      presentation:
        'modelo baseado em agentes para previsão da demanda de água em regiões metropolitanas',
      professor: 'Gecynalda Soares da Silva Gomes',
      advisorId: professorUsers[22].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Guilherme Braga Araujo',
      presentation:
        'Escalabilidade e Segurança para Serviços e Aplicações em Computação de Borda Veicular Através de Redes de Dados Nomeados',
      professor: 'Leobino Nascimento Sampaio',
      advisorId: professorUsers[14].id,
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Bruno Souza Cabral',
      presentation:
        'ANALYSIS OF GENERATIVE AND SEQUENCE LABELING METHODS FOR PORTUGUESE OPEN INFORMATION  EXTRACTION',
      professor: 'Daniela Barreiro Claro',
      advisorId: professorUsers[11].id,
      topic: 'CA: Inteligência Computacional e Otimização (ICOT)',
    },
    {
      name: 'Antonio Mateus de Sousa',
      presentation:
        'ToID: Reputação Baseada em Identificadores Descentralizados Para Aplicações Distribuídas',
      professor: 'Leobino Nascimento Sampaio',
      advisorId: professorUsers[14].id,
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Nacles Bernardino Pirajá Gomes',
      presentation:
        'Multi-MyIntegration: framework para Integração Segura de Dados Heterogêneos com GCS e Blockchain',
      professor: 'Laís do Nascimento Salvador',
      advisorId: professorUsers[9].id,
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
    {
      name: 'Antônio Cleber de Sousa Araújo',
      presentation: 'Arquitetura Adaptável na Camada de Enlace',
      professor: 'Leobino Nascimento Sampaio',
      advisorId: professorUsers[14].id,
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Elisangela Oliveira Carneiro',
      presentation:
        'Sistemas de Reputação baseados em Blockchain para ambientes IoT',
      professor: 'Cássio Vinicius Serafim Prazeres',
      advisorId: professorUsers[16].id,
      topic: 'SC: Sistemas Distribuídos (SD)',
    },
    {
      name: 'Talita Rocha Pinheiro',
      presentation: '',
      professor: 'Leobino Nascimento Sampaio',
      advisorId: professorUsers[14].id,
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Rita de Cássia Novaes Barretto',
      presentation:
        'Além da IDE: expandindo a infraestrutura de dados espaciais por meio de blockchain',
      professor: 'George Marconi de Araújo Lima',
      advisorId: professorUsers[20].id,
      topic: 'SC: Sistemas Distribuídos (SD)',
    },
    {
      name: 'Nilton Flávio Sousa Seixas',
      presentation:
        'Data-driven Decision Making Frameworks for Resource Utilization in 6G O-RAN',
      professor: 'Gustavo Bittencourt Figueiredo',
      advisorId: professorUsers[12].id,
      topic: 'SC: Redes de Computadores (RC)',
    },
    {
      name: 'Eduardo Ferreira da Silva',
      presentation: 'Review-based Recommender System',
      professor: 'Frederico Araújo Durão',
      advisorId: professorUsers[13].id,
      topic: 'CA: Sistemas de Informação, Banco de Dados e Web (SIBW)',
    },
  ];

  const panelists = [];
  for (const item of panelistsAndPresentations) {
    const emailName = createEmailByName(item.name);
    panelists.push({
      name: item.name,
      email: `${emailName}@ufba.br`,
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    });
  }
  for (const user of panelists) {
    user.password = bcrypt.hashSync(user.password, 10);
  }

  const panelist_users = await prisma.userAccount.createManyAndReturn({
    data: panelists,
  });

  const submissionsData = panelistsAndPresentations.map((panelist, index) => ({
    title: panelist.presentation || 'Untitled Presentation',
    // topic: panelist.topic || 'Unspecified Topic',
    advisorId: panelist.advisorId,
    eventEditionId: edition2024.id,
    mainAuthorId: panelist_users[index].id,
    abstract: 'Abstract not provided.',
    pdfFile: 'path/to/default.pdf',
    phoneNumber: '(71) 99999-9999',
    status: SubmissionStatus.Confirmed,
  }));

  const submission = await prisma.submission.createManyAndReturn({
    data: submissionsData,
  });

  const sessions = [
    {
      eventEditionId: edition2024.id,
      type: PresentationBlockType.General,
      title: 'Abertura',
      startTime: new Date('2024-11-12T08:30:00'),
      duration: 30,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[0].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 1',
      startTime: new Date('2024-11-12T09:00:00'),
      duration: 100,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[1].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 2',
      startTime: new Date('2024-11-12T09:00:00'),
      duration: 100,
    },
    {
      eventEditionId: edition2024.id,
      type: PresentationBlockType.General,
      title: 'Coffee Break',
      startTime: new Date('2024-11-12T10:40:00'),
      duration: 20,
    },
    {
      eventEditionId: edition2024.id,
      type: PresentationBlockType.General,
      title:
        'Palestra \"Unico Academy nas Universidades: Ecossistema Unico Academy de Formação de Recursos Humanos, Pesquisa, Desenvolvimento e Inovação\"',
      startTime: new Date('2024-11-12T11:00:00'),
      duration: 80,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[0].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 3',
      startTime: new Date('2024-11-12T12:20:00'),
      duration: 40,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[1].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 4',
      startTime: new Date('2024-11-12T12:20:00'),
      duration: 40,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[0].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 5',
      startTime: new Date('2024-11-13T08:40:00'),
      duration: 120,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[1].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 6',
      startTime: new Date('2024-11-13T08:40:00'),
      duration: 120,
    },
    {
      eventEditionId: edition2024.id,
      type: PresentationBlockType.General,
      title: 'Coffee Break',
      startTime: new Date('2024-11-13T10:40:00'),
      duration: 20,
    },
    {
      eventEditionId: edition2024.id,
      type: PresentationBlockType.General,
      title: 'Diálogo com a coordenação do PGCOMP',
      startTime: new Date('2024-11-13T11:00:00'),
      duration: 40,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[0].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 7',
      startTime: new Date('2024-11-13T11:40:00'),
      duration: 80,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[0].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 8',
      startTime: new Date('2024-11-13T11:40:00'),
      duration: 80,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[0].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 9',
      startTime: new Date('2024-11-14T08:40:00'),
      duration: 120,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[1].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 10',
      startTime: new Date('2024-11-14T08:40:00'),
      duration: 120,
    },
    {
      eventEditionId: edition2024.id,
      type: PresentationBlockType.General,
      title: 'Coffee Break',
      startTime: new Date('2024-11-14T10:20:00'),
      duration: 20,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[0].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 11',
      startTime: new Date('2024-11-14T10:40:00'),
      duration: 120,
    },
    {
      eventEditionId: edition2024.id,
      roomId: rooms[1].id,
      type: PresentationBlockType.Presentation,
      title: 'Sessão 12',
      startTime: new Date('2024-11-14T10:40:00'),
      duration: 120,
    },
    {
      eventEditionId: edition2024.id,
      type: PresentationBlockType.General,
      title: 'Fechamento / Premiações',
      startTime: new Date('2024-11-14T12:20:00'),
      duration: 20,
    },
  ];

  const presentationBlocks = await prisma.presentationBlock.createManyAndReturn(
    {
      data: sessions,
    },
  );

  // Apresentações para o Dia 1
  // Como as apresentações foram criadas de forma alternadas, utilizo o índice para incluir em seu respectivo bloco
  await prisma.presentation.createMany({
    data: submission.slice(0, 10).map((sub, index) => ({
      submissionId: sub.id,
      presentationBlockId:
        index % 2 === 0 ? presentationBlocks[1].id : presentationBlocks[2].id,
      positionWithinBlock: Math.floor(index / 2),
      status: PresentationStatus.Presented,
    })),
  });

  await prisma.presentation.createMany({
    data: submission.slice(10, 14).map((sub, index) => ({
      submissionId: sub.id,
      presentationBlockId:
        index % 2 === 0 ? presentationBlocks[5].id : presentationBlocks[6].id,
      positionWithinBlock: Math.floor(index / 2),
      status: PresentationStatus.Presented,
    })),
  });

  // Apresentações para o Dia 2
  // Como existem buracos na programação, criei as apresentações diretamente com o indíce que já sabia
  await prisma.presentation.createMany({
    data: [14, 17, 19, 21, 23]
      .map((index) => submission[index])
      .map((sub, index) => ({
        submissionId: sub.id,
        presentationBlockId: presentationBlocks[7].id,
        positionWithinBlock: index,
        status: PresentationStatus.Presented,
      })),
  });

  await prisma.presentation.createMany({
    data: [15, 16, 18, 20, 22, 24]
      .map((index) => submission[index])
      .map((sub, index) => ({
        submissionId: sub.id,
        presentationBlockId: presentationBlocks[8].id,
        positionWithinBlock: index,
        status: PresentationStatus.Presented,
      })),
  });

  await prisma.presentation.createMany({
    data: [25, 27, 28, 30]
      .map((index) => submission[index])
      .map((sub, index) => ({
        submissionId: sub.id,
        presentationBlockId: presentationBlocks[11].id,
        positionWithinBlock: index,
        status: PresentationStatus.Presented,
      })),
  });

  await prisma.presentation.createMany({
    data: [26, 29, 31]
      .map((index) => submission[index])
      .map((sub, index) => ({
        submissionId: sub.id,
        presentationBlockId: presentationBlocks[12].id,
        positionWithinBlock: index,
        status: PresentationStatus.Presented,
      })),
  });

  // Apresentações para o Dia 3
  // Mesma lógica do Dia 1, porém utilizando os índices finais
  await prisma.presentation.createMany({
    data: submission.slice(-20, -10).map((sub, index) => ({
      submissionId: sub.id,
      presentationBlockId:
        index % 2 === 0 ? presentationBlocks[13].id : presentationBlocks[14].id,
      positionWithinBlock: Math.floor(index / 2),
      status: PresentationStatus.Presented,
    })),
  });

  await prisma.presentation.createMany({
    data: submission.slice(-10).map((sub, index) => ({
      submissionId: sub.id,
      presentationBlockId:
        index % 2 === 0 ? presentationBlocks[16].id : presentationBlocks[17].id,
      positionWithinBlock: Math.floor(index / 2),
      status: PresentationStatus.Presented,
    })),
  });

  console.log('2024 Edition Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
