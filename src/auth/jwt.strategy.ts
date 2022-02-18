/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { jwtConstants } from './jwt.constants';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { email: string }) {
    const valitedUser = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });

    if (!valitedUser) {
      throw new NotFoundException('Usuário não encontrado ou não autenticado');
    }

    return valitedUser;
  }
}