export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  // Healthcheck amigable
  if (req.method === "GET") {
    return res.status(200).send("OK - webhook endpoint alive. Send POST from Chatwoot.");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const rawBody = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });

    const payload = rawBody ? JSON.parse(rawBody) : {};

    console.log("Chatwoot webhook received:", {
      event: payload?.event,
      messageType: payload?.message?.message_type,
      content: payload?.message?.content,
      conversationId: payload?.conversation?.id,
      messageId: payload?.message?.id
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
