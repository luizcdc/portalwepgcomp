import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterStudentRequestDto, RegisterStudentResponseDto, RegisterTeacherRequestDto, RegisterTeacherResponseDto } from './user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register/student')
    async registerStudent(@Body() registerStudentDto: RegisterStudentRequestDto): Promise<RegisterStudentResponseDto> {
        return await this.userService.registerStudent(registerStudentDto);
    }

    @Post('register/teacher')
    async registerTeacher(@Body() registerTeacherDto: RegisterTeacherRequestDto): Promise<RegisterTeacherResponseDto> {
        return await this.userService.registerTeacher(registerTeacherDto);
    }
}
