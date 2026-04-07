const json = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const required = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WHATSAPP_FROM',
  'TWILIO_WHATSAPP_TO',
];

const formatMessage = (order) => {
  return [
    'Nouvelle commande',
    `Produit: ${order.product || '-'}`,
    `Quantite: ${order.quantity || '-'}`,
    `Nom: ${order.name || '-'}`,
    `Telephone: ${order.phone || '-'}`,
    `Wilaya: ${order.wilaya || '-'}`,
    `Total: ${order.total || '-'} DA`,
    `Date: ${order.date || '-'}`,
  ].join('\n');
};

const sendTwilioWhatsApp = async (message) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.TWILIO_WHATSAPP_TO;

  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const body = new URLSearchParams({
    From: from,
    To: to,
    Body: message,
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio send failed: ${response.status} ${errorText}`);
  }

  return response.json();
};

const forwardToStorageWebhook = async (order) => {
  const webhook = process.env.ORDER_STORAGE_WEBHOOK;
  if (!webhook) return;

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    return json(500, {
      ok: false,
      error: `Missing env vars: ${missing.join(', ')}`,
    });
  }

  let order;
  try {
    order = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON payload' });
  }

  if (!order.phone || !order.product) {
    return json(400, { ok: false, error: 'Missing required order fields' });
  }

  try {
    const message = formatMessage(order);
    const twilioResult = await sendTwilioWhatsApp(message);
    await forwardToStorageWebhook(order);

    return json(200, {
      ok: true,
      messageSid: twilioResult.sid,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error.message || 'Notification failed',
    });
  }
};
