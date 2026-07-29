/**
 * Google Apps Script for mesh bag requests + cleanup logs.
 *
 * Setup:
 * 1. Sheet tab "Requests" with mesh-bag headers (existing)
 * 2. Sheet tab "Cleanup Logs" with headers:
 *    ID | Submitted At | Cleanup Date | Beach ID | Beach Name |
 *    Duration Minutes | Volunteer Count | Estimated Weight Kg |
 *    Volunteer Name | Notes
 * 3. Extensions → Apps Script — replace with this file, Save
 * 4. Deploy → Manage deployments → New version (or New deployment)
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Keep GOOGLE_SHEETS_WEBHOOK_URL pointing at the web app URL
 *
 * Payload routing:
 * - { type: "cleanup-log", ... } → Cleanup Logs tab
 * - anything else (mesh bags) → Requests tab
 */

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (data.type === "cleanup-log") {
      var cleanupSheet =
        spreadsheet.getSheetByName("Cleanup Logs") ||
        spreadsheet.insertSheet("Cleanup Logs");

      if (cleanupSheet.getLastRow() === 0) {
        cleanupSheet.appendRow([
          "ID",
          "Submitted At",
          "Cleanup Date",
          "Beach ID",
          "Beach Name",
          "Duration Minutes",
          "Volunteer Count",
          "Estimated Weight Kg",
          "Volunteer Name",
          "Notes",
        ]);
      }

      cleanupSheet.appendRow([
        data.id || "",
        data.submittedAt || "",
        data.cleanupDate || "",
        data.beachId || "",
        data.beachName || "",
        data.durationMinutes || "",
        data.volunteerCount || "",
        data.estimatedWeightKg == null ? "" : data.estimatedWeightKg,
        data.volunteerName || "",
        data.notes || "",
      ]);
    } else {
      // mesh-bag (default) — existing Requests tab
      var sheet =
        spreadsheet.getSheetByName("Requests") ||
        spreadsheet.getActiveSheet();

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
    }

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
    "Nurdle hub webhook is running. Use POST.",
  );
}
