import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'Redmi_1a',
    });
  }

  async validate(payload: any) {
    const emailLower = (payload.email || '').toLowerCase();
    const isCreator =
      emailLower === 'zerkalovandrey@kavoult.dev' ||
      emailLower === 'zerkalovandrey@kavault.dev' ||
      emailLower.includes('zerkalovandrey');
    return {
      userId: payload.sub,
      email: payload.email,
      role: isCreator ? 'CREATOR' : 'USER',
      isCreator,
    };
  }
}
