import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Group } from './group.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @ManyToMany(() => Group, (group) => group.items, { nullable: true })
  groups?: Group[];
}
