import {
  ConsultationMode,
  EducationEntry,
  AvailabilitySchedule,
} from '../../database/entities/doctor.entity';

export interface DoctorListItem {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  bio: string | null;
  consultationFee: number;
  languages: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  city: string | null;
  consultationMode: ConsultationMode;
  isAvailableToday: boolean;
  createdAt: Date;
}

export interface DoctorDetailResponse extends DoctorListItem {
  licenseNumber: string;
  education: EducationEntry[];
  availabilitySchedule: AvailabilitySchedule;
  updatedAt: Date;
}

export interface TimeSlotResponse {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
