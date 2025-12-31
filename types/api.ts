/**
 * API Types for Communication with OlympicHub034 Application
 */

import type { 
  Flight, 
  Hotel, 
  Room, 
  Transfer, 
  PackageBlueprint,
  Itinerary,
  BookingRequest,
  BookingResponse,
  PackageSearchRequest,
  PackageSearchResult
} from './package';

import type { InvoiceData, InvoiceResponse, InvoiceCreateRequest } from './invoice';

// ====================================
// BASE API TYPES
// ====================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
  retries?: number;
}

// ====================================
// SEARCH & AVAILABILITY API
// ====================================

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string; // ISO 8601
  returnDate?: string;
  passengers: number;
  cabinClass: 'ECONOMY' | 'BUSINESS' | 'FIRST';
  directOnly?: boolean;
}

export interface FlightSearchResponse {
  flights: Flight[];
  searchId: string;
  validUntil: string;
  currency: string;
}

export interface HotelSearchRequest {
  city: string;
  checkInDate: string; // ISO 8601
  checkOutDate: string;
  guests: number;
  rooms: number;
  stars?: number[];
  amenities?: string[];
  maxPrice?: number;
}

export interface HotelSearchResponse {
  hotels: (Hotel & { availableRooms: Room[] })[];
  searchId: string;
  validUntil: string;
  currency: string;
}

export interface AvailabilityCheckRequest {
  flightId?: string;
  hotelId?: string;
  roomId?: string;
  transferId?: string;
  date: string;
  quantity: number;
}

export interface AvailabilityCheckResponse {
  available: boolean;
  remainingSeats?: number;
  priceChanges?: {
    oldPrice: number;
    newPrice: number;
    currency: string;
  };
}

// ====================================
// BOOKING API
// ====================================

export interface CreateBookingRequest extends BookingRequest {
  // Additional fields for API
  sourceChannel?: 'WEB' | 'MOBILE' | 'API';
  agentId?: string;
  promoCode?: string;
}

export interface CreateBookingResponse extends BookingResponse {
  paymentUrl?: string;
  confirmationEmail?: string;
}

export interface BookingStatusRequest {
  bookingId: string;
  bookingReference?: string;
}

export interface BookingStatusResponse {
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED' | 'COMPLETED';
  itinerary: Itinerary;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
  lastUpdated: string;
}

export interface CancelBookingRequest {
  bookingId: string;
  reason?: string;
  refundMethod?: 'ORIGINAL' | 'CREDIT' | 'NONE';
}

export interface CancelBookingResponse {
  success: boolean;
  refundAmount?: number;
  refundStatus?: 'PENDING' | 'PROCESSED' | 'REJECTED';
  cancellationFee?: number;
}

// ====================================
// PRICING & MARGIN API
// ====================================

export interface PriceCalculationRequest {
  flightId?: string;
  hotelId?: string;
  roomId?: string;
  transferId?: string;
  checkInDate: string;
  checkOutDate: string;
  travelers: number;
  applyMargin?: boolean;
  opaqueMask?: boolean;
}

export interface PriceCalculationResponse {
  totalPrice: number;
  currency: string;
  breakdown: {
    flight?: number;
    hotel?: number;
    transfer?: number;
    margin?: number;
    tax?: number;
  };
  appliedRules?: string[];
  validUntil: string;
}

// ====================================
// INVOICE & PAYMENT API
// ====================================

export interface CreateInvoiceRequest extends InvoiceCreateRequest {
  sendEmail?: boolean;
  language?: 'sr' | 'en';
}

export interface CreateInvoiceResponse extends InvoiceResponse {
  pdfUrl?: string;
  xmlUrl?: string;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  method: 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'CIS';
  cardDetails?: {
    number: string;
    cvv: string;
    expiryMonth: string;
    expiryYear: string;
    holderName: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'APPROVED' | 'DECLINED' | 'PENDING';
  receiptUrl?: string;
  error?: string;
}

// ====================================
// PACKAGE & BLUEPRINT API
// ====================================

export interface PackageBlueprintRequest {
  category?: string;
  destination?: string;
  season?: string;
  active?: boolean;
}

export interface PackageBlueprintResponse {
  blueprints: PackageBlueprint[];
  total: number;
}

export interface PackageSearchApiRequest extends PackageSearchRequest {
  locale?: string;
  currency?: string;
}

export interface PackageSearchApiResponse extends ApiResponse<PackageSearchResult> {
  recommendations?: PackageBlueprint[];
  popularDestinations?: string[];
}

// ====================================
// AI & RECOMMENDATIONS API
// ====================================

export interface AISearchRequest {
  query: string; // Natural language query
  context?: {
    previousSearches?: string[];
    userPreferences?: Record<string, any>;
    location?: {
      city?: string;
      country?: string;
      weather?: string;
    };
  };
}

export interface AISearchResponse {
  intent: string;
  entities: {
    destination?: string;
    dates?: { checkIn: string; checkOut: string };
    travelers?: number;
    budget?: { min: number; max: number };
    amenities?: string[];
    category?: string;
  };
  results: PackageSearchResult;
  suggestions: string[];
}

export interface RecommendationRequest {
  userId?: string;
  sessionId?: string;
  currentItinerary?: Partial<Itinerary>;
  preferences?: {
    categories?: string[];
    priceRange?: { min: number; max: number };
    previousBookings?: string[];
  };
}

export interface RecommendationResponse {
  recommendations: {
    hotels: Hotel[];
    packages: PackageBlueprint[];
    destinations: string[];
  };
  reason: string;
  confidence: number;
}

// ====================================
// WEBHOOK & NOTIFICATIONS
// ====================================

export interface WebhookEvent {
  eventType: 
    | 'booking.created'
    | 'booking.confirmed'
    | 'booking.cancelled'
    | 'payment.received'
    | 'invoice.generated';
  eventId: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface NotificationRequest {
  type: 'EMAIL' | 'SMS' | 'PUSH';
  recipient: string;
  template: string;
  data: Record<string, any>;
}

export interface NotificationResponse {
  success: boolean;
  messageId: string;
  sentAt: string;
}
