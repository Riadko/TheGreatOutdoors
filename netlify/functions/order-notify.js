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

const toWhatsAppAddress = (value) => {
  if (!value) return '';
  return value.startsWith('whatsapp:') ? value : `whatsapp:${value}`;
};

const formatMessage = (order) => {
  const deliveryTypeLabel = order.deliveryType === 'home' ? 'A domicile' : 'Stop desk';
  return [
    'Nouvelle commande',
    `Produit: ${order.product ?? '-'}`,
    `Quantite: ${order.quantity ?? '-'}`,
    `Nom: ${order.name ?? '-'}`,
    `Telephone: ${order.phone ?? '-'}`,
    `Wilaya: ${order.wilaya ?? '-'}`,
    `Livraison: ${deliveryTypeLabel}`,
    `Adresse: ${order.deliveryType === 'home' ? (order.address ?? '-') : '-'}`,
    `Total produits: ${order.productsTotal ?? '-'} DA`,
    `Frais livraison: ${order.deliveryFee ?? '-'} DA`,
    `Total a payer: ${order.total ?? '-'} DA`,
    `Date: ${order.date ?? '-'}`,
  ].join('\n');
};

const sendTwilioWhatsApp = async (message) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = toWhatsAppAddress(process.env.TWILIO_WHATSAPP_FROM);
  const to = toWhatsAppAddress(process.env.TWILIO_WHATSAPP_TO);

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

const sendTwilioWhatsAppTemplate = async (order) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = toWhatsAppAddress(process.env.TWILIO_WHATSAPP_FROM);
  const to = toWhatsAppAddress(process.env.TWILIO_WHATSAPP_TO);
  const contentSid = process.env.TWILIO_WHATSAPP_CONTENT_SID;

  if (!contentSid) {
    throw new Error('TWILIO_WHATSAPP_CONTENT_SID is required for WhatsApp template fallback');
  }

  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const body = new URLSearchParams({
    From: from,
    To: to,
    ContentSid: contentSid,
    ContentVariables: JSON.stringify({
      1: order.product ?? '-',
      2: order.quantity ?? '-',
      3: order.name ?? '-',
      4: order.phone ?? '-',
      5: order.wilaya ?? '-',
      6: `${order.total ?? '-'} DA`,
      7: order.date ?? '-',
    }),
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
    throw new Error(`Twilio template send failed: ${response.status} ${errorText}`);
  }

  return response.json();
};

const forwardToStorageWebhook = async (order) => {
  const webhook = process.env.ORDER_STORAGE_WEBHOOK;
  if (!webhook) return;

  // Keep zero values explicit for scripts using truthy checks (e.g., value || '-').
  const sheetSafeOrder = {
    ...order,
    deliveryFee: String(order.deliveryFee ?? ''),
    productsTotal: String(order.productsTotal ?? ''),
    total: String(order.total ?? ''),
  };

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sheetSafeOrder),
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
      error: `Missing env vars: ${missing.join(', ')}. Add them in Netlify > Site configuration > Environment variables, then redeploy.`,
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
    let twilioResult;

    try {
      twilioResult = await sendTwilioWhatsApp(message);
    } catch (error) {
      const isOutsideWindow = String(error.message || '').includes('63016');
      const hasTemplate = Boolean(process.env.TWILIO_WHATSAPP_CONTENT_SID);

      if (!isOutsideWindow || !hasTemplate) {
        throw error;
      }

      twilioResult = await sendTwilioWhatsAppTemplate(order);
    }

    await forwardToStorageWebhook(order);

    return json(200, {
      ok: true,
      messageSid: twilioResult.sid,
      templateFallback: Boolean(process.env.TWILIO_WHATSAPP_CONTENT_SID),
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error.message || 'Notification failed',
    });
  }
};
