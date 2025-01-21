import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group } from '../../entities/group.entity';
import { Item } from '../../entities/item.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Item, User])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService], // Export if other modules need this service
})
export class GroupModule {}
