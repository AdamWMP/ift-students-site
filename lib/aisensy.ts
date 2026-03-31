// ─── AiSensy WhatsApp API Client ────────────────────────────────────
// Sends WhatsApp template messages via AiSensy Business API
// Docs: https://aisensy.com/tutorials/api-reference-docs
// Endpoint: POST https://backend.aisensy.com/campaign/t1/api/v2

const AISENSY_API_URL = 'https://backend.aisensy.com/campaign/t1/api/v2';

interface SendMessageParams {
  destination: string;   // Phone number with country code e.g. "+353861234567"
  userName: string;      // Contact name
  campaignName: string;  // AiSensy campaign name (must be Live)
  templateParams: string[]; // Template variable values
  source?: string;       // Optional source identifier
}

interface AiSensyResponse {
  success: boolean;
  error?: string;
}

/**
 * Send a WhatsApp template message via AiSensy
 * Pre-requisite: Template must be approved by WhatsApp and campaign must be Live in AiSensy dashboard
 */
export async function sendWhatsAppMessage(params: SendMessageParams): Promise<AiSensyResponse> {
  const apiKey = process.env.AISENSY_API_KEY;

  if (!apiKey) {
    console.error('[AiSensy] AISENSY_API_KEY not configured');
    return { success: false, error: 'WhatsApp API not configured' };
  }

  try {
    const res = await fetch(AISENSY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        campaignName: params.campaignName,
        destination: params.destination,
        userName: params.userName,
        templateParams: params.templateParams,
        source: params.source || 'ift-checkout',
      }),
    });

    if (res.ok) {
      console.log(`[AiSensy] Message sent to ${params.destination}`);
      return { success: true };
    }

    const errorText = await res.text();
    console.error(`[AiSensy] Failed to send message: ${res.status} ${errorText}`);
    return { success: false, error: errorText };
  } catch (error) {
    console.error('[AiSensy] Error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send a payment reminder WhatsApp message
 * Template: payment_reminder with params: {{1}} name, {{2}} amount, {{3}} date
 * Create this template in AiSensy dashboard before using
 */
export async function sendPaymentReminder(
  phone: string,
  name: string,
  amount: string,
  paymentDate: string,
): Promise<AiSensyResponse> {
  return sendWhatsAppMessage({
    destination: phone,
    userName: name,
    campaignName: 'payment_reminder',
    templateParams: [name, amount, paymentDate],
    source: 'ift-payment-reminder',
  });
}
