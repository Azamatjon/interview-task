import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    // Check if the username is already taken (optional)
    const existingUser = await this.userService.findUserByUsername(
      createUserDto.username,
    );
    if (existingUser) {
      throw new BadRequestException('Username is already taken');
    }

    return this.userService.createUser(createUserDto.username);
  }
}
