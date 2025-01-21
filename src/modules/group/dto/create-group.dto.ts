import { IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;
}
