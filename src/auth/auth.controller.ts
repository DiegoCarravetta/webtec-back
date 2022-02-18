import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { LoggedUser } from './logged-user.decorator';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'Fazer login',
  })
  login(@Body() loginInputDto: LoginInputDto): Promise<LoginResponseDto> {
    return this.authService.login(loginInputDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Perfil logado',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  me(@LoggedUser() user: User) {
    return user;
  }
}