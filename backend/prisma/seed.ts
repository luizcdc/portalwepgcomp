import {
  PrismaClient,
  Profile,
  UserLevel,
  CommitteeLevel,
  CommitteeRole,
  SubmissionStatus,
  PanelistStatus,
  PresentationBlockType,
  PresentationStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // TRUNCATE ALL TABLES THAT ARE FULLY INDEPENDENT FROM EACH OTHER
  // EVEN INDIRECTLY:
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "event_edition" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "user_account" CASCADE;');
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "email_verification" CASCADE;',
  );

  const users_data = [
    {
      name: 'Paulo CoordenadorSuperadmin da Silva',
      email: 'profsuperadmin@example.com',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Superadmin,
      isVerified: true,
    },
    {
      name: 'João DoutorandoAdmin',
      email: 'docadmin@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Admin,
      isVerified: true,
    },
    {
      name: 'Carlos ProfessorAdmin',
      email: 'profadmin@example.com',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Admin,
      isVerified: true,
    },
    {
      name: 'Sílvio OuvinteAdmin',
      email: 'listadmin@example.com',
      password: '1234$Ad@',
      profile: Profile.Listener,
      level: UserLevel.Admin,
      isVerified: true,
    },
    {
      name: 'Pedro dos Santos',
      email: 'profdefault@example.com',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Joana Silva',
      email: 'listdefault@example.com',
      password: '1234$Ad@',
      profile: Profile.Listener,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Ana Rodrigues',
      email: 'docdefault@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Walter Marinho',
      email: 'profdefault2@example.com',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Karl Marx',
      email: 'profdefault3@example.com',
      password: '1234$Ad@',
      profile: Profile.Professor,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Ludwig Wittgenstein',
      email: 'docdefault2@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Julia Kristeva',
      email: 'docdefault3@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Michel Foucault',
      email: 'docdefault4@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Rubem Alves',
      email: 'docdefault5@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Machado de Assis',
      email: 'docdefault6@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Clarice Lispector',
      email: 'docdefault7@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'José Saramago',
      email: 'docdefault8@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Paulo Freire',
      email: 'docdefault9@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Virginia Woolf',
      email: 'docdefault10@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Simone de Beauvoir',
      email: 'docdefault11@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Hannah Arendt',
      email: 'docdefault12@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
    {
      name: 'Jean-Paul Sartre',
      email: 'docdefault13@example.com',
      password: '1234$Ad@',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
      isVerified: true,
    },
  ];

  for (const user of users_data) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  await prisma.userAccount.createMany({
    data: users_data,
  });

  const users = await prisma.userAccount.findMany();

  const superAdminUser = users.find(
    (user) => user.level === UserLevel.Superadmin,
  );
  const adminProfUser = users.find(
    (user) =>
      user.level === UserLevel.Admin && user.profile === Profile.Professor,
  );
  const adminDocUser = users.find(
    (user) =>
      user.level === UserLevel.Admin &&
      user.profile === Profile.DoctoralStudent,
  );
  const adminListUser = users.find(
    (user) =>
      user.level === UserLevel.Admin && user.profile === Profile.Listener,
  );
  const professors = users.filter((user) => user.profile === Profile.Professor);
  const listeners = users.filter((user) => user.profile === Profile.Listener);
  const doctoralStudents = users.filter(
    (user) => user.profile === Profile.DoctoralStudent,
  );

  const eventEdition = await prisma.eventEdition.create({
    data: {
      name: 'WEPGCOMP 2024',
      description:
        'Um evento para estudantes de doutorado apresentarem suas pesquisas.',
      callForPapersText: 'Envie seus artigos para avaliação e apresentação.',
      partnersText:
        '<b>Apoiado por:</b><br>Instituto qualquercoisa<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="black"/><rect x="6" y="6" width="12" height="12" fill="white"/></svg>',
      location: 'UFBA, Salvador, Bahia, Brasil',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-03'),
      submissionStartDate: new Date('2024-01-01'),
      submissionDeadline: new Date('2024-04-01'),
      isActive: true,
      isEvaluationRestrictToLoggedUsers: true,
      presentationDuration: 15,
      presentationsPerPresentationBlock: 3,
    },
  });
  const room = await prisma.room.create({
    data: {
      eventEditionId: eventEdition.id,
      name: 'Auditório Principal',
      description: 'O auditório principal para apresentações.',
    },
  });

  await prisma.committeeMember.createMany({
    data: [
      {
        eventEditionId: eventEdition.id,
        userId: superAdminUser.id,
        level: CommitteeLevel.Coordinator,
        role: CommitteeRole.OrganizingCommittee,
      },
      {
        eventEditionId: eventEdition.id,
        userId: adminProfUser.id,
        level: CommitteeLevel.Committee,
        role: CommitteeRole.OrganizingCommittee,
      },
      {
        eventEditionId: eventEdition.id,
        userId: adminDocUser.id,
        level: CommitteeLevel.Committee,
        role: CommitteeRole.StudentVolunteers,
      },
      {
        eventEditionId: eventEdition.id,
        userId: adminListUser.id,
        level: CommitteeLevel.Committee,
        role: CommitteeRole.StudentVolunteers,
      },
    ],
  });

  await prisma.evaluationCriteria.createMany({
    data: [
      {
        eventEditionId: eventEdition.id,
        title: 'Conteúdo',
        description:
          'Quão satisfeito(a) você ficou com o conteúdo da pesquisa apresentada?',
      },
      {
        eventEditionId: eventEdition.id,
        title: 'Qualidade e Clareza',
        description:
          'Quão satisfeito(a) você ficou com a qualidade e clareza da apresentação?',
      },
      {
        eventEditionId: eventEdition.id,
        title: 'Relevância ao Tema',
        description:
          'Quão bem a pesquisa abordou e explicou o problema central?',
      },
      {
        eventEditionId: eventEdition.id,
        title: 'Solução proposta',
        description:
          'Quão clara e prática você considera a solução proposta pela pesquisa?',
      },
      {
        eventEditionId: eventEdition.id,
        title: 'Resultados',
        description:
          'Como você avalia a qualidade e aplicabilidade dos resultados apresentados?',
      },
    ],
  });

  const submissions = [
    await prisma.submission.create({
      data: {
        advisorId: professors[0].id,
        mainAuthorId: doctoralStudents[0].id,
        eventEditionId: eventEdition.id,
        title: 'The Impact of AI in Modern Research',
        abstract:
          'A study on how AI impacts modern research methodologies. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
        pdfFile: 'path/to/document1.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[1].id,
        mainAuthorId: doctoralStudents[1].id,
        eventEditionId: eventEdition.id,
        title: 'Quantum Computing Advances',
        abstract: 'Exploring the latest advancements in quantum computing.',
        pdfFile: 'path/to/document2.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[2].id,
        mainAuthorId: doctoralStudents[2].id,
        eventEditionId: eventEdition.id,
        title: 'Blockchain Technology in Finance',
        abstract:
          'An analysis of blockchain technology applications in finance.',
        pdfFile: 'path/to/document3.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[0].id,
        mainAuthorId: doctoralStudents[3].id,
        eventEditionId: eventEdition.id,
        title: 'Machine Learning in Healthcare',
        abstract: 'Investigating ML applications in healthcare diagnosis.',
        pdfFile: 'path/to/document4.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[1].id,
        mainAuthorId: doctoralStudents[4].id,
        eventEditionId: eventEdition.id,
        title: 'Cloud Computing Security',
        abstract: 'Analysis of security challenges in cloud computing.',
        pdfFile: 'path/to/document5.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[2].id,
        mainAuthorId: doctoralStudents[5].id,
        eventEditionId: eventEdition.id,
        title: 'Internet of Things Networks',
        abstract: 'Study of IoT network architectures and protocols.',
        pdfFile: 'path/to/document6.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[0].id,
        mainAuthorId: doctoralStudents[6].id,
        eventEditionId: eventEdition.id,
        title: 'Big Data Analytics',
        abstract: 'Exploring big data analytics and visualization tools.',
        pdfFile: 'path/to/document7.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[1].id,
        mainAuthorId: doctoralStudents[7].id,
        eventEditionId: eventEdition.id,
        title: 'Cybersecurity in Modern Networks',
        abstract: 'Analysis of current cybersecurity challenges and solutions.',
        pdfFile: 'path/to/document8.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[2].id,
        mainAuthorId: doctoralStudents[8].id,
        eventEditionId: eventEdition.id,
        title: 'Artificial Neural Networks',
        abstract: 'Study of ANN architectures and training algorithms.',
        pdfFile: 'path/to/document9.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[0].id,
        mainAuthorId: doctoralStudents[9].id,
        eventEditionId: eventEdition.id,
        title: 'Software Engineering Practices',
        abstract: 'Analysis of software engineering methodologies and tools.',
        pdfFile: 'path/to/document10.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[1].id,
        mainAuthorId: doctoralStudents[10].id,
        eventEditionId: eventEdition.id,
        title: 'Computer Vision Applications',
        abstract:
          'Exploring CV applications in image recognition and analysis.',
        pdfFile: 'path/to/document11.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[2].id,
        mainAuthorId: doctoralStudents[11].id,
        eventEditionId: eventEdition.id,
        title: 'Natural Language Processing',
        abstract: 'Study of NLP algorithms and applications in text analysis.',
        pdfFile: 'path/to/document12.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[0].id,
        mainAuthorId: doctoralStudents[12].id,
        eventEditionId: eventEdition.id,
        title: 'Distributed Systems Architectures',
        abstract:
          'Analysis of distributed systems architectures and protocols.',
        pdfFile: 'path/to/document13.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
    await prisma.submission.create({
      data: {
        advisorId: professors[1].id,
        mainAuthorId: doctoralStudents[13].id,
        eventEditionId: eventEdition.id,
        title: 'Mobile Computing Technologies',
        abstract: 'Exploring mobile computing technologies and applications.',
        pdfFile: 'path/to/document14.pdf',
        phoneNumber: '(12) 93456-7896',
        status: SubmissionStatus.Confirmed,
      },
    }),
  ];

  const evaluationCriteria = await prisma.evaluationCriteria.findMany({
    where: { eventEditionId: eventEdition.id },
  });

  // evaluations of listeners for all submissions
  for (const submission of submissions) {
    for (const criteria of evaluationCriteria) {
      for (const user of listeners) {
        const randomScore = Math.floor(Math.random() * 5) + 1;
        await prisma.evaluation.create({
          data: {
            userId: user.id,
            evaluationCriteriaId: criteria.id,
            submissionId: submission.id,
            score: randomScore,
          },
        });
      }
    }
  }

  const presentationBlock = await prisma.presentationBlock.create({
    data: {
      eventEditionId: eventEdition.id,
      roomId: room.id,
      type: PresentationBlockType.Presentation,
      title: 'Apresentações de Pesquisa em IA',
      startTime: new Date('2024-05-01T09:00:00'),
      duration:
        eventEdition.presentationDuration *
        eventEdition.presentationsPerPresentationBlock,
    },
  });

  const presentationBlock2 = await prisma.presentationBlock.create({
    data: {
      eventEditionId: eventEdition.id,
      roomId: room.id,
      type: PresentationBlockType.Presentation,
      title: 'Apresentações de Pesquisa em Computação Quântica',
      startTime: new Date('2024-05-01T10:00:00'),
      duration:
        eventEdition.presentationDuration *
        eventEdition.presentationsPerPresentationBlock,
    },
  });

  const presentationBlock3 = await prisma.presentationBlock.create({
    data: {
      eventEditionId: eventEdition.id,
      roomId: room.id,
      type: PresentationBlockType.Presentation,
      title: 'Apresentações de Pesquisa em Cybersecurity',
      startTime: new Date('2024-05-01T11:00:00'),
      duration:
        eventEdition.presentationDuration *
        eventEdition.presentationsPerPresentationBlock,
    },
  });

  await prisma.presentationBlock.create({
    data: {
      eventEditionId: eventEdition.id,
      type: PresentationBlockType.General,
      title: 'Pausa para Almoço',
      startTime: new Date('2024-05-01T12:00:00'),
      duration: 120,
    },
  });

  const presentationBlock4 = await prisma.presentationBlock.create({
    data: {
      eventEditionId: eventEdition.id,
      roomId: room.id,
      type: PresentationBlockType.Presentation,
      title: 'Apresentações de Pesquisa em Otimização',
      startTime: new Date('2024-05-02T11:00:00'),
      duration:
        eventEdition.presentationDuration *
        eventEdition.presentationsPerPresentationBlock,
    },
  });

  await prisma.presentationBlock.create({
    data: {
      eventEditionId: eventEdition.id,
      type: PresentationBlockType.General,
      title: 'Pausa para Almoço',
      startTime: new Date('2024-05-02T12:00:00'),
      duration: 120,
    },
  });

  const presentationBlock5 = await prisma.presentationBlock.create({
    data: {
      eventEditionId: eventEdition.id,
      roomId: room.id,
      type: PresentationBlockType.Presentation,
      title: 'Apresentações de Pesquisa em Redes de Computadores',
      startTime: new Date('2024-05-02T13:00:00'),
      duration:
        eventEdition.presentationDuration *
        eventEdition.presentationsPerPresentationBlock,
    },
  });

  await prisma.presentationBlock.create({
    data: {
      eventEditionId: eventEdition.id,
      type: PresentationBlockType.General,
      title: 'Encerramento',
      startTime: new Date('2024-05-02T14:00:00'),
      duration: 120,
    },
  });

  // First three submissions to presentationBlock 1
  for (let i = 0; i < 3; i++) {
    await prisma.presentation.create({
      data: {
        submissionId: submissions[i].id,
        presentationBlockId: presentationBlock.id,
        positionWithinBlock: i,
        status: PresentationStatus.ToPresent,
      },
    });
  }

  // Next three submissions to presentationBlock 2
  for (let i = 3; i < 6; i++) {
    await prisma.presentation.create({
      data: {
        submissionId: submissions[i].id,
        presentationBlockId: presentationBlock2.id,
        positionWithinBlock: i - 3,
        status: PresentationStatus.ToPresent,
      },
    });
  }

  await prisma.presentation.create({
    data: {
      submissionId: submissions[6].id,
      presentationBlockId: presentationBlock3.id,
      positionWithinBlock: 0,
      status: PresentationStatus.ToPresent,
    },
  });

  // next 3 submissions to presentationBlock 4
  for (let i = 7; i < 10; i++) {
    await prisma.presentation.create({
      data: {
        submissionId: submissions[i].id,
        presentationBlockId: presentationBlock4.id,
        positionWithinBlock: i - 7,
        status: PresentationStatus.ToPresent,
      },
    });
  }

  // next 3 submissions to presentationBlock 5
  for (let i = 10; i < 13; i++) {
    await prisma.presentation.create({
      data: {
        submissionId: submissions[i].id,
        presentationBlockId: presentationBlock5.id,
        positionWithinBlock: i - 10,
        status: PresentationStatus.ToPresent,
      },
    });
  }

  const panelistUsers = professors.slice(0, 4);
  for (const professor of panelistUsers) {
    await prisma.panelist.create({
      data: {
        presentationBlockId: presentationBlock.id,
        userId: professor.id,
        status: PanelistStatus.Confirmed,
      },
    });
  }

  // for all panelists, create evaluations for all submissions
  for (const submission of submissions) {
    for (const criteria of evaluationCriteria) {
      for (const professor of panelistUsers) {
        const randomScore = Math.floor(Math.random() * 5) + 1;
        await prisma.evaluation.create({
          data: {
            userId: professor.id,
            evaluationCriteriaId: criteria.id,
            submissionId: submission.id,
            score: randomScore,
          },
        });
      }
    }
  }

  for (const professor of professors.slice(0, 3)) {
    await prisma.awardedPanelist.create({
      data: {
        eventEditionId: eventEdition.id,
        userId: professor.id,
      },
    });
  }

  // Seed for Certificate
  await prisma.certificate.create({
    data: {
      eventEditionId: eventEdition.id,
      userId: professors[0].id,
      filePath: 'path/to/certificate1.pdf',
      isEmailSent: false,
    },
  });
  await prisma.certificate.create({
    data: {
      eventEditionId: eventEdition.id,
      userId: doctoralStudents[0].id,
      filePath: 'path/to/certificate2.pdf',
      isEmailSent: true,
    },
  });

  // Seed for Guidance
  await prisma.guidance.create({
    data: {
      eventEditionId: eventEdition.id,
      summary:
        '<p style="text-align: center;">Obtenha todas as orientações que precisa para participar do WEPGCOMP.</p><p style="text-align: center;">O objetivo do evento é apresentar as pesquisas em andamento realizadas pelos alunos de doutorado (a partir do segundo ano), </p><p style="text-align: center;">bem como propiciar um ambiente de troca de conhecimento e congregação para toda a comunidade.</p>',
      audienceGuidance:
        '<p><strong style="font-size: 24px;">Informações</strong> </p><ul><li>A Programação Preliminar do WEPGCOMP 2024 pode ser encontrada na&nbsp;página do evento.</li><li>O evento está organizado em&nbsp;sessões temáticas&nbsp;para apresentação de trabalhos das/os doutorandas/os matriculadas/os no componente curricular MATA33.</li><li>A apresentação no WEPGCOMP é&nbsp;opcional&nbsp;para as/os doutorandas/os que realizaram ou realizarão o exame de qualificação (MATA34) em 2024. Nesse caso, a nota do componente MATA33 será a mesma atribuída ao componente MATA34 em 2024.</li><li>Cada trabalho apresentado em uma sessão contará com um grupo de, no mínimo, três docentes responsáveis pela avaliação do trabalho, além de seu orientador.</li><li>O evento será realizado na modalidade&nbsp;presencial.</li></ul><p><span style="font-size: 24px;"><strong>Recomendações para a Audiência</strong></span> </p><ul><li>Recomenda-se chegar à sala antes do início de cada sessão.</li><li>Após as perguntas dos avaliadores, se houver tempo, o coordenador da sessão fará a moderação das perguntas da audiência.</li></ul>',
      authorGuidance:
        '<p><strong style="font-size: 24px;">Apresentação de </strong><strong style="font-size: 24px;">trabalhos</strong> </p><ul><li>O WEPGCOMP 2024 será presencial e, em casos excepcionais, apresentações poderão ser remotas.</li><li>Não haverá mudança de computador entre as apresentações.</li><li>Cada apresentação não deve ultrapassar os 10 minutos de duração. Na sequência da apresentação, os avaliadores terão 5 minutos para perguntas e sugestões.</li><li>O controle de tempo da apresentação será rigoroso:&nbsp;<strong>10 minutos para apresentação oral&nbsp;e&nbsp;5 minutos</strong> para perguntas.</li><li>Em caso de problemas técnicos, a apresentação será reagendada para o final da sessão ou para a sessão seguinte.</li></ul><p><strong style="font-size: 24px;">Boas Práticas para o(a) Apresentador(a):</strong> </p><ul><li>Estar presente e entrar em contato com o/a coordenadora da sua sessão&nbsp;<strong>antes do início da sessão em que fará a sua apresentação</strong>.</li><li>No caso de apresentação remota, testar a câmera e o microfone de seu computador ou smartphone, e sua conexão com a Internet, ao menos&nbsp;<strong>30 minutos antes</strong> do início da sua sessão. Em caso de problemas, entrar em contato com a coordenação da sessão (a ser divulgada na página do evento). Recomenda-se o uso de&nbsp;headset&nbsp;para diminuir a interferência de sons externos durante a apresentação.</li></ul>',
      reviewerGuidance:
        '<h2 id="recomendações-para-os-avaliadores">Recomendações para os Avaliadores</h2><p>O objetivo principal do WEPGCOMP é tornar públicas as pesquisas de doutorado e o andamento de suas atividades. Não é necessário ser pesquisador nos temas das apresentações para avaliar o andamento do trabalho de doutorado.</p><p>Para as apresentações realizadas na(s) sessão(ões) em que participa como avaliador:</p><ul>  <li>Observar a data de ingresso do/a discente no PGCOMP e se é bolsista.</li>  <li>Fazer perguntas objetivas e comentários construtivos, considerando o estágio do trabalho: pré-qualificação, qualificação recente (no ano do evento) e pós-qualificação.    <ul>      <li>Espera-se que o doutorando em estágio de pré-qualificação tenha concluído as disciplinas e mostre que o tema da pesquisa está definido, com revisão da literatura em andamento (no mínimo).</li>    </ul>  </li>  <li>    <p>Se possível, olhar a apresentação do WEPGCOMP do ano anterior para avaliar o progresso do trabalho de pesquisa do discente.</p>  </li>  <li>Avaliar o trabalho pelo sistema (disponível em link na página do trabalho).</li></ul>',
    },
  });

  console.log('Seeding completed.');
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
