import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../entities/item.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createItem(title: string): Promise<Item> {
    const item = this.itemRepository.create({ title });
    return this.itemRepository.save(item);
  }

  async getItemsByUser(username: string): Promise<string[]> {
    const items = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.groups', 'group')
      .leftJoin('group.items', 'item')
      .where('user.username = :username', { username })
      .select('DISTINCT item.title', 'title')
      .getRawMany<{ title: string }>();

    if (items.length === 0) {
      throw new NotFoundException(
        `User with username "${username}" not found or has no items.`,
      );
    }

    // Extract the titles and return
    return items.map((row) => row.title);
  }
}
