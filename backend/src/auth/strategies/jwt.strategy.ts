import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token do header Authorization: Bearer <token>
      ignoreExpiration: false, // O token expira automaticamente
      secretOrKey: jwtConstants.secret, // Use uma chave secreta no .env
    });
  }

  async validate(payload: any) {
    // Retorna os dados do payload (serão injetados no request.user)
    return {
      userId: payload.userId,
      email: payload.email,
      level: payload.level,
    };
  }
}
