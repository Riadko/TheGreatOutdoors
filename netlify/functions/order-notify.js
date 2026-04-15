const json = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const formatTelegramMessage = (order) => {
  const deliveryTypeLabel = order.deliveryType === 'home' ? 'A domicile' : 'Stop desk';
  return [
    'Nouvelle commande',
    `Produit: ${order.product ?? '-'}`,
    `Quantite: ${order.quantity ?? '-'}`,
    `Nom: ${order.name ?? '-'}`,
    `Telephone: ${order.phone ?? '-'}`,
    `Wilaya: ${order.wilaya ?? '-'}`,
    `Commune: ${order.commune ?? '-'}`,
    `Livraison: ${deliveryTypeLabel}`,
    `Adresse: ${order.deliveryType === 'home' ? (order.address ?? '-') : '-'}`,
    `Total produits: ${order.productsTotal ?? '-'} DA`,
    `Frais livraison: ${order.deliveryFee ?? '-'} DA`,
    `Total a payer: ${order.total ?? '-'} DA`,
    `Date: ${order.date ?? '-'}`,
  ].join('\n');
};

const sendTelegramNotification = async (order) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      sent: false,
      reason: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID',
    };
  }

  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;
  const message = formatTelegramMessage(order);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || !data?.ok) {
    return {
      sent: false,
      reason: data?.description || `Telegram send failed: ${response.status}`,
    };
  }

  return {
    sent: true,
    messageId: data?.result?.message_id,
  };
};

const forwardToStorageWebhook = async (order) => {
  const webhook = process.env.ORDER_STORAGE_WEBHOOK;
  if (!webhook) return;

  // Keep zero values explicit for scripts using truthy checks (e.g., value || '-').
  const sheetSafeOrder = {
    ...order,
    phone: String(order.phone ?? '').trim(),
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
    // Keep Google Sheet as the source of truth and never block it on notifications.
    await forwardToStorageWebhook(order);
    const telegramResult = await sendTelegramNotification(order);

    return json(200, {
      ok: true,
      stored: true,
      telegramNotified: telegramResult.sent,
      telegramMessageId: telegramResult.messageId || null,
      warning: telegramResult.sent ? null : telegramResult.reason,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error.message || 'Order storage failed',
    });
  }
};
