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

const prisma = new PrismaClient();

async function main() {
  // TRUNCATE ALL TABLES THAT ARE FULLY INDEPENDENT FROM EACH OTHER
  // EVEN INDIRECTLY:
  await prisma.$executeRaw`SET session_replication_role = 'replica';`;
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "event_edition" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "user_account" CASCADE;');
  await prisma.$executeRaw`SET session_replication_role = 'origin';`;

  await prisma.userAccount.createMany({
    data: [
      {
        name: 'Prof Superadmin',
        email: 'profsuperadmin@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Superadmin,
        isVerified: true,
      },
      {
        name: 'Doctoral Student Admin',
        email: 'docadmin@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Admin,
        isVerified: true,
      },
      {
        name: 'Prof Admin',
        email: 'profadmin@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Admin,
        isVerified: true,
      },
      {
        name: 'Listener Admin',
        email: 'listadmin@example.com',
        password: '1234$Ad@',
        profile: Profile.Listener,
        level: UserLevel.Admin,
        isVerified: true,
      },
      {
        name: 'Prof Default',
        email: 'profdefault@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Default,
        isVerified: true,
      },
      {
        name: 'Listener Default',
        email: 'listdefault@example.com',
        password: '1234$Ad@',
        profile: Profile.Listener,
        level: UserLevel.Default,
        isVerified: true,
      },
      {
        name: 'Doctoral Student Default',
        email: 'docdefault@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isVerified: true,
      },
      {
        name: 'Prof Default 2',
        email: 'profdefault2@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Default,
        isVerified: true,
      },
      {
        name: 'Prof Default 3',
        email: 'profdefault3@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Default,
        isVerified: true,
      },
      {
        name: 'Doctoral Student Default 2',
        email: 'docdefault2@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isVerified: true,
      },
      {
        name: 'Doctoral Student Default 3',
        email: 'docdefault3@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isVerified: true,
      },
      {
        name: 'Doctoral Student Default 4',
        email: 'docdefault4@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isVerified: true,
      },
      {
        name: 'Doctoral Student Default 5',
        email: 'docdefault5@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isVerified: true,
      },
      {
        name: 'Doctoral Student Default 6',
        email: 'docdefault6@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isVerified: true,
      },
    ],
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
      name: 'WEPGCOMP 2025',
      description:
        'Um evento para estudantes de doutorado apresentarem suas pesquisas.',
      callForPapersText: 'Envie seus artigos para avaliação e apresentação.',
      partnersText:
        '<b>Apoiado por:</b><br>Instituto qualquercoisa<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="black"/><rect x="6" y="6" width="12" height="12" fill="white"/></svg>',
      location: 'UFBA, Salvador, Bahia, Brasil',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-03'),
      submissionStartDate: new Date('2025-01-01'),
      submissionDeadline: new Date('2025-04-01'),
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
        abstract: 'A study on how AI impacts modern research methodologies.',
        pdfFile: 'path/to/document1.pdf',
        phoneNumber: '123-456-7890',
        status: SubmissionStatus.Submitted,
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
        phoneNumber: '123-456-7891',
        status: SubmissionStatus.Submitted,
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
        phoneNumber: '123-456-7892',
        status: SubmissionStatus.Submitted,
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
        phoneNumber: '123-456-7893',
        status: SubmissionStatus.Submitted,
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
        phoneNumber: '123-456-7894',
        status: SubmissionStatus.Submitted,
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
        phoneNumber: '123-456-7895',
        status: SubmissionStatus.Submitted,
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
        phoneNumber: '123-456-7896',
        status: SubmissionStatus.Submitted,
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
      name: 'Participation Certificate',
      email: 'johndoe@example.com',
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
