import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entities/group.entity';
import { Item } from '../../entities/item.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createGroup(title: string): Promise<Group> {
    const group = this.groupRepository.create({ title });
    return this.groupRepository.save(group);
  }

  async addItemToGroup(groupId: number, itemId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['items'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID "${groupId}" not found.`);
    }

    const item = await this.itemRepository.findOne({ where: { id: itemId } });

    if (!item) {
      throw new NotFoundException(`Item with ID "${itemId}" not found.`);
    }

    group.items!.push(item);
    return this.groupRepository.save(group);
  }

  async addUserToGroup(groupId: number, userId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID "${groupId}" not found.`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    group.users!.push(user);
    return this.groupRepository.save(group);
  }
}
