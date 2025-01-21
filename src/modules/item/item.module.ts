import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from '../../entities/item.entity';
import { User } from '../../entities/user.entity';
import { Group } from '../../entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, User, Group])],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService], // Export if other modules need this service
})
export class ItemModule {}
