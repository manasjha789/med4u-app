import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../database/entities/user.entity';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthTokens, LoginResponse, UserProfile } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    await this.otpService.sendOtp(dto.phone);
    return { message: 'OTP sent successfully. Valid for 5 minutes.' };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
    ip?: string,
    userAgent?: string,
  ): Promise<LoginResponse> {
    await this.otpService.verifyOtp(dto.phone, dto.otp);

    let user = await this.userRepo.findOne({
      where: { phone: dto.phone },
      withDeleted: false,
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await this.userRepo.save(
        this.userRepo.create({
          phone: dto.phone,
          name: dto.phone,      // placeholder — user updates in profile
          role: UserRole.PATIENT,
          isActive: true,
          isVerified: true,
        }),
      );
    } else {
      if (!user.isActive) {
        throw new ForbiddenException({
          code: 'ACCOUNT_DISABLED',
          message: 'Your account has been disabled. Please contact support.',
        });
      }
      if (!user.isVerified) {
        await this.userRepo.update(user.id, { isVerified: true });
        user.isVerified = true;
      }
    }

    const isProfileComplete =
      user.name != null &&
      user.name !== user.phone &&
      user.dob != null &&
      user.gender != null;

    const tokens = await this.tokenService.generateTokenPair(user, ip, userAgent);
    return { ...tokens, user: this.toProfile(user), isNewUser, isProfileComplete };
  }

  async refresh(
    refreshToken: string,
    ip?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    return this.tokenService.rotateRefreshToken(refreshToken, ip, userAgent);
  }

  async logout(userId: string): Promise<void> {
    await this.tokenService.revokeAllSessions(userId);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private toProfile(user: User): UserProfile {
    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
