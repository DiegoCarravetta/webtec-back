/* eslint-disable prettier/prettier */
import { User } from '@prisma/client';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  user: User;
}