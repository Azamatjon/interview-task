import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Item } from './item.entity';
import { User } from './user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @ManyToMany(() => Item, (item) => item.groups, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  items?: Item[];

  @ManyToMany(() => User, (user) => user.groups, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  users?: User[];
}
