import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { UserLevel } from '@prisma/client';
import { Public, UserLevels } from '../auth/decorators/user-level.decorator';

@Controller('room')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Public()
  @Get('event-edition/:eventEditionId')
  findAll(@Param('eventEditionId') eventEditionId: string) {
    return this.roomService.findAllByEventEditionId(eventEditionId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
