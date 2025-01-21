import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto.title);
  }

  @Put('/:groupId/items/:itemId')
  async addItemToGroup(
    @Param('groupId') groupId: number,
    @Param('itemId') itemId: number,
  ) {
    return this.groupService.addItemToGroup(groupId, itemId);
  }

  @Put('/:groupId/users/:userId')
  async addUserToGroup(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ) {
    return this.groupService.addUserToGroup(groupId, userId);
  }
}
