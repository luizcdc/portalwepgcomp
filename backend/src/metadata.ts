/* eslint-disable */
export default async () => {
    const t = {
        ["./user/dto/create-user.dto"]: await import("./user/dto/create-user.dto"),
        ["./presentation-block/dto/response-presentation-block.dto"]: await import("./presentation-block/dto/response-presentation-block.dto"),
        ["./awarded-panelists/dto/create-awarded-panelists.dto"]: await import("./awarded-panelists/dto/create-awarded-panelists.dto"),
        ["./awarded-doctoral-students/dto/reponse-awarded-doctoral-students.dto"]: await import("./awarded-doctoral-students/dto/reponse-awarded-doctoral-students.dto"),
        ["./user/dto/response-user.dto"]: await import("./user/dto/response-user.dto"),
        ["./mailing/mailing.dto"]: await import("./mailing/mailing.dto"),
        ["./event-edition/dto/event-edition-response"]: await import("./event-edition/dto/event-edition-response"),
        ["./committee-member/dto/response-committee-member.dto"]: await import("./committee-member/dto/response-committee-member.dto"),
        ["./queue/queue.dto"]: await import("./queue/queue.dto"),
        ["./presentation/dto/bookmark-presentation.dto"]: await import("./presentation/dto/bookmark-presentation.dto"),
        ["./presentation/dto/response-presentation.dto"]: await import("./presentation/dto/response-presentation.dto"),
        ["./presentation/dto/list-advised-presentations.dto"]: await import("./presentation/dto/list-advised-presentations.dto"),
        ["./submission/dto/response-submission.dto"]: await import("./submission/dto/response-submission.dto"),
        ["./guidance/dto/response-guidance.dto"]: await import("./guidance/dto/response-guidance.dto"),
        ["./awarded-panelists/dto/create-awarded-panelists-response.dto"]: await import("./awarded-panelists/dto/create-awarded-panelists-response.dto"),
        ["./awarded-panelists/dto/response-panelist-users.dto"]: await import("./awarded-panelists/dto/response-panelist-users.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./auth/auth.dto"), { "SignInDto": { email: { required: true, type: () => String }, password: { required: true, type: () => String } }, "ForgotPasswordDto": { email: { required: true, type: () => String, format: "email" } }, "ResetPasswordDto": { newPassword: { required: true, type: () => String } } }], [import("./user/dto/create-user.dto"), { "CreateUserDto": { name: { required: true, type: () => String, minLength: 1, maxLength: 255 }, email: { required: true, type: () => String, format: "email", minLength: 1, maxLength: 255 }, password: { required: true, type: () => String, minLength: 1, maxLength: 255 }, registrationNumber: { required: false, type: () => String, minLength: 1, maxLength: 20 }, photoFilePath: { required: false, type: () => String, minLength: 1, maxLength: 255 }, profile: { required: false, enum: t["./user/dto/create-user.dto"].Profile }, level: { required: false, enum: t["./user/dto/create-user.dto"].UserLevel }, isActive: { required: false, type: () => Boolean } }, "SetAdminDto": { requestUserId: { required: true, type: () => String, minLength: 36 }, targetUserId: { required: true, type: () => String, minLength: 36 } } }], [import("./user/dto/response-user.dto"), { "ResponseUserDto": { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, registrationNumber: { required: false, type: () => String }, photoFilePath: { required: false, type: () => String }, profile: { required: true, type: () => Object }, level: { required: true, type: () => Object }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, isVerified: { required: true, type: () => Boolean } } }], [import("./mailing/mailing.dto"), { "DefaultEmailDto": { from: { required: true, type: () => String }, to: { required: true, type: () => String, format: "email" }, subject: { required: true, type: () => String }, text: { required: true, type: () => String } }, "DefaultEmailResponseDto": { message: { required: true, type: () => String } }, "ContactRequestDto": { name: { required: true, type: () => String }, email: { required: true, type: () => String, format: "email" }, text: { required: true, type: () => String } }, "ContactResponseDto": { message: { required: true, type: () => String } } }], [import("./queue/queue.dto"), { "QueueMessageDto": { id: { required: true, type: () => String } }, "ContactEmailErrorMessageDto": { error: { required: true, type: () => String }, from: { required: true, type: () => String }, text: { required: true, type: () => String }, retries: { required: true, type: () => Number } }, "ContactEmailServerLimitMessageDto": { from: { required: true, type: () => String }, text: { required: true, type: () => String }, retries: { required: true, type: () => Number } }, "QueueMessageResponseDto": { message: { required: false, type: () => String }, error: { required: false, type: () => String } } }], [import("./event-edition/dto/create-event-edition.dto"), { "CreateEventEditionDto": { name: { required: true, type: () => String, maxLength: 255 }, description: { required: true, type: () => String }, callForPapersText: { required: false, type: () => String }, partnersText: { required: false, type: () => String }, location: { required: true, type: () => String, maxLength: 255 }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, submissionStartDate: { required: false, type: () => Date }, submissionDeadline: { required: true, type: () => Date }, isEvaluationRestrictToLoggedUsers: { required: false, type: () => Boolean }, presentationDuration: { required: true, type: () => Number, minimum: 1 }, presentationsPerPresentationBlock: { required: true, type: () => Number, minimum: 1 }, coordinatorId: { required: false, type: () => String } }, "CreateFromEventEditionFormDto": { name: { required: true, type: () => String, maxLength: 255 }, description: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, location: { required: true, type: () => String, maxLength: 255 }, coordinatorId: { required: false, type: () => String }, organizingCommitteeIds: { required: true, type: () => [String] }, itSupportIds: { required: true, type: () => [String] }, administrativeSupportIds: { required: true, type: () => [String] }, communicationIds: { required: true, type: () => [String] }, presentationsPerPresentationBlock: { required: true, type: () => Number, minimum: 1 }, presentationDuration: { required: true, type: () => Number, minimum: 1 }, callForPapersText: { required: false, type: () => String }, submissionDeadline: { required: true, type: () => Date } } }], [import("./event-edition/dto/update-event-edition.dto"), { "UpdateEventEditionDto": {}, "UpdateFromEventEditionFormDto": { name: { required: false, type: () => String, maxLength: 255 }, description: { required: false, type: () => String }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date }, location: { required: false, type: () => String, maxLength: 255 }, coordinatorId: { required: false, type: () => String }, organizingCommitteeIds: { required: false, type: () => [String] }, itSupportIds: { required: false, type: () => [String] }, administrativeSupportIds: { required: false, type: () => [String] }, communicationIds: { required: false, type: () => [String] }, presentationsPerPresentationBlock: { required: false, type: () => Number, minimum: 1 }, presentationDuration: { required: false, type: () => Number, minimum: 1 }, callForPapersText: { required: false, type: () => String }, submissionDeadline: { required: false, type: () => Date } } }], [import("./committee-member/dto/create-committee-member.dto"), { "CreateCommitteeMemberDto": { eventEditionId: { required: true, type: () => String }, userId: { required: true, type: () => String }, level: { required: true, type: () => Object }, role: { required: true, type: () => Object } } }], [import("./committee-member/dto/response-committee-member.dto"), { "ResponseCommitteeMemberDto": { id: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, userId: { required: true, type: () => String }, userName: { required: true, type: () => String }, userEmail: { required: true, type: () => String }, level: { required: true, type: () => Object }, role: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./committee-member/dto/update-committee-member.dto"), { "UpdateCommitteeMemberDto": {} }], [import("./presentation/dto/create-presentation.dto"), { "CreatePresentationDto": { submissionId: { required: true, type: () => String }, presentationBlockId: { required: true, type: () => String }, positionWithinBlock: { required: true, type: () => Number, minimum: 0 }, status: { required: false, type: () => Object } } }], [import("./presentation/dto/create-presentation-with-submission.dto"), { "CreatePresentationWithSubmissionDto": { advisorId: { required: true, type: () => String }, mainAuthorId: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, title: { required: true, type: () => String, minLength: 5 }, abstractText: { required: true, type: () => String, minLength: 10 }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, coAdvisor: { required: false, type: () => String }, presentationBlockId: { required: true, type: () => String }, positionWithinBlock: { required: true, type: () => Number, minimum: 0 }, status: { required: false, type: () => Object } } }], [import("./submission/dto/create-submission.dto"), { "CreateSubmissionDto": { advisorId: { required: true, type: () => String }, mainAuthorId: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, title: { required: true, type: () => String, minLength: 5 }, abstractText: { required: true, type: () => String, minLength: 10 }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, proposedPresentationBlockId: { required: false, type: () => String }, proposedPositionWithinBlock: { required: false, type: () => Number, minimum: 0 }, status: { required: false, type: () => Object }, coAdvisor: { required: false, type: () => String } }, "CreateSubmissionInCurrentEventDto": { advisorId: { required: true, type: () => String }, mainAuthorId: { required: true, type: () => String }, title: { required: true, type: () => String, minLength: 5 }, abstractText: { required: true, type: () => String, minLength: 10 }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, proposedPresentationBlockId: { required: false, type: () => String }, proposedPositionWithinBlock: { required: false, type: () => Number, minimum: 0 }, status: { required: false, type: () => Object }, coAdvisor: { required: false, type: () => String } } }], [import("./submission/dto/update-submission.dto"), { "UpdateSubmissionDto": {} }], [import("./submission/dto/response-submission.dto"), { "ResponseSubmissionDto": { id: { required: true, type: () => String }, advisorId: { required: true, type: () => String }, mainAuthorId: { required: true, type: () => String }, mainAuthor: { required: true, type: () => ({ name: { required: true, type: () => String }, email: { required: true, type: () => String } }) }, eventEditionId: { required: true, type: () => String }, title: { required: true, type: () => String }, abstract: { required: true, type: () => String }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, proposedPresentationBlockId: { required: false, type: () => String }, proposedPositionWithinBlock: { required: false, type: () => Number }, proposedStartTime: { required: false, type: () => Date }, coAdvisor: { required: false, type: () => String }, status: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./presentation/dto/update-presentation.dto"), { "UpdatePresentationDto": {} }], [import("./presentation/dto/update-presentation-with-submission.dto"), { "UpdatePresentationWithSubmissionDto": {} }], [import("./presentation/dto/response-presentation.dto"), { "PresentationResponseDto": { id: { required: true, type: () => String }, presentationBlockId: { required: true, type: () => String }, positionWithinBlock: { required: true, type: () => Number }, presentationTime: { required: true, type: () => Date }, publicAverageScore: { required: false, type: () => Number }, evaluatorsAverageScore: { required: false, type: () => Number }, submission: { required: true, type: () => ({ id: { required: true, type: () => String }, advisorId: { required: true, type: () => String }, advisor: { required: false, type: () => ({ name: { required: true, type: () => String }, email: { required: true, type: () => String } }) }, mainAuthorId: { required: true, type: () => String }, mainAuthor: { required: false, type: () => ({ name: { required: true, type: () => String }, email: { required: true, type: () => String } }) }, eventEditionId: { required: true, type: () => String }, title: { required: true, type: () => String }, abstract: { required: true, type: () => String }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, proposedPresentationBlockId: { required: false, type: () => String }, proposedPositionWithinBlock: { required: false, type: () => Number }, coAdvisor: { required: false, type: () => String }, status: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } }) } } }], [import("./presentation/dto/bookmark-presentation.dto"), { "BookmarkPresentationRequestDto": { presentationId: { required: true, type: () => String } }, "BookmarkPresentationResponseDto": { bookmarkedPresentations: { required: true } }, "BookmarkedPresentationsResponseDto": { bookmarkedPresentations: { required: true } }, "BookmarkedPresentationResponseDto": { bookmarked: { required: true, type: () => Boolean } } }], [import("./presentation/dto/list-advised-presentations.dto"), { "ListAdvisedPresentationsResponse": { id: { required: true, type: () => String }, submissionId: { required: true, type: () => String }, presentationBlockId: { required: true, type: () => String }, positionWithinBlock: { required: true, type: () => Number }, status: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, publicAverageScore: { required: false, type: () => Number }, evaluatorsAverageScore: { required: false, type: () => Number } } }], [import("./presentation-block/dto/create-presentation-block.dto"), { "CreatePresentationBlockDto": { eventEditionId: { required: true, type: () => String }, roomId: { required: false, type: () => String }, type: { required: true, type: () => Object }, title: { required: false, type: () => String }, speakerName: { required: false, type: () => String, minLength: 2 }, startTime: { required: true, type: () => Date }, duration: { required: false, type: () => Number, minimum: 5, maximum: 720 }, numPresentations: { required: false, type: () => Number, minimum: 1 }, panelists: { required: false, type: () => [String] }, submissions: { required: false, type: () => [String] } } }], [import("./presentation-block/dto/update-presentation-block.dto"), { "UpdatePresentationBlockDto": {} }], [import("./presentation-block/dto/swap-presentations.dto"), { "SwapPresentationsDto": { presentation1Id: { required: true, type: () => String }, presentation2Id: { required: true, type: () => String } } }], [import("./presentation-block/dto/response-presentation-block.dto"), { "ResponsePresentationDto": { id: { required: true, type: () => String }, submissionId: { required: true, type: () => String }, presentationBlockId: { required: true, type: () => String }, positionWithinBlock: { required: true, type: () => Number }, status: { required: true, type: () => Object }, startTime: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, submission: { required: true, type: () => t["./presentation-block/dto/response-presentation-block.dto"].ResponseSubmissionDto } }, "ResponseSubmissionDto": { id: { required: true, type: () => String }, advisorId: { required: true, type: () => String }, mainAuthorId: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, title: { required: true, type: () => String }, abstract: { required: true, type: () => String }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, proposedPresentationBlockId: { required: false, type: () => String }, proposedPositionWithinBlock: { required: false, type: () => Number }, coAdvisor: { required: false, type: () => String }, status: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, mainAuthor: { required: true, type: () => t["./presentation-block/dto/response-presentation-block.dto"].ResponseUserDto }, advisor: { required: true, type: () => t["./presentation-block/dto/response-presentation-block.dto"].ResponseUserDto, nullable: true } }, "ResponsePanelistDto": { id: { required: true, type: () => String }, presentationBlockId: { required: true, type: () => String }, userId: { required: true, type: () => String }, status: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, user: { required: true, type: () => t["./presentation-block/dto/response-presentation-block.dto"].ResponseUserDto } }, "ResponseUserDto": { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, profile: { required: true, type: () => Object }, level: { required: true, type: () => Object }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } }, "availablePositionsWithInBlockDto": { positionWithinBlock: { required: true, type: () => Number }, startTime: { required: true, type: () => Date } }, "ResponsePresentationBlockDto": { id: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, roomId: { required: true, type: () => String }, type: { required: true, type: () => Object }, title: { required: true, type: () => String }, speakerName: { required: true, type: () => String }, startTime: { required: true, type: () => Date }, duration: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, presentations: { required: true, type: () => [t["./presentation-block/dto/response-presentation-block.dto"].ResponsePresentationDto] }, panelists: { required: true, type: () => [t["./presentation-block/dto/response-presentation-block.dto"].ResponsePanelistDto] }, availablePositionsWithInBlock: { required: true, type: () => [t["./presentation-block/dto/response-presentation-block.dto"].availablePositionsWithInBlockDto] } } }], [import("./evaluation/dto/create-evaluation.dto"), { "CreateEvaluationDto": { userId: { required: true, type: () => String }, submissionId: { required: true, type: () => String }, evaluationCriteriaId: { required: true, type: () => String }, score: { required: true, type: () => Number }, comments: { required: false, type: () => String } } }], [import("./room/dto/create-room.dto"), { "CreateRoomDto": { eventEditionId: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: false, type: () => String } } }], [import("./room/dto/update-room.dto"), { "UpdateRoomDto": {} }], [import("./guidance/dto/create-guidance.dto"), { "CreateGuidanceDto": { summary: { required: true, type: () => String }, authorGuidance: { required: true, type: () => String }, reviewerGuidance: { required: true, type: () => String }, audienceGuidance: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String } } }], [import("./guidance/dto/update-guidance.dto"), { "UpdateGuidanceDto": {} }], [import("./guidance/dto/response-guidance.dto"), { "ResponseGuidanceDto": { id: { required: true, type: () => String }, summary: { required: true, type: () => String }, authorGuidance: { required: true, type: () => String }, reviewerGuidance: { required: true, type: () => String }, audienceGuidance: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./awarded-panelists/dto/create-awarded-panelists.dto"), { "CreateAwardedPanelistDto": { userId: { required: true, type: () => String } }, "CreateAwardedPanelistsDto": { eventEditionId: { required: true, type: () => String }, panelists: { required: true, type: () => [t["./awarded-panelists/dto/create-awarded-panelists.dto"].CreateAwardedPanelistDto], minItems: 1 } } }], [import("./awarded-panelists/dto/response-panelist-users.dto"), { "ResponsePanelistUserDto": { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, registrationNumber: { required: false, type: () => String }, profile: { required: true, type: () => Object }, level: { required: true, type: () => Object }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, isVerified: { required: true, type: () => Boolean } } }], [import("./awarded-panelists/dto/create-awarded-panelists-response.dto"), { "CreateAwardedPanelistsResponseDto": { newAwardedPanelists: { required: true, type: () => [String] }, alreadyAwardedPanelists: { required: true, type: () => [String] } } }], [import("./awarded-doctoral-students/dto/reponse-awarded-doctoral-students.dto"), { "UserDto": { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, registrationNumber: { required: false, type: () => String, nullable: true }, photoFilePath: { required: false, type: () => String, nullable: true }, profile: { required: true, type: () => Object }, level: { required: true, type: () => Object }, isActive: { required: true, type: () => Boolean }, isVerified: { required: true, type: () => Boolean } }, "SubmissionDto": { id: { required: true, type: () => String }, title: { required: true, type: () => String }, abstract: { required: true, type: () => String }, pdfFile: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, coAdvisor: { required: false, type: () => String }, status: { required: true, type: () => Object }, mainAuthor: { required: true, type: () => t["./awarded-doctoral-students/dto/reponse-awarded-doctoral-students.dto"].UserDto } }, "RankingResponseDtoDto": { id: { required: true, type: () => String }, presentationBlockId: { required: true, type: () => String }, positionWithinBlock: { required: true, type: () => Number }, status: { required: true, type: () => Object }, publicAverageScore: { required: true, type: () => Number, nullable: true }, evaluatorsAverageScore: { required: true, type: () => Number, nullable: true }, submission: { required: true, type: () => t["./awarded-doctoral-students/dto/reponse-awarded-doctoral-students.dto"].SubmissionDto } } }], [import("./evaluation/dto/update-evaluation.dto"), { "UpdateEvaluationDto": { score: { required: true, type: () => Number }, comments: { required: false, type: () => String } } }], [import("./s3-utils/dto/create-s3-util.dto"), { "CreateS3UtilDto": {} }], [import("./s3-utils/dto/update-s3-util.dto"), { "UpdateS3UtilDto": {} }], [import("./user/dto/update-user.dto"), { "UpdateUserDto": {} }]], "controllers": [[import("./app.controller"), { "AppController": { "getServerStatus": { type: String } } }], [import("./auth/auth.controller"), { "AuthController": { "signIn": {}, "forgotPassword": {}, "resetPassword": {} } }], [import("./user/user.controller"), { "UserController": { "create": { type: t["./user/dto/response-user.dto"].ResponseUserDto }, "setAdmin": { type: t["./user/dto/response-user.dto"].ResponseUserDto }, "setSuperAdmin": { type: t["./user/dto/response-user.dto"].ResponseUserDto }, "remove": {}, "activateUser": {}, "getUsers": { type: [t["./user/dto/response-user.dto"].ResponseUserDto] }, "getAdvisors": { type: [t["./user/dto/response-user.dto"].ResponseUserDto] }, "confirmEmail": {} } }], [import("./mailing/mailing.controller"), { "MailingController": { "contact": { type: t["./mailing/mailing.dto"].ContactResponseDto }, "send": { type: t["./mailing/mailing.dto"].DefaultEmailResponseDto } } }], [import("./event-edition/event-edition.controller"), { "EventEditionController": { "create": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "createFromEventEditionForm": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "updateFromEventEditionForm": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "getAll": { type: [t["./event-edition/dto/event-edition-response"].EventEditionResponseDto] }, "getById": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "getByYear": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "update": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "setActive": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "delete": { type: t["./event-edition/dto/event-edition-response"].EventEditionResponseDto }, "removeAdminsFromEvent": {} } }], [import("./committee-member/committee-member.controller"), { "CommitteeMemberController": { "create": { type: Object }, "findAll": { type: [t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto] }, "findOne": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto }, "update": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto }, "updateByUserAndEvent": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto }, "remove": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto }, "removeByUserAndEvent": { type: t["./committee-member/dto/response-committee-member.dto"].ResponseCommitteeMemberDto } } }], [import("./queue/queue.controller"), { "QueueController": { "send": { type: t["./queue/queue.dto"].QueueMessageResponseDto }, "sendEmailErrorMessage": { type: t["./queue/queue.dto"].QueueMessageResponseDto } } }], [import("./queue/rabbitMQ.controller"), { "RabbitMQController": { "message": { type: Object }, "emailErrorMessage": { type: Object }, "emailServerLimitMessage": { type: Object } } }], [import("./presentation/presentation.controller"), { "PresentationController": { "bookmarkedPresentations": { type: t["./presentation/dto/bookmark-presentation.dto"].BookmarkedPresentationsResponseDto }, "bookmarkedPresentation": { type: t["./presentation/dto/bookmark-presentation.dto"].BookmarkedPresentationResponseDto }, "bookmarkPresentation": { type: t["./presentation/dto/bookmark-presentation.dto"].BookmarkPresentationResponseDto }, "removePresentationBookmark": { type: t["./presentation/dto/bookmark-presentation.dto"].BookmarkedPresentationsResponseDto }, "create": {}, "createWithSubmission": { type: Object }, "findAll": { type: [t["./presentation/dto/response-presentation.dto"].PresentationResponseDto] }, "listPresentations": {}, "listAdvisedPresentations": { type: [t["./presentation/dto/list-advised-presentations.dto"].ListAdvisedPresentationsResponse] }, "findOne": { type: t["./presentation/dto/response-presentation.dto"].PresentationResponseDto }, "updatePresentationForUser": {}, "update": {}, "updateWithSubmission": {}, "remove": {}, "calculateScores": {}, "calculateAllScores": {} } }], [import("./submission/submission.controller"), { "SubmissionController": { "create": {}, "createInCurrentEvent": {}, "findAll": { type: [t["./submission/dto/response-submission.dto"].ResponseSubmissionDto] }, "findOne": { type: t["./submission/dto/response-submission.dto"].ResponseSubmissionDto }, "update": {}, "remove": {} } }], [import("./presentation-block/presentation-block.controller"), { "PresentationBlockController": { "create": {}, "findAllByEventEditionId": { type: [t["./presentation-block/dto/response-presentation-block.dto"].ResponsePresentationBlockDto] }, "findAll": { type: [t["./presentation-block/dto/response-presentation-block.dto"].ResponsePresentationBlockDto] }, "findOne": { type: t["./presentation-block/dto/response-presentation-block.dto"].ResponsePresentationBlockDto }, "update": {}, "remove": {}, "swapPresentations": {} } }], [import("./evaluation/evaluation.controller"), { "EvaluationController": { "create": { type: [Object] }, "find": { type: [Object] }, "findByUser": { type: [Object] }, "calculateFinalGrade": { type: Number } } }], [import("./s3-utils/s3-utils.controller"), { "S3UtilsController": { "listFiles": { type: [String] }, "uploadFile": {} } }], [import("./room/room.controller"), { "RoomController": { "create": {}, "findAll": {}, "findOne": {}, "update": {}, "remove": {} } }], [import("./guidance/guidance.controller"), { "GuidanceController": { "getGuidance": { type: t["./guidance/dto/response-guidance.dto"].ResponseGuidanceDto }, "getGuidanceById": { type: t["./guidance/dto/response-guidance.dto"].ResponseGuidanceDto }, "deleteGuidance": {}, "createGuidance": { type: t["./guidance/dto/response-guidance.dto"].ResponseGuidanceDto }, "updateActiveGuidance": {}, "updateGuidance": { type: t["./guidance/dto/response-guidance.dto"].ResponseGuidanceDto } } }], [import("./awarded-panelists/awarded-panelists.controller"), { "AwardedPanelistsController": { "registerAwardedPanelists": { type: t["./awarded-panelists/dto/create-awarded-panelists-response.dto"].CreateAwardedPanelistsResponseDto }, "findAll": { type: [t["./awarded-panelists/dto/response-panelist-users.dto"].ResponsePanelistUserDto] }, "findAllPanelists": { type: [t["./awarded-panelists/dto/response-panelist-users.dto"].ResponsePanelistUserDto] }, "remove": {} } }], [import("./awarded-doctoral-students/awarded-doctoral-students.controller"), { "AwardedDoctoralStudentsController": { "getTopPanelistsRanking": { type: [t["./awarded-doctoral-students/dto/reponse-awarded-doctoral-students.dto"].RankingResponseDtoDto] }, "getTopAudienceRanking": { type: [t["./awarded-doctoral-students/dto/reponse-awarded-doctoral-students.dto"].RankingResponseDtoDto] } } }], [import("./evaluation-criteria/evaluation-criteria.controller"), { "EvaluationCriteriaController": { "findAll": {} } }], [import("./certificate/certificate.controller"), { "CertificateController": { "helloWorld": {} } }]] } };
};