/**
 * POST to a Google Apps Script web app.
 * Apps Script returns 302 → googleusercontent echo URL with the real JSON body.
 * Following redirects automatically can lose the POST and hit doGet instead.
 */
export async function postGoogleAppsScriptWebhook(
  webhookUrl: string,
  payload: Record<string, string | number | null>,
): Promise<{ ok: boolean; status: number; body: string }> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "manual",
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) {
      return {
        ok: false,
        status: response.status,
        body: "Redirect missing Location header",
      };
    }
    const echoed = await fetch(location, { redirect: "follow" });
    const body = await echoed.text().catch(() => "");
    return { ok: echoed.ok, status: echoed.status, body };
  }

  const body = await response.text().catch(() => "");
  return { ok: response.ok, status: response.status, body };
}
