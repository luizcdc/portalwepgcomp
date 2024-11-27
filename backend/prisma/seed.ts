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
  // Seed for UserAccount
  const user = await prisma.userAccount.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'securepassword',
      profile: Profile.DoctoralStudent,
      level: UserLevel.Default,
    },
  });

  // Seed for EventEdition
  const eventEdition = await prisma.eventEdition.create({
    data: {
      name: 'Annual Research Conference',
      description: 'An event for doctoral students to present their research.',
      callForPapersText: 'Submit your papers for review and presentation.',
      partnersText: 'Supported by University of XYZ.',
      url: 'http://example.com',
      location: 'New York',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-03'),
      submissionDeadline: new Date('2024-04-01'),
    },
  });

  // Seed for CommitteeMember
  await prisma.committeeMember.create({
    data: {
      eventEditionId: eventEdition.id,
      userId: user.id,
      level: CommitteeLevel.Committee,
      role: CommitteeRole.ITSupport,
    },
  });

  // Seed for EvaluationCriteria
  const evaluationCriteria = await prisma.evaluationCriteria.create({
    data: {
      eventEditionId: eventEdition.id,
      title: 'Originality',
      description: 'Evaluate the originality of the research.',
      weightRadio: 0.3,
    },
  });

  // Seed for Submission
  const submission = await prisma.submission.create({
    data: {
      advisorId: user.id,
      mainAuthorId: user.id,
      eventEditionId: eventEdition.id,
      title: 'The Impact of AI in Modern Research',
      abstract: 'A study on how AI impacts modern research methodologies.',
      pdfFile: 'path/to/document.pdf',
      phoneNumber: '123-456-7890',
      status: SubmissionStatus.Submitted,
    },
  });

  // Seed for Evaluation
  await prisma.evaluation.create({
    data: {
      userId: user.id,
      evaluationCriteriaId: evaluationCriteria.id,
      submissionId: submission.id,
      score: 4.5,
      comments: 'Well-researched and original topic.',
    },
  });

  // Seed for AwardedPanelist
  await prisma.awardedPanelist.create({
    data: {
      eventEditionId: eventEdition.id,
      userId: user.id,
    },
  });

  // Seed for Room
  const room = await prisma.room.create({
    data: {
      eventEditionId: eventEdition.id,
      name: 'Main Conference Hall',
      description: 'The main hall for presentations.',
    },
  });

  // Seed for Certificate
  await prisma.certificate.create({
    data: {
      eventEditionId: eventEdition.id,
      name: 'Participation Certificate',
      email: 'johndoe@example.com',
    },
  });

  // Seed for PresentationBlock
  const presentationBlock = await prisma.presentationBlock.create({
    data: {
      eventEditionId: eventEdition.id,
      roomId: room.id,
      type: PresentationBlockType.Presentation,
      title: 'AI Research Presentations',
      speakerName: 'Dr. Smith',
      startTime: new Date('2024-05-01T09:00:00'),
      duration: 120,
    },
  });

  // Seed for Panelist
  await prisma.panelist.create({
    data: {
      presentationBlockId: presentationBlock.id,
      userId: user.id,
      status: PanelistStatus.Confirmed,
    },
  });

  // Seed for Presentation
  await prisma.presentation.create({
    data: {
      submissionId: submission.id,
      presentationBlockId: presentationBlock.id,
      positionWithinBlock: 1,
      status: PresentationStatus.ToPresent,
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
