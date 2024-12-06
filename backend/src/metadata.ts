/* eslint-disable */
export default async () => {
    const t = {
        ["./user/dto/create-user.dto"]: await import("./user/dto/create-user.dto"),
        ["./presentation-block/dto/response-presentation-block.dto"]: await import("./presentation-block/dto/response-presentation-block.dto"),
        ["./user/dto/response-user.dto"]: await import("./user/dto/response-user.dto"),
        ["./mailing/mailing.dto"]: await import("./mailing/mailing.dto"),
        ["./event-edition/dto/event-edition-response"]: await import("./event-edition/dto/event-edition-response"),
        ["./queue/queue.dto"]: await import("./queue/queue.dto"),
        ["./presentation/dto/response-presentation.dto"]: await import("./presentation/dto/response-presentation.dto"),
        ["./submission/dto/response-submission.dto"]: await import("./submission/dto/response-submission.dto"),

        ["./presentation-block/dto/response-presentation-block.dto"]: await import("./presentation-block/dto/response-presentation-block.dto"),
        ["./committee-member/dto/response-committee-member.dto"]: await import("./committee-member/dto/response-committee-member.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./auth/auth.dto"), { "SignInDto": { email: { required: true, type: () => String }, password: { required: true, type: () => String } }, "ForgotPasswordDto": { email: { required: true, type: () => String, format: "email" } }, "ResetPasswordDto": { newPassword: { required: true, type: () => String } } }], [import("./user/dto/create-user.dto"), { "CreateUserDto": { name: { required: true, type: () => String, minLength: 1, maxLength: 255 }, email: { required: true, type: () => String, format: "email", minLength: 1, maxLength: 255 }, password: { required: true, type: () => String, minLength: 1, maxLength: 255 }, registrationNumber: { required: false, type: () => String, minLength: 1, maxLength: 20 }, photoFilePath: { required: false, type: () => String, minLength: 1, maxLength: 255 }, profile: { required: false, enum: t["./user/dto/create-user.dto"].Profile }, level: { required: false, enum: t["./user/dto/create-user.dto"].UserLevel }, isActive: { required: false, type: () => Boolean } }, "SetAdminDto": { requestUserId: { required: true, type: () => String, minLength: 36 }, targetUserId: { required: true, type: () => String, minLength: 36 } } }], [import("./user/dto/response-user.dto"), { "ResponseUserDto": { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, registrationNumber: { required: false, type: () => String }, photoFilePath: { required: false, type: () => String }, profile: { required: true, type: () => Object }, level: { required: true, type: () => Object }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./mailing/mailing.dto"), { "DefaultEmailDto": { from: { required: true, type: () => String }, to: { required: true, type: () => String, format: "email" }, subject: { required: true, type: () => String }, text: { required: true, type: () => String } }, "DefaultEmailResponseDto": { message: { required: true, type: () => String } }, "ContactRequestDto": { name: { required: true, type: () => String }, email: { required: true, type: () => String, format: "email" }, text: { required: true, type: () => String } }, "ContactResponseDto": { message: { required: true, type: () => String } } }], [import("./queue/queue.dto"), { "QueueMessageDto": { id: { required: true, type: () => String } }, "ContactEmailErrorMessageDto": { error: { required: true, type: () => String }, from: { required: true, type: () => String }, text: { required: true, type: () => String }, retries: { required: true, type: () => Number } }, "ContactEmailServerLimitMessageDto": { from: { required: true, type: () => String }, text: { required: true, type: () => String }, retries: { required: true, type: () => Number } }, "QueueMessageResponseDto": { message: { required: false, type: () => String }, error: { required: false, type: () => String } } }], [import("./event-edition/dto/create-event-edition.dto"), { "CreateEventEditionDto": { name: { required: true, type: () => String, maxLength: 255 }, description: { required: true, type: () => String }, callForPapersText: { required: false, type: () => String }, partnersText: { required: false, type: () => String }, url: { required: true, type: () => String, maxLength: 255, format: "uri" }, location: { required: true, type: () => String, maxLength: 255 }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, submissionDeadline: { required: true, type: () => Date }, isEvaluationRestrictToLoggedUsers: { required: false, type: () => Boolean }, presentationDuration: { required: true, type: () => Number, minimum: 1 }, presentationsPerPresentationBlock: { required: true, type: () => Number, minimum: 1 }, coordinatorId: { required: false, type: () => String } } }], [import("./event-edition/dto/update-event-edition.dto"), { "UpdateEventEditionDto": {} }], [import("./presentation/dto/create-presentation.dto"), { "CreatePresentationDto": { submissionId: { required: true, type: () => String }, presentationBlockId: { required: true, type: () => String }, positionWithinBlock: { required: true, type: () => Number, minimum: 0 }, status: { required: false, type: () => Object } } }], [import("./presentation/dto/create-presentation-with-submission.dto"), { "CreatePresentationWithSubmissionDto": { advisorId: { required: true, type: () => String }, mainAuthorId: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, title: { required: true, type: () => String, minLength: 5 }, abstractText: { required: true, type: () => String, minLength: 10 }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, submissionStatus: { required: true, type: () => Object }, coAdvisor: { required: false, type: () => String }, presentationBlockId: { required: false, type: () => String }, positionWithinBlock: { required: false, type: () => Number, minimum: 0 }, status: { required: false, type: () => Object } } }], [import("./submission/dto/create-submission.dto"), { "CreateSubmissionDto": { advisorId: { required: true, type: () => String }, mainAuthorId: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, title: { required: true, type: () => String, minLength: 5 }, abstractText: { required: true, type: () => String, minLength: 10 }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, proposedPresentationBlockId: { required: false, type: () => String }, proposedPositionWithinBlock: { required: false, type: () => Number, minimum: 0 }, status: { required: true, type: () => Object }, coAdvisor: { required: false, type: () => String } } }], [import("./submission/dto/update-submission.dto"), { "UpdateSubmissionDto": {} }], [import("./submission/dto/response-submission.dto"), { "ResponseSubmissionDto": { id: { required: true, type: () => String }, advisorId: { required: true, type: () => String }, mainAuthorId: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, title: { required: true, type: () => String }, abstract: { required: true, type: () => String }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, proposedPresentationBlockId: { required: false, type: () => String }, proposedPositionWithinBlock: { required: false, type: () => Number }, proposedStartTime: { required: false, type: () => Date }, ranking: { required: false, type: () => Number }, coAdvisor: { required: false, type: () => String }, status: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./presentation/dto/update-presentation.dto"), { "UpdatePresentationDto": {} }], [import("./presentation/dto/update-presentation-with-submission.dto"), { "UpdatePresentationWithSubmissionDto": {} }], [import("./presentation-block/dto/create-presentation-block.dto"), { "CreatePresentationBlockDto": { eventEditionId: { required: true, type: () => String }, roomId: { required: false, type: () => String }, type: { required: true, type: () => Object }, title: { required: false, type: () => String }, speakerName: { required: false, type: () => String, minLength: 2 }, startTime: { required: true, type: () => Date }, duration: { required: false, type: () => Number, minimum: 5, maximum: 720 }, numPresentations: { required: false, type: () => Number, minimum: 1 }, panelists: { required: false, type: () => [String] }, presentations: { required: false, type: () => [String] } } }], [import("./presentation-block/dto/update-presentation-block.dto"), { "UpdatePresentationBlockDto": {} }], [import("./presentation-block/dto/response-presentation-block.dto"), { "ResponsePresentationBlockDto": { id: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, roomId: { required: false, type: () => String }, type: { required: true, type: () => Object }, title: { required: false, type: () => String }, speakerName: { required: false, type: () => String }, startTime: { required: true, type: () => Date }, duration: { required: true, type: () => Number }, presentations: { required: true, type: () => [String] }, panelists: { required: true, type: () => [String] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./committee-member/dto/create-committee-member.dto"), { "CreateCommitteeMemberDto": { eventEditionId: { required: true, type: () => String }, userId: { required: true, type: () => String }, level: { required: true, type: () => Object }, role: { required: true, type: () => Object } } }], [import("./committee-member/dto/response-committee-member.dto"), { "ResponseCommitteeMemberDto": { id: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, userId: { required: true, type: () => String }, userName: { required: true, type: () => String }, level: { required: true, type: () => Object }, role: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./committee-member/dto/update-committee-member.dto"), { "UpdateCommitteeMemberDto": {} }], [import("./user/dto/update-user.dto"), { "UpdateUserDto": {} }]], "controllers": [[import("./app.controller"), { "AppController": { "getServerStatus": { type: String } } }], [import("./auth/auth.controller"), { "AuthController": { "signIn": {}, "forgotPassword": {}, "resetPassword": {} } }], [import("./user/user.controller"), { "UserController": { "create": { type: t["./user/dto/response-user.dto"].ResponseUserDto }, "setAdmin": { type: t["./user/dto/response-user.dto"].ResponseUserDto }, "setSuperAdmin": { type: t["./user/dto/response-user.dto"].ResponseUserDto }, "remove": {}, "activateUser": {} } }], [import("./mailing/mailing.controller"), { "MailingController": { "contact": { type: t["./mailing/mailing.dto"].ContactResponseDto }, "send": { type: t["./mailing/mailing.dto"].DefaultEmailResponseDto } } }], [import("./event-edition/event-edition.controller"), { "EventEditionController": { "create": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "getAll": { type: [t["./event-edition/dto/event-edition-response"].EventEditionResponseDto] }, "getById": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "update": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "setActive": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "delete": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto } } }], [import("./queue/queue.controller"), { "QueueController": { "send": { type: t["./queue/queue.dto"].QueueMessageResponseDto }, "sendEmailErrorMessage": { type: t["./queue/queue.dto"].QueueMessageResponseDto } } }], [import("./queue/rabbitMQ.controller"), { "RabbitMQController": { "message": { type: Object }, "emailErrorMessage": { type: Object }, "emailServerLimitMessage": { type: Object } } }], [import("./presentation/presentation.controller"), { "PresentationController": { "create": {}, "createWithSubmission": { type: Object }, "findAll": { type: [Object] }, "listPresentations": {}, "findOne": { type: Object }, "updatePresentationForUser": {}, "update": {}, "updateWithSubmission": {}, "remove": {} } }], [import("./submission/submission.controller"), { "SubmissionController": { "create": {}, "findAll": { type: [t["./submission/dto/response-submission.dto"].ResponseSubmissionDto] }, "findOne": { type: t["./submission/dto/response-submission.dto"].ResponseSubmissionDto }, "update": {}, "remove": {} } }], [import("./presentation-block/presentation-block.controller"), { "PresentationBlockController": { "create": {}, "findAllByEventEditionId": { type: [t["./presentation-block/dto/response-presentation-block.dto"].ResponsePresentationBlockDto] }, "findOne": { type: t["./presentation-block/dto/response-presentation-block.dto"].ResponsePresentationBlockDto }, "update": {}, "remove": {} } }], [import("./committee-member/committee-member.controller"), { "CommitteeMemberController": { "create": { type: Object }, "findAll": { type: [t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto] }, "findOne": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto }, "update": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto }, "updateByUserAndEvent": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto }, "remove": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto }, "removeByUserAndEvent": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto } } }]] } };

};