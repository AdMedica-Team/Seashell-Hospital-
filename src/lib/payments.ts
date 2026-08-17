import "server-only";

/**
 * Payment gateway boundary. No gateway is wired yet — when the hospital supplies
 * Paymob/Fawry (or similar) credentials, set PAYMENT_PROVIDER_API_KEY and
 * implement `createCheckoutSession`; the /pay page will then hand off to the
 * real gateway instead of showing the "pending" notice.
 */
export function isPaymentConfigured(): boolean {
  return Boolean(process.env.PAYMENT_PROVIDER_API_KEY);
}

export async function createCheckoutSession(params: {
  referenceNumber: string;
  amount: number;
  currency: string;
}): Promise<{ redirectUrl: string } | null> {
  if (!isPaymentConfigured()) return null;
  // TODO: call the real gateway with `params` and return its hosted-checkout URL.
  void params;
  return null;
}
