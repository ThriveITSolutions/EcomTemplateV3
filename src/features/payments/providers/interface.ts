// Payment Provider Interface
export enum PaymentProviderType {
  STRIPE = 'STRIPE',
  SSLCOMMERZ = 'SSLCOMMERZ',
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export interface CreatePaymentParams {
  orderId: string;
  amount: number;
  currency: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  returnUrl: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  redirectUrl?: string;
  error?: string;
}

export interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
}

export interface PaymentVerification {
  success: boolean;
  verified: boolean;
  amount?: number;
  currency?: string;
  status?: string;
  error?: string;
}

export interface RefundPaymentParams {
  paymentId: string;
  amount: number;
  reason?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  status: string;
}

export interface WebhookResult {
  processed: boolean;
  orderId?: string;
  status?: string;
  error?: string;
}

export interface PaymentProvider {
  readonly id: PaymentProviderType;
  readonly name: string;
  readonly supportedCurrencies: string[];

  createPayment(params: CreatePaymentParams): Promise<PaymentResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerification>;
  refundPayment(params: RefundPaymentParams): Promise<RefundResult>;
  handleWebhook(payload: unknown): Promise<WebhookResult>;
  validateConfig(config: Record<string, unknown>): Promise<boolean>;
}

// Config schema type
export interface ConfigSchema {
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
}