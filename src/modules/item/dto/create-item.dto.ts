import { IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;
}
