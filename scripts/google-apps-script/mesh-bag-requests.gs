/**
 * Google Apps Script for mesh bag request intake.
 *
 * Setup:
 * 1. Create a Google Sheet with a header row:
 *    Request ID | Submitted | Beach | Quantity | Needed | Requester | Notes | Status | Claimed by | ETA | Delivered
 * 2. Extensions → Apps Script
 * 3. Paste this file’s contents and Save
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL into GOOGLE_SHEETS_WEBHOOK_URL (server-only env var)
 */

function doPost(e) {
  try {
    var sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Requests") ||
      SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    sheet.appendRow([
      data.requestId || "",
      data.submitted || "",
      data.beach || "",
      data.quantity || "",
      data.needed || "",
      data.requester || "",
      data.notes || "",
      data.status || "requested",
      data.claimedBy || "",
      data.eta || "",
      data.delivered || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        ok: false,
        error: String(error && error.message ? error.message : error),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    "Mesh bag requests webhook is running. Use POST.",
  );
}
