import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard, PayloadRequest } from 'src/auth/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  findOne(@Request() req: PayloadRequest) {
    return this.userService.findOne(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@Request() req: PayloadRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete()
  remove(@Request() req: PayloadRequest) {
    return this.userService.remove(req.user.id);
  }
}
