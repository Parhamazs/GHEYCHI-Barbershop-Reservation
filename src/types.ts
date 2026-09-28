// TypeScript Type Definitions for Gheychi (قیچی)

export type UserRole = 'customer' | 'barber' | 'admin';

export type AppointmentStatus =
  | 'available'       // White in UI
  | 'pending_payment' // Temporary 15m Redis lock
  | 'reserved_paid'   // Green in UI
  | 'reserved_manual' // Yellow in UI (Phone / Walk-in)
  | 'expired_unpaid'; // Red warning trigger

export interface User {
  id: string;
  email: string;
  fullName: string;
  fullNameFa?: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface BarberImage {
  id: string;
  barberProfileId: string;
  imageUrl: string;
  caption: string;
  captionFa?: string;
  displayOrder: number;
}

export interface BarberProfile {
  id: string;
  userId: string;
  barberName: string;
  barberNameFa?: string;
  shopName: string;
  shopNameFa?: string;
  bio: string;
  bioFa?: string;
  phoneNumber: string;
  address: string;
  addressFa?: string;
  latitude: number;
  longitude: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  slotDurationMinutes: number;
  pricePerSlot: number;
  services: string[];
  servicesFa?: string[];
  images: BarberImage[]; // Max 4 images
  ratingAvg: number;
  reviewCount: number;
  distanceKm?: number;
}

export interface ScheduleTemplateSlot {
  id: string;
  templateId: string;
  startTime: string; // "09:00"
  endTime: string;   // "09:30"
}

export interface ScheduleTemplate {
  id: string;
  barberProfileId: string;
  name: string;
  nameFa?: string;
  isDefault: boolean;
  slots: ScheduleTemplateSlot[];
}

export interface Appointment {
  id: string;
  barberProfileId: string;
  customerId?: string;
  customerName?: string;
  customerNameFa?: string;
  customerPhone?: string;
  slotDate: string; // YYYY-MM-DD
  startTime: string; // "09:00"
  endTime: string;   // "09:30"
  status: AppointmentStatus;
  serviceName: string;
  serviceNameFa?: string;
  price: number;
  manualNotes?: string;
  manualNotesFa?: string;
  lockExpiresAt?: number; // timestamp ms for 15-minute countdown
  reservedAt?: string;
}

export interface Review {
  id: string;
  barberProfileId: string;
  customerId: string;
  customerName: string;
  customerNameFa?: string;
  rating: number; // 1-5
  comment: string;
  commentFa?: string;
  createdAt: string;
  createdAtFa?: string;
  timestamp?: number; // epoch ms for robust sorting
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastDetails {
  barberName?: string;
  shopName?: string;
  slotDate?: string;
  slotTime?: string;
  price?: number;
}

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  titleFa?: string;
  message: string;
  messageFa?: string;
  durationMs?: number;
  createdAt: number;
  actionLabel?: string;
  actionLabelFa?: string;
  onAction?: () => void;
  details?: ToastDetails;
}

