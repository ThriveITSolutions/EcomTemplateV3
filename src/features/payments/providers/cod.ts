import {
  PaymentProvider,
  PaymentProviderType,
  CreatePaymentParams,
  PaymentResult,
  VerifyPaymentParams,
  PaymentVerification,
  RefundPaymentParams,
  RefundResult,
  WebhookResult,
  ConfigSchema,
} from './interface';

export class CODProvider implements PaymentProvider {
  readonly id = PaymentProviderType.COD;
  readonly name = 'Cash on Delivery';
  readonly supportedCurrencies = ['BDT', 'USD', 'EUR', 'GBP'];

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    // COD doesn't require payment creation - order is placed with pending payment
    // The payment will be collected upon delivery
    return {
      success: true,
      paymentId: `cod_${params.orderId}_${Date.now()}`,
      // No redirect needed - proceed to order confirmation
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerification> {
    // COD payments are verified when order is confirmed/shipped
    // For now, return pending status
    return {
      success: true,
      verified: true,
      status: 'PENDING_COLLECTION',
      amount: undefined,
      currency: 'BDT',
    };
  }

  async refundPayment(params: RefundPaymentParams): Promise<RefundResult> {
    // Refunds for COD are processed manually through admin
    // This is a placeholder - actual refund would need admin intervention
    return {
      success: true,
      refundId: `cod_refund_${params.paymentId}_${Date.now()}`,
      status: 'PENDING',
    };
  }

  async handleWebhook(payload: unknown): Promise<WebhookResult> {
    // COD doesn't use webhooks
    return {
      processed: true,
      status: 'no_webhook',
    };
  }

  async validateConfig(config: Record<string, unknown>): Promise<boolean> {
    // COD doesn't require configuration
    return true;
  }

  getConfigSchema(): ConfigSchema[] {
    return [
      {
        type: 'boolean',
        label: 'Enable Cash on Delivery',
        required: true,
        help: 'Allow customers to pay with cash upon delivery',
      },
      {
        type: 'number',
        label: 'Maximum Order Amount',
        required: false,
        help: 'Maximum order amount eligible for COD (leave empty for no limit)',
      },
    ];
  }
}

// Factory function
let codProvider: CODProvider | null = null;

export function getCODProvider(): CODProvider {
  if (!codProvider) {
    codProvider = new CODProvider();
  }
  return codProvider;
}