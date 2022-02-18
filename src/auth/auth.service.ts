import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginInputDto } from './dto/login-input.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginInputDto: LoginInputDto): Promise<LoginResponseDto> {
    const { email, password } = loginInputDto;

    const userExists = await this.prismaService.user.findUnique({
      where: { email: loginInputDto.email },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const isHashValid = await bcrypt.compare(password, userExists.password);

    if (!isHashValid) {
      throw new UnauthorizedException('Credencias inválidas');
    }

    delete userExists.password;

    return {
      token: this.jwtService.sign({ email }),
      user: userExists,
    };
  }
}