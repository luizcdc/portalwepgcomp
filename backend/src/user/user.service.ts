import { Injectable } from '@nestjs/common';
import { RegisterStudentRequestDto, RegisterStudentResponseDto, RegisterTeacherRequestDto, RegisterTeacherResponseDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    async registerStudent(createStudentDto: RegisterStudentRequestDto): Promise<RegisterStudentResponseDto> {
        const newStudent: RegisterStudentResponseDto = {
            id: uuidv4(),
            ...createStudentDto,
            status: 'Pendente',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return newStudent;
    }

    async registerTeacher(createTeacherDto: RegisterTeacherRequestDto): Promise<RegisterTeacherResponseDto> {
        const newTeacher: RegisterTeacherResponseDto = {
            id: uuidv4(),
            ...createTeacherDto,
            status: 'Pendente',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return newTeacher;
    }
}
