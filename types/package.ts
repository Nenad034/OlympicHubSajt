/**
 * Types for Travel Packages and Dynamic Packaging
 */

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
  cabinClass: 'ECONOMY' | 'BUSINESS' | 'FIRST';
}

export interface Flight {
  id: string;
  flightNumber: string;
  carrier: string;
  departureTime: Date;
  arrivalTime: Date;
  origin: string;
  destination: string;
  cabinClass: string;
  availableSeats: number;
  netPrice: number;
  currency: string;
  duration?: number; // in minutes
  stops?: number;
}

export interface HotelSearchParams {
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  rooms: number;
  stars?: number;
  amenities?: string[];
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  location: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  description?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Room {
  id: string;
  hotelId: string;
  roomType: string;
  bedCount: number;
  maxOccupancy: number;
  amenities: string[];
  pricePerNight: number;
  currency: string;
  available: boolean;
  images?: string[];
}

export interface Transfer {
  id: string;
  transferType: 'PRIVATE' | 'SHUTTLE' | 'SHARED';
  vehicleType: string;
  origin: string;
  destination: string;
  capacity: number;
  pricePerPerson: number;
  currency: string;
  available: boolean;
  duration?: number; // in minutes
}

export interface PackageBlueprint {
  id: string;
  name: string;
  description: string;
  category: 'FAMILY' | 'LUXURY' | 'BUDGET' | 'ADVENTURE' | 'ROMANTIC' | 'BUSINESS';
  duration: number;
  destinationCity: string;
  destinationCountry: string;
  season?: string;
  tags: string[];
  imageUrl?: string;
  isActive: boolean;
  startingPrice?: number;
}

export interface Itinerary {
  id: string;
  customerName?: string;
  customerEmail?: string;
  
  flight?: Flight;
  hotel?: Hotel;
  room?: Room;
  transfer?: Transfer;
  
  checkInDate: Date;
  checkOutDate: Date;
  travelers: number;
  
  totalPrice: number;
  currency: string;
  opaqueMask: boolean;
  
  status: 'DRAFT' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
  bookingReference?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceComponent {
  id: string;
  componentType: 'FLIGHT' | 'HOTEL' | 'TRANSFER' | 'TAX' | 'MARGIN';
  netPrice: number;
  marginAmount: number;
  taxAmount: number;
  totalPrice: number;
  currency: string;
}

export interface PriceBreakdown {
  components: PriceComponent[];
  subtotal: number;
  totalMargin: number;
  totalTax: number;
  grandTotal: number;
  currency: string;
}

export interface MarginRule {
  id: string;
  ruleName: string;
  description?: string;
  bookingDaysAdvance?: number;
  seasonType?: string;
  packageCategory?: string;
  marginPercent: number;
  marginFixed: number;
  isActive: boolean;
  priority: number;
}

export interface PackageSearchRequest {
  destination?: string;
  dates?: {
    checkIn: Date;
    checkOut: Date;
  };
  travelers?: number;
  category?: string;
  budget?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  naturalLanguageQuery?: string; // For AI-powered search
}

export interface PackageSearchResult {
  packages: PackageBlueprint[];
  hotels: Hotel[];
  flights: Flight[];
  totalResults: number;
  page: number;
  perPage: number;
}

export interface PackageBuilderState {
  selectedFlight?: Flight;
  selectedHotel?: Hotel;
  selectedRoom?: Room;
  selectedTransfer?: Transfer;
  dates: {
    checkIn: Date;
    checkOut: Date;
  };
  travelers: number;
  step: 'FLIGHT' | 'HOTEL' | 'ROOM' | 'TRANSFER' | 'REVIEW';
}

export interface PackageCalculation {
  basePrice: number;
  margin: number;
  tax: number;
  totalPrice: number;
  currency: string;
  breakdown: PriceBreakdown;
  appliedRules: MarginRule[];
  opaqueMask: boolean;
}

export interface BookingRequest {
  itinerary: Partial<Itinerary>;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  payment: {
    method: 'CARD' | 'BANK_TRANSFER' | 'CASH';
    amount: number;
    currency: string;
  };
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  bookingReference: string;
  itinerary: Itinerary;
  invoiceId?: string;
  error?: string;
}
