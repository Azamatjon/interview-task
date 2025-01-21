import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { Group } from '../../entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export if other modules need this service
})
export class UserModule {}
