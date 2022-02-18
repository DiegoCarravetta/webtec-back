import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { UsersDto } from './dto/users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userEmailExist = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userEmailExist) {
      throw new ConflictException('E-mail já cadastrado');
    }

    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new ConflictException('Senhas não conferem');
    }

    delete createUserDto.passwordConfirmation;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    delete createdUser.password;

    return createdUser;
  }

  async findMany(): Promise<UsersDto[]> {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        birthDate: true,
        office: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  }

  async findUnique(userId: string): Promise<User> {
    const userFinded = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userFinded) {
      throw new NotFoundException('Usuário não encontrado');
    }

    delete userFinded.password;

    return userFinded;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userFinded = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userFinded) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.email) {
      const emailExists = await this.prismaService.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });

      if (emailExists) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    const updateUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        name: updateUserDto.name,
        birthDate: updateUserDto.birthDate,
        office: updateUserDto.office,
        email: updateUserDto.email,
      },
    });

    delete updateUser.password;

    return updateUser;
  }

  async delete(userId: string) {
    const userFinded = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userFinded) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const deleteUser = await this.prismaService.user.delete({
      where: {
        id: userId,
      },
    });

    return deleteUser;
  }
}