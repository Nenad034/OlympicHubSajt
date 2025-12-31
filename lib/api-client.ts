/**
 * API Client for OlympicHub034 Application
 * 
 * This client handles all communication with the backend API
 * for flights, hotels, bookings, payments, and invoices.
 */

import type {
  ApiResponse,
  ApiConfig,
  FlightSearchRequest,
  FlightSearchResponse,
  HotelSearchRequest,
  HotelSearchResponse,
  AvailabilityCheckRequest,
  AvailabilityCheckResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  BookingStatusRequest,
  BookingStatusResponse,
  CancelBookingRequest,
  CancelBookingResponse,
  PriceCalculationRequest,
  PriceCalculationResponse,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  PaymentRequest,
  PaymentResponse,
  PackageBlueprintRequest,
  PackageBlueprintResponse,
  PackageSearchApiRequest,
  PackageSearchApiResponse,
  AISearchRequest,
  AISearchResponse,
  RecommendationRequest,
  RecommendationResponse,
} from '@/types/api';
import type { PackageSearchResult } from '@/types/package';

export class OlympicHubApiClient {
  private config: ApiConfig;

  constructor(config?: Partial<ApiConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || process.env.OLYMPICHUB_API_URL || 'https://api.olympichub034.com',
      apiKey: config?.apiKey || process.env.OLYMPICHUB_API_KEY || 'your-api-key-here',
      timeout: config?.timeout || 30000,
      retries: config?.retries || 3,
    };
  }

  /**
   * Generic request handler with error handling and retries
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = this.config.retries || 3
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'X-Client-Version': '1.0.0',
      ...options.headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: response.headers.get('X-Request-ID') || 'unknown',
          version: response.headers.get('X-API-Version') || '1.0',
        },
      };
    } catch (error) {
      if (retries > 0 && error instanceof Error && error.name !== 'AbortError') {
        // Retry on network errors
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.request<T>(endpoint, options, retries - 1);
      }

      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          statusCode: 500,
        },
      };
    }
  }

  // ====================================
  // SEARCH & AVAILABILITY
  // ====================================

  async searchFlights(params: FlightSearchRequest): Promise<ApiResponse<FlightSearchResponse>> {
    return this.request<FlightSearchResponse>('/api/flights/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async searchHotels(params: HotelSearchRequest): Promise<ApiResponse<HotelSearchResponse>> {
    return this.request<HotelSearchResponse>('/api/hotels/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async checkAvailability(params: AvailabilityCheckRequest): Promise<ApiResponse<AvailabilityCheckResponse>> {
    return this.request<AvailabilityCheckResponse>('/api/availability/check', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ====================================
  // BOOKING
  // ====================================

  async createBooking(params: CreateBookingRequest): Promise<ApiResponse<CreateBookingResponse>> {
    return this.request<CreateBookingResponse>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getBookingStatus(params: BookingStatusRequest): Promise<ApiResponse<BookingStatusResponse>> {
    const query = new URLSearchParams({
      bookingId: params.bookingId,
      ...(params.bookingReference && { bookingReference: params.bookingReference }),
    });
    
    return this.request<BookingStatusResponse>(`/api/bookings/status?${query}`);
  }

  async cancelBooking(params: CancelBookingRequest): Promise<ApiResponse<CancelBookingResponse>> {
    return this.request<CancelBookingResponse>(`/api/bookings/${params.bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ====================================
  // PRICING
  // ====================================

  async calculatePrice(params: PriceCalculationRequest): Promise<ApiResponse<PriceCalculationResponse>> {
    return this.request<PriceCalculationResponse>('/api/pricing/calculate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ====================================
  // INVOICES & PAYMENTS
  // ====================================

  async createInvoice(params: CreateInvoiceRequest): Promise<ApiResponse<CreateInvoiceResponse>> {
    return this.request<CreateInvoiceResponse>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async processPayment(params: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return this.request<PaymentResponse>('/api/payments', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ====================================
  // PACKAGES & BLUEPRINTS
  // ====================================

  async getPackageBlueprints(params?: PackageBlueprintRequest): Promise<ApiResponse<PackageBlueprintResponse>> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    return this.request<PackageBlueprintResponse>(`/api/packages/blueprints${query}`);
  }

  async searchPackages(params: PackageSearchApiRequest): Promise<PackageSearchApiResponse> {
    const response = await this.request<PackageSearchResult>('/api/packages/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    return {
      ...response,
      recommendations: [],
      popularDestinations: [],
    };
  }

  // ====================================
  // AI & RECOMMENDATIONS
  // ====================================

  async aiSearch(params: AISearchRequest): Promise<ApiResponse<AISearchResponse>> {
    return this.request<AISearchResponse>('/api/ai/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getRecommendations(params: RecommendationRequest): Promise<ApiResponse<RecommendationResponse>> {
    return this.request<RecommendationResponse>('/api/recommendations', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ====================================
  // UTILITIES
  // ====================================

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.request<{ status: string }>('/api/health');
      return response.success && response.data?.status === 'ok';
    } catch {
      return false;
    }
  }

  /**
   * Update API configuration
   */
  updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration (excluding API key)
   */
  getConfig(): Omit<ApiConfig, 'apiKey'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiKey, ...safeConfig } = this.config;
    return safeConfig;
  }
}

// Export singleton instance
export const apiClient = new OlympicHubApiClient();

// Export class for custom instances
export default OlympicHubApiClient;
