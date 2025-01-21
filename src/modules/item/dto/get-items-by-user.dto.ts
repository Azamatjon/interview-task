import { IsNotEmpty } from 'class-validator';

export class GetItemsByUserDto {
  @IsNotEmpty({ message: 'Username should not be empty' })
  username: string;
}
