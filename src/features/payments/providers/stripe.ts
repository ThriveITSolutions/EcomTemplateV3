import Stripe from 'stripe';
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

export class StripeProvider implements PaymentProvider {
  readonly id = PaymentProviderType.STRIPE;
  readonly name = 'Stripe';
  readonly supportedCurrencies = ['usd', 'eur', 'gbp', 'bdt'];

  private client: Stripe;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('Stripe API key is required');
    }
    
    this.client = new Stripe(key, {
      apiVersion: '2024-06-20',
    } as any);
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    try {
      // Create checkout session
      const session = await this.client.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: params.currency.toLowerCase(),
              product_data: {
                name: `Order ${params.orderId}`,
                metadata: {
                  orderId: params.orderId,
                },
              },
              unit_amount: Math.round(params.amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${params.returnUrl}?success=true&order=${params.orderId}`,
        cancel_url: `${params.returnUrl}?canceled=true`,
        customer_email: params.customer.email,
        metadata: {
          orderId: params.orderId,
          ...params.metadata,
        },
        // Shipping address collection for orders that need shipping
        shipping_address_collection: {
          allowed_countries: ['BD', 'US', 'GB', 'CA', 'AU'],
        },
        billing_address_collection: 'required',
      });

      return {
        success: true,
        paymentId: session.id,
        redirectUrl: session.url || undefined,
      };
    } catch (error) {
      console.error('Stripe createPayment error:', error);
      return {
        success: false,
        paymentId: '',
        error: error instanceof Error ? error.message : 'Payment creation failed',
      };
    }
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerification> {
    try {
      const session = await this.client.checkout.sessions.retrieve(params.paymentId);

      const verified = session.payment_status === 'paid' && 
                       session.metadata?.orderId === params.orderId;

      return {
        success: true,
        verified,
        amount: session.amount_total ? session.amount_total / 100 : undefined,
        currency: session.currency?.toUpperCase(),
        status: session.payment_status,
      };
    } catch (error) {
      console.error('Stripe verifyPayment error:', error);
      return {
        success: false,
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }

  async refundPayment(params: RefundPaymentParams): Promise<RefundResult> {
    try {
      // First retrieve the payment intent from the checkout session
      const session = await this.client.checkout.sessions.retrieve(params.paymentId);
      
      if (!session.payment_intent) {
        return {
          success: false,
          refundId: '',
          status: 'failed',
        };
      }

      const refund = await this.client.refunds.create({
        payment_intent: session.payment_intent as string,
        amount: Math.round(params.amount * 100), // Convert to cents
        reason: (params.reason || 'requested_by_customer') as any,
      });

      return {
        success: true,
        refundId: refund.id,
        status: refund.status || 'unknown',
      };
    } catch (error) {
      console.error('Stripe refundPayment error:', error);
      return {
        success: false,
        refundId: '',
        status: 'failed',
      };
    }
  }

  async handleWebhook(payload: unknown): Promise<WebhookResult> {
    try {
      const sig = process.env.STRIPE_WEBHOOK_SECRET;
      if (!sig) {
        throw new Error('Stripe webhook secret not configured');
      }

      const event = this.client.webhooks.constructEvent(
        payload as Buffer,
        sig,
        ''
      );

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          return {
            processed: true,
            orderId: session.metadata?.orderId,
            status: 'completed',
          };

        case 'checkout.session.expired':
          const expiredSession = event.data.object as Stripe.Checkout.Session;
          return {
            processed: true,
            orderId: expiredSession.metadata?.orderId,
            status: 'expired',
          };

        default:
          return {
            processed: true,
            status: 'unhandled',
          };
      }
    } catch (error) {
      console.error('Stripe webhook error:', error);
      return {
        processed: false,
        error: error instanceof Error ? error.message : 'Webhook handling failed',
      };
    }
  }

  async validateConfig(config: Record<string, unknown>): Promise<boolean> {
    return !!(config.apiKey && config.webhookSecret);
  }

  getConfigSchema(): ConfigSchema[] {
    return [
      {
        type: 'string',
        label: 'API Key',
        required: true,
        placeholder: 'sk_test_...',
        help: 'Your Stripe secret API key',
      },
      {
        type: 'string',
        label: 'Webhook Secret',
        required: true,
        placeholder: 'whsec_...',
        help: 'Your Stripe webhook signing secret',
      },
    ];
  }
}

// Factory function
let stripeProvider: StripeProvider | null = null;

export function getStripeProvider(): StripeProvider {
  if (!stripeProvider) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('Stripe API key not configured');
    }
    stripeProvider = new StripeProvider(apiKey);
  }
  return stripeProvider;
}