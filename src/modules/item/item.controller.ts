import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemsByUserDto } from './dto/get-items-by-user.dto';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createItem(@Body() createItemDto: CreateItemDto) {
    return this.itemService.createItem(createItemDto.title);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  async getItemsByUser(@Query() query: GetItemsByUserDto) {
    return this.itemService.getItemsByUser(query.username);
  }
}
