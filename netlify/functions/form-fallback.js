// Proxy Make webhook — masque l'URL Make côté serveur
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const makeUrl = process.env.MAKE_WEBHOOK_URL;
  if (!makeUrl) {
    return { statusCode: 503, body: JSON.stringify({ error: "Fallback unavailable" }) };
  }

  try {
    const response = await fetch(makeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body,
    });
    return {
      statusCode: response.ok ? 200 : 502,
      body: JSON.stringify({ ok: response.ok }),
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "Upstream error" }) };
  }
};
