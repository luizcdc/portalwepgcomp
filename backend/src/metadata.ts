/* eslint-disable */
export default async () => {
    const t = {
        ["./user/dto/create-user.dto"]: await import("./user/dto/create-user.dto"),
        ["./user/dto/response-user.dto"]: await import("./user/dto/response-user.dto"),
        ["./mailing/mailing.dto"]: await import("./mailing/mailing.dto"),
        ["./queue/queue.dto"]: await import("./queue/queue.dto"),
        ["./presentation-block/dto/response-presentation-block.dto"]: await import("./presentation-block/dto/response-presentation-block.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./auth/auth.dto"), { "SignInDto": { email: { required: true, type: () => String }, password: { required: true, type: () => String } }, "ForgotPasswordDto": { email: { required: true, type: () => String, format: "email" } }, "ResetPasswordDto": { newPassword: { required: true, type: () => String } } }], [import("./user/dto/create-user.dto"), { "CreateUserDto": { name: { required: true, type: () => String, minLength: 1, maxLength: 255 }, email: { required: true, type: () => String, format: "email", minLength: 1, maxLength: 255 }, password: { required: true, type: () => String, minLength: 1, maxLength: 255 }, registrationNumber: { required: false, type: () => String, minLength: 1, maxLength: 20 }, photoFilePath: { required: false, type: () => String, minLength: 1, maxLength: 255 }, profile: { required: false, enum: t["./user/dto/create-user.dto"].Profile }, level: { required: false, enum: t["./user/dto/create-user.dto"].UserLevel }, isActive: { required: false, type: () => Boolean } } }], [import("./user/dto/response-user.dto"), { "ResponseUserDto": { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, registrationNumber: { required: false, type: () => String }, photoFilePath: { required: false, type: () => String }, profile: { required: true, type: () => Object }, level: { required: true, type: () => Object }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./mailing/mailing.dto"), { "DefaultEmailDto": { from: { required: true, type: () => String }, to: { required: true, type: () => String, format: "email" }, subject: { required: true, type: () => String }, text: { required: true, type: () => String } }, "DefaultEmailResponseDto": { message: { required: true, type: () => String } }, "ContactRequestDto": { name: { required: true, type: () => String }, email: { required: true, type: () => String, format: "email" }, text: { required: true, type: () => String } }, "ContactResponseDto": { message: { required: true, type: () => String } } }], [import("./queue/queue.dto"), { "QueueMessageDto": { id: { required: true, type: () => String } }, "ContactEmailErrorMessageDto": { error: { required: true, type: () => String }, from: { required: true, type: () => String }, text: { required: true, type: () => String }, retries: { required: true, type: () => Number } }, "ContactEmailServerLimitMessageDto": { from: { required: true, type: () => String }, text: { required: true, type: () => String }, retries: { required: true, type: () => Number } }, "QueueMessageResponseDto": { message: { required: false, type: () => String }, error: { required: false, type: () => String } } }], [import("./presentation-block/dto/create-presentation-block.dto"), { "CreatePresentationBlockDto": { eventEditionId: { required: true, type: () => String }, roomId: { required: false, type: () => String }, type: { required: true, type: () => Object }, title: { required: false, type: () => String }, speakerName: { required: false, type: () => String, minLength: 2 }, startTime: { required: true, type: () => Date }, duration: { required: true, type: () => Number, minimum: 5, maximum: 720 } } }], [import("./presentation-block/dto/update-presentation-block.dto"), { "UpdatePresentationBlockDto": {} }], [import("./presentation-block/dto/response-presentation-block.dto"), { "ResponsePresentationBlockDto": { id: { required: true, type: () => String }, eventEditionId: { required: true, type: () => String }, roomId: { required: false, type: () => String }, type: { required: true, type: () => Object }, title: { required: false, type: () => String }, speakerName: { required: false, type: () => String }, startTime: { required: true, type: () => Date }, duration: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./user/dto/update-user.dto"), { "UpdateUserDto": {} }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String } } }], [import("./auth/auth.controller"), { "AuthController": { "signIn": {}, "forgotPassword": {}, "resetPassword": {} } }], [import("./user/user.controller"), { "UserController": { "create": { type: t["./user/dto/response-user.dto"].ResponseUserDto } } }], [import("./mailing/mailing.controller"), { "MailingController": { "contact": { type: t["./mailing/mailing.dto"].ContactResponseDto }, "send": { type: t["./mailing/mailing.dto"].DefaultEmailResponseDto } } }], [import("./queue/queue.controller"), { "QueueController": { "send": { type: t["./queue/queue.dto"].QueueMessageResponseDto }, "sendEmailErrorMessage": { type: t["./queue/queue.dto"].QueueMessageResponseDto } } }], [import("./queue/rabbitMQ.controller"), { "RabbitMQController": { "message": { type: Object }, "emailErrorMessage": { type: Object }, "emailServerLimitMessage": { type: Object } } }], [import("./presentation-block/presentation-block.controller"), { "PresentationBlockController": { "create": {}, "findAllByEventEditionId": { type: [t["./presentation-block/dto/response-presentation-block.dto"].ResponsePresentationBlockDto] }, "findOne": { type: t["./presentation-block/dto/response-presentation-block.dto"].ResponsePresentationBlockDto }, "update": {}, "remove": {} } }]] } };
};