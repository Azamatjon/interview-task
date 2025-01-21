import { Group } from './group.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @ManyToMany(() => Group, (group) => group.users, { nullable: true })
  groups?: Group[];
}
