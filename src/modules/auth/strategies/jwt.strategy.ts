import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { JwtPayload } from '../../../common/types/jwt-payload.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // DB lookup ensures revoked/disabled accounts are rejected on every request.
    // For very high-traffic scenarios, replace with a Redis cache of active user IDs.
    const user = await this.userRepo.findOne({
      where: { id: payload.sub, isActive: true },
      select: { id: true, phone: true, role: true, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'User not found or account has been deactivated.',
      });
    }

    // This return value is attached to request.user by Passport
    return { sub: user.id, phone: user.phone, role: user.role };
  }
}
