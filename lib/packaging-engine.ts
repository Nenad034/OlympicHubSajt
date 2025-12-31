/**
 * Packaging Engine - Dynamic Pricing and Margin Calculation Service
 * 
 * This service handles the core logic for calculating travel package prices
 * by applying dynamic margin rules and managing opaque pricing.
 */

import { PrismaClient } from '@prisma/client';
import type { 
  PriceComponent, 
  MarginRule, 
  PackageCalculation,
  PriceBreakdown 
} from '@/types/package';

const prisma = new PrismaClient();

export class PackagingEngine {
  /**
   * Calculate the final package price with applied margins and taxes
   * 
   * @param flightPrice - Net price of the flight component
   * @param hotelPrice - Net price of the hotel component
   * @param transferPrice - Net price of the transfer component
   * @param options - Additional options for calculation
   * @returns PackageCalculation with breakdown and total price
   */
  async calculatePackagePrice(
    flightPrice: number = 0,
    hotelPrice: number = 0,
    transferPrice: number = 0,
    options: {
      checkInDate: Date;
      category?: string;
      seasonType?: string;
      applyOpaqueMask?: boolean;
      currency?: string;
    }
  ): Promise<PackageCalculation> {
    const { checkInDate, category, seasonType, applyOpaqueMask = true, currency = 'EUR' } = options;

    // Calculate booking days in advance
    const today = new Date();
    const daysAdvance = Math.floor((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Fetch active margin rules
    const marginRules = await this.getApplicableMarginRules({
      daysAdvance,
      category,
      seasonType,
    });

    // Calculate base price
    const basePrice = flightPrice + hotelPrice + transferPrice;

    // Apply margins
    const { totalMargin, appliedRules } = this.applyMarginRules(basePrice, marginRules);

    // Calculate tax (20% VAT for Serbia)
    const taxRate = 0.20;
    const priceBeforeTax = basePrice + totalMargin;
    const taxAmount = priceBeforeTax * taxRate;

    // Calculate total price
    const totalPrice = priceBeforeTax + taxAmount;

    // Build price breakdown
    const breakdown = this.buildPriceBreakdown({
      flightPrice,
      hotelPrice,
      transferPrice,
      totalMargin,
      taxAmount,
      currency,
    });

    return {
      basePrice,
      margin: totalMargin,
      tax: taxAmount,
      totalPrice,
      currency,
      breakdown,
      appliedRules,
      opaqueMask: applyOpaqueMask,
    };
  }

  /**
   * Fetch applicable margin rules based on conditions
   */
  private async getApplicableMarginRules(conditions: {
    daysAdvance: number;
    category?: string;
    seasonType?: string;
  }): Promise<MarginRule[]> {
    const { daysAdvance, category, seasonType } = conditions;

    const rules = await prisma.marginRule.findMany({
      where: {
        isActive: true,
        OR: [
          // Rules that match booking days advance
          {
            bookingDaysAdvance: {
              gte: daysAdvance,
            },
          },
          // Rules that match category
          category ? { packageCategory: category } : {},
          // Rules that match season
          seasonType ? { seasonType: seasonType } : {},
          // Global rules (no conditions)
          {
            bookingDaysAdvance: null,
            packageCategory: null,
            seasonType: null,
          },
        ],
      },
      orderBy: {
        priority: 'desc',
      },
    });

    return rules as MarginRule[];
  }

  /**
   * Apply margin rules to calculate total margin
   */
  private applyMarginRules(
    basePrice: number,
    rules: MarginRule[]
  ): { totalMargin: number; appliedRules: MarginRule[] } {
    if (rules.length === 0) {
      // Default margin: 10% if no rules
      return {
        totalMargin: basePrice * 0.10,
        appliedRules: [],
      };
    }

    // Apply the highest priority rule
    const topRule = rules[0];
    
    let marginAmount = 0;
    
    // Calculate percentage margin
    if (topRule.marginPercent > 0) {
      marginAmount += basePrice * (Number(topRule.marginPercent) / 100);
    }
    
    // Add fixed margin
    if (topRule.marginFixed > 0) {
      marginAmount += Number(topRule.marginFixed);
    }

    return {
      totalMargin: marginAmount,
      appliedRules: [topRule],
    };
  }

  /**
   * Build detailed price breakdown
   */
  private buildPriceBreakdown(params: {
    flightPrice: number;
    hotelPrice: number;
    transferPrice: number;
    totalMargin: number;
    taxAmount: number;
    currency: string;
  }): PriceBreakdown {
    const { flightPrice, hotelPrice, transferPrice, totalMargin, taxAmount, currency } = params;

    const components: PriceComponent[] = [];

    // Flight component
    if (flightPrice > 0) {
      components.push({
        id: 'flight',
        componentType: 'FLIGHT',
        netPrice: flightPrice,
        marginAmount: 0,
        taxAmount: 0,
        totalPrice: flightPrice,
        currency,
      });
    }

    // Hotel component
    if (hotelPrice > 0) {
      components.push({
        id: 'hotel',
        componentType: 'HOTEL',
        netPrice: hotelPrice,
        marginAmount: 0,
        taxAmount: 0,
        totalPrice: hotelPrice,
        currency,
      });
    }

    // Transfer component
    if (transferPrice > 0) {
      components.push({
        id: 'transfer',
        componentType: 'TRANSFER',
        netPrice: transferPrice,
        marginAmount: 0,
        taxAmount: 0,
        totalPrice: transferPrice,
        currency,
      });
    }

    // Margin component
    components.push({
      id: 'margin',
      componentType: 'MARGIN',
      netPrice: 0,
      marginAmount: totalMargin,
      taxAmount: 0,
      totalPrice: totalMargin,
      currency,
    });

    // Tax component
    components.push({
      id: 'tax',
      componentType: 'TAX',
      netPrice: 0,
      marginAmount: 0,
      taxAmount: taxAmount,
      totalPrice: taxAmount,
      currency,
    });

    const subtotal = flightPrice + hotelPrice + transferPrice;
    const grandTotal = subtotal + totalMargin + taxAmount;

    return {
      components,
      subtotal,
      totalMargin,
      totalTax: taxAmount,
      grandTotal,
      currency,
    };
  }

  /**
   * Create price components for an itinerary in the database
   */
  async savePriceComponents(
    itineraryId: string,
    calculation: PackageCalculation
  ): Promise<void> {
    const { breakdown } = calculation;

    // Delete existing components
    await prisma.priceComponent.deleteMany({
      where: { itineraryId },
    });

    // Create new components
    for (const component of breakdown.components) {
      await prisma.priceComponent.create({
        data: {
          itineraryId,
          componentType: component.componentType,
          netPrice: component.netPrice,
          marginAmount: component.marginAmount,
          taxAmount: component.taxAmount,
          totalPrice: component.totalPrice,
          currency: component.currency,
        },
      });
    }
  }

  /**
   * Get price breakdown for an existing itinerary
   */
  async getItineraryPriceBreakdown(itineraryId: string): Promise<PriceBreakdown | null> {
    const components = await prisma.priceComponent.findMany({
      where: { itineraryId },
    });

    if (components.length === 0) {
      return null;
    }

    const typedComponents: PriceComponent[] = components.map(c => ({
      id: c.id,
      componentType: c.componentType as any,
      netPrice: Number(c.netPrice),
      marginAmount: Number(c.marginAmount),
      taxAmount: Number(c.taxAmount),
      totalPrice: Number(c.totalPrice),
      currency: c.currency,
    }));

    const subtotal = typedComponents
      .filter(c => ['FLIGHT', 'HOTEL', 'TRANSFER'].includes(c.componentType))
      .reduce((sum, c) => sum + c.netPrice, 0);

    const totalMargin = typedComponents
      .find(c => c.componentType === 'MARGIN')?.marginAmount || 0;

    const totalTax = typedComponents
      .find(c => c.componentType === 'TAX')?.taxAmount || 0;

    const grandTotal = subtotal + totalMargin + totalTax;

    return {
      components: typedComponents,
      subtotal,
      totalMargin,
      totalTax,
      grandTotal,
      currency: components[0].currency,
    };
  }
}

// Export singleton instance
export const packagingEngine = new PackagingEngine();
