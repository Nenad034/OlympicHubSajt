/**
 * Types for Serbian E-Faktura (Electronic Invoice) Compliance
 * Based on SEF (Sistem E-Faktura) standards and UBL 2.1
 */

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  
  // Company Information (Seller)
  pib: string; // Tax Identification Number (PIB - Poreski Identifikacioni Broj)
  maticniBroj: string; // Company Registration Number (Matični broj)
  companyName: string;
  companyAddress: string;
  
  // Customer Information (Buyer)
  buyerPib?: string;
  buyerName: string;
  buyerAddress?: string;
  
  // Fiscal Information
  fiscalQrCode?: string; // QR code for fiscal verification
  cisCode?: string; // CIS payment code (Centralni Informacioni Sistem)
  
  // Invoice Amounts
  taxableAmount: number; // Base amount before tax
  taxAmount: number; // VAT amount (PDV)
  totalAmount: number; // Total including tax
  currency: string; // RSD (Serbian Dinar) or EUR
  
  // Status
  isFiscalized: boolean;
  fiscalizedAt?: Date;
}

export interface InvoiceLineItem {
  itemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g., 20 for 20% VAT
  lineTotal: number;
}

export interface FiscalData {
  // SEF Standards
  invoiceType: 'PROFAKTURA' | 'FAKTURA' | 'AVANSNA_FAKTURA';
  
  // Tax Details
  taxCategory: 'S' | 'Z' | 'E'; // S=Standard, Z=Zero-rated, E=Exempt
  taxPercent: number; // 20% is standard VAT in Serbia
  
  // Payment Information
  paymentMeans: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'CIS';
  paymentDueDate?: Date;
  
  // Bank Details
  bankAccount?: string;
  bankName?: string;
  
  // Reference Numbers
  orderReference?: string;
  contractReference?: string;
}

export interface EFakturaCompliance {
  // UBL 2.1 Required Fields
  ublVersion: '2.1';
  customizationId: 'urn:cen.eu:en16931:2017'; // European Standard
  profileId: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0';
  
  // Serbian Specific
  sefVersion: string; // e.g., "1.0"
  fiscalDeviceId?: string; // PFR device ID if applicable
  
  // Digital Signature
  signatureRequired: boolean;
  signatureValue?: string;
  certificateInfo?: {
    issuer: string;
    serialNumber: string;
    validFrom: Date;
    validTo: Date;
  };
}

export interface CISPaymentData {
  // Centralni Informacioni Sistem (CIS) - Serbian payment system
  cisReference: string;
  cisModel: string; // Payment model (e.g., "97")
  cisCallNumber: string; // Poziv na broj
  paymentPurpose: string;
  recipientAccount: string;
}

export type InvoiceStatus = 
  | 'DRAFT'
  | 'ISSUED'
  | 'SENT'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'FISCALIZED';

export interface InvoiceCreateRequest {
  itineraryId: string;
  customerInfo: {
    name: string;
    pib?: string;
    address?: string;
    email: string;
  };
  lineItems: InvoiceLineItem[];
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'CIS';
  fiscalize?: boolean; // Whether to immediately fiscalize
}

export interface InvoiceResponse {
  success: boolean;
  invoiceId: string;
  invoiceNumber: string;
  fiscalQrCode?: string;
  cisCode?: string;
  downloadUrl?: string;
  error?: string;
}
