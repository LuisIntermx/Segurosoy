export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const payload = req.body;

    // Chatwoot suele mandar: payload.message, payload.conversation, payload.account, etc.
    const message = payload?.message;
    const conversation = payload?.conversation;

    // Validación mínima: solo reaccionar a mensajes entrantes del cliente
    // message_type suele ser "incoming" o "outgoing"
    const messageType = message?.message_type;

    // Logs para depurar en Vercel
    console.log("Chatwoot webhook received:", {
      event: payload?.event,
      messageType,
      conversationId: conversation?.id,
      messageId: message?.id,
      content: message?.content,
      inboxId: conversation?.inbox_id,
      contactId: conversation?.contact_id
    });

    // Si no es incoming, ignoramos para evitar bucles (cuando el bot/humano responde)
    if (messageType && messageType !== "incoming") {
      return res.status(200).json({ ok: true, ignored: true, reason: "not_incoming" });
    }

    // ✅ En el siguiente paso aquí llamaremos a Jelou (Brain) y luego responderemos en Chatwoot
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
