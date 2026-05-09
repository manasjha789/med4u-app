import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Public } from '../../common/decorators/public.decorator';
import { Appointment, AppointmentStatus, AppointmentType } from '../../database/entities/appointment.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { Generic } from '../../database/entities/generic.entity';
import { Medicine } from '../../database/entities/medicine.entity';
import { TimeSlot } from '../../database/entities/time-slot.entity';
import { User, UserRole } from '../../database/entities/user.entity';
import { Variant } from '../../database/entities/variant.entity';
import { TokenService } from '../auth/token.service';

@Controller('debug')
export class DebugController {
  constructor(
    @InjectRepository(Doctor) private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Medicine) private readonly medicineRepo: Repository<Medicine>,
    @InjectRepository(Generic) private readonly genericRepo: Repository<Generic>,
    @InjectRepository(Variant) private readonly variantRepo: Repository<Variant>,
    @InjectRepository(Appointment) private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(TimeSlot) private readonly slotRepo: Repository<TimeSlot>,
    private readonly tokenService: TokenService,
  ) {}

  // ── GET /api/debug/db-status ──────────────────────────────────────────────

  @Public()
  @Get('db-status')
  async dbStatus() {
    const [doctor_count, medicine_count, generic_count, variant_count, sample_doctors, sample_medicines] =
      await Promise.all([
        this.doctorRepo.count(),
        this.medicineRepo.count(),
        this.genericRepo.count(),
        this.variantRepo.count(),
        this.doctorRepo.find({ relations: ['user'], take: 3 }),
        this.medicineRepo.find({ relations: ['generic'], take: 3 }),
      ]);

    return {
      doctor_count,
      medicine_count,
      generic_count,
      variant_count,
      sample_doctors: sample_doctors.map((d) => ({
        id: d.id,
        userId: d.userId,
        name: d.user?.name ?? '(no user)',
        specialization: d.specialization,
        city: d.city,
        isVerified: d.isVerified,
      })),
      sample_medicines: sample_medicines.map((m) => ({
        id: m.id,
        name: m.name,
        manufacturer: m.manufacturer,
        generic: m.generic?.name ?? '(none)',
      })),
    };
  }

  // ── GET /api/debug/users ─────────────────────────────────────────────────

  @Public()
  @Get('users')
  async getUsers() {
    const users = await this.userRepo.find({ take: 10, order: { createdAt: 'DESC' } });
    return users.map((u) => ({ id: u.id, phone: u.phone, name: u.name, role: u.role }));
  }

  // ── POST /api/debug/test-appointment ─────────────────────────────────────
  // Creates a video appointment for testing. Pass patientId (from login) and
  // optionally doctorId. Returns the appointmentId to use in the video call.

  @Public()
  @Post('test-appointment')
  async createTestAppointment(
    @Body() body: { patientId: string; doctorId?: string },
  ) {
    // Find or use provided doctor
    const doctor = body.doctorId
      ? await this.doctorRepo.findOne({ where: { id: body.doctorId } })
      : await this.doctorRepo.findOne({ where: {} });

    if (!doctor) {
      return { error: 'No doctors found in the database. Run the seed script first.' };
    }

    // Create a test time slot for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const slot = await this.slotRepo.save(
      this.slotRepo.create({
        doctorId: doctor.id,
        date: new Date(dateStr),
        startTime: '10:00',
        endTime: '10:30',
        isBooked: true,
      }),
    );

    // Create the appointment
    const appointment = await this.appointmentRepo.save(
      this.appointmentRepo.create({
        patientId: body.patientId,
        doctorId: doctor.id,
        slotId: slot.id,
        appointmentDate: new Date(`${dateStr}T10:00:00`),
        type: AppointmentType.VIDEO,
        status: AppointmentStatus.CONFIRMED,
        notes: 'Test appointment for video call development',
      }),
    );

    return {
      appointmentId: appointment.id,
      doctorId: doctor.id,
      patientId: body.patientId,
      message: 'Use appointmentId in your VideoConsult navigation call.',
    };
  }

  // ── POST /api/debug/full-setup ────────────────────────────────────────────
  // One-shot dev helper: finds/creates a patient user, issues real JWT tokens,
  // and creates a test video appointment. Returns everything the app needs.

  @Public()
  @Post('full-setup')
  async fullSetup(@Body() body: { phone: string }) {
    const phone = body.phone.startsWith('+') ? body.phone : `+91${body.phone.replace(/\D/g, '')}`;

    // Find or create patient user
    let user = await this.userRepo.findOne({ where: { phone } });
    if (!user) {
      user = await this.userRepo.save(
        this.userRepo.create({
          phone,
          name: 'Dev User',
          role: UserRole.PATIENT,
          isActive: true,
          isVerified: true,
        }),
      );
    }

    // Get a doctor
    const doctor = await this.doctorRepo.findOne({ where: {}, relations: ['user'] });
    if (!doctor) {
      return { error: 'No doctors found. Run the seed script first.' };
    }

    // Create test time slot
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const slot = await this.slotRepo.save(
      this.slotRepo.create({
        doctorId: doctor.id,
        date: new Date(dateStr),
        startTime: '10:00',
        endTime: '10:30',
        isBooked: true,
      }),
    );

    // Create test appointment
    const appointment = await this.appointmentRepo.save(
      this.appointmentRepo.create({
        patientId: user.id,
        doctorId: doctor.id,
        slotId: slot.id,
        appointmentDate: new Date(`${dateStr}T10:00:00`),
        type: AppointmentType.VIDEO,
        status: AppointmentStatus.CONFIRMED,
        notes: 'Dev test appointment',
      }),
    );

    // Generate real JWT tokens
    const tokens = await this.tokenService.generateTokenPair(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: user.id, phone: user.phone, name: user.name, role: user.role },
      appointmentId: appointment.id,
      doctorId: doctor.id,
      doctorName: doctor.user?.name ?? 'Dr. Doctor',
    };
  }
}
