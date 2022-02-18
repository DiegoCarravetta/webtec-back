/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsNotEmpty, } from 'class-validator';

export class UsersDto {
  id: string;
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

}