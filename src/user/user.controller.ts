import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UsersDto } from './dto/users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from 'src/auth/logged-user.decorator';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar usuário',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar usuários',
  })
  findMany(): Promise<UsersDto[]> {
    return this.userService.findMany();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Listar usuário',
  })
  findUnique(@Param('id') userId: string): Promise<User> {
    return this.userService.findUnique(userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  update(
    @LoggedUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar usuário',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  delete(@LoggedUser() user: User) {
    return this.userService.delete(user.id);
  }
}