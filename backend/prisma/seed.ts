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
  await prisma.userAccount.createMany({
    data: [
      {
        name: 'Prof Superadmin',
        email: 'profsuperadmin@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Superadmin,
      },
      {
        name: 'Doctoral Student Admin',
        email: 'docadmin@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Admin,
      },
      {
        name: 'Prof Admin',
        email: 'profadmin@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Admin,
      },
      {
        name: 'Listener Admin',
        email: 'listadmin@example.com',
        password: '1234$Ad@',
        profile: Profile.Listener,
        level: UserLevel.Admin,
      },
      {
        name: 'Prof Default',
        email: 'profdefault@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Default,
      },
      {
        name: 'Listener Default',
        email: 'listdefault@example.com',
        password: '1234$Ad@',
        profile: Profile.Listener,
        level: UserLevel.Default,
      },
      {
        name: 'Doctoral Student Default',
        email: 'docdefault@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
      },
      {
        name: 'Prof Default 2',
        email: 'profdefault2@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Default,
      },
      {
        name: 'Prof Default 3',
        email: 'profdefault3@example.com',
        password: '1234$Ad@',
        profile: Profile.Professor,
        level: UserLevel.Default,
      },
      {
        name: 'Doctoral Student Default 2',
        email: 'docdefault2@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
      },
      {
        name: 'Doctoral Student Default 3',
        email: 'docdefault3@example.com',
        password: '1234$Ad@',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
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
      partnersText: 'Apoiado pela Universidade XYZ.',
      location: 'UFBA, Salvador, Bahia, Brasil',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-03'),
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
        title: 'Originalidade',
        description: 'Avaliar a originalidade da pesquisa.',
      },
      {
        eventEditionId: eventEdition.id,
        title: 'Relevância',
        description: 'Avaliar a relevância da pesquisa para a área.',
      },
      {
        eventEditionId: eventEdition.id,
        title: 'Metodologia',
        description: 'Avaliar a solidez da metodologia de pesquisa.',
      },
      {
        eventEditionId: eventEdition.id,
        title: 'Clareza',
        description: 'Avaliar a clareza da apresentação e escrita.',
      },
      {
        eventEditionId: eventEdition.id,
        title: 'Impacto',
        description: 'Avaliar o potencial impacto dos resultados da pesquisa.',
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

  let position = 0;
  for (const submission of submissions) {
    await prisma.presentation.create({
      data: {
        submissionId: submission.id,
        presentationBlockId: presentationBlock.id,
        positionWithinBlock: position,
        status: PresentationStatus.ToPresent,
      },
    });
    position++;
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
