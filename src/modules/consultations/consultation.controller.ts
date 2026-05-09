import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.types';
import {
  ConsultationJoinResponse,
  ConsultationService,
  ConsultationStatusResponse,
} from './consultation.service';
import {
  JoinConsultationResponseDto,
  ConsultationStatusDto,
} from './dto/join-consultation.dto';

@ApiTags('consultations')
@ApiBearerAuth('access-token')
@Controller('v1/consultations')
export class ConsultationController {
  private readonly logger = new Logger(ConsultationController.name);

  constructor(private readonly consultationService: ConsultationService) {}

  // ── POST /api/v1/consultations/:appointmentId/join ────────────────────────

  /**
   * Issue a short-lived room JWT and return ICE server credentials.
   * The caller must be the patient or doctor of the appointment.
   */
  @Post(':appointmentId/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Join a video consultation room',
    description:
      'Returns a room token (2 hr JWT) and WebRTC ICE server config. ' +
      'Caller must be the patient or the doctor of the appointment.',
  })
  @ApiParam({ name: 'appointmentId', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, type: JoinConsultationResponseDto })
  @ApiResponse({ status: 403, description: 'Not a participant' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  join(
    @CurrentUser() user: JwtPayload,
    @Param('appointmentId', new ParseUUIDPipe({ version: '4' }))
    appointmentId: string,
  ): Promise<ConsultationJoinResponse> {
    this.logger.log(
      `POST /v1/consultations/${appointmentId}/join user=${user.sub}`,
    );
    return this.consultationService.join(user.sub, appointmentId);
  }

  // ── GET /api/v1/consultations/:appointmentId/status ───────────────────────

  /**
   * Return the live room status (waiting / active / ended), current
   * participant count, and call start time — all sourced from Redis.
   */
  @Get(':appointmentId/status')
  @ApiOperation({
    summary: 'Get live consultation status',
    description:
      'Reads from Redis. Returns "ended" with 0 participants when no ' +
      'active room key exists.',
  })
  @ApiParam({ name: 'appointmentId', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, type: ConsultationStatusDto })
  @ApiResponse({ status: 403, description: 'Not a participant' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  getStatus(
    @CurrentUser() user: JwtPayload,
    @Param('appointmentId', new ParseUUIDPipe({ version: '4' }))
    appointmentId: string,
  ): Promise<ConsultationStatusResponse> {
    this.logger.log(
      `GET /v1/consultations/${appointmentId}/status user=${user.sub}`,
    );
    return this.consultationService.getStatus(user.sub, appointmentId);
  }
}
