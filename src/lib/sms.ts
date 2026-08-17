import "server-only";

/**
 * SMS integration boundary. No provider is wired yet — when the hospital
 * supplies real SMS credentials, set SMS_PROVIDER_API_KEY (and add the provider
 * call in `sendSms`) and the OTP flow starts delivering real messages with no
 * other code changes.
 */
export function isSmsConfigured(): boolean {
  return Boolean(process.env.SMS_PROVIDER_API_KEY);
}

export async function sendSms(
  phone: string,
  message: string,
): Promise<{ delivered: boolean }> {
  if (!isSmsConfigured()) {
    // Pre-launch: log server-side so the flow stays testable without a provider.
    console.info(`[SMS pending provider] → ${phone}: ${message}`);
    return { delivered: false };
  }

  // TODO: call the real provider here, e.g.
  //   await provider.messages.create({ to: phone, body: message });
  return { delivered: true };
}
