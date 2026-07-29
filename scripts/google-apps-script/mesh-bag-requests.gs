/**
 * Google Apps Script for mesh bag requests + cleanup logs.
 *
 * Bind this script to the PUBLIC mesh-bag spreadsheet (Requests tab).
 * Cleanup logs are written to a separate PRIVATE spreadsheet.
 *
 * Setup:
 * 1. Public sheet: tab "Requests" with mesh-bag headers
 * 2. Private spreadsheet (Restricted sharing) with tab "Cleanup Logs"
 *    headers:
 *    ID | Submitted At | Cleanup Date | Beach ID | Beach Name |
 *    Duration Minutes | Volunteer Count | Estimated Weight Kg |
 *    Volunteer Name | Notes | Collected Volume
 * 3. Set CLEANUP_LOGS_SPREADSHEET_ID below to that private file’s ID
 * 4. Extensions → Apps Script on the PUBLIC sheet — replace with this file, Save
 * 5. Deploy → Manage deployments → New version (or New deployment)
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Keep GOOGLE_SHEETS_WEBHOOK_URL pointing at the web app URL
 *
 * Payload routing:
 * - { type: "cleanup-log", ... } → private Cleanup Logs spreadsheet
 * - anything else (mesh bags) → public Requests tab (this file’s spreadsheet)
 *
 * Weight conversion (done by the hub before POST):
 * 1 litre ≈ 550 g of nurdles. Ranges use midpoints.
 */

/** Private Cleanup Logs spreadsheet — keep Restricted / organisers only. */
var CLEANUP_LOGS_SPREADSHEET_ID =
  "1C_o20LeFVjAPRmaL-GPBcTFr6Cua9XN99H2ZdeFhC68";

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    if (data.type === "cleanup-log") {
      var cleanupSpreadsheet = SpreadsheetApp.openById(
        CLEANUP_LOGS_SPREADSHEET_ID,
      );
      var cleanupSheet =
        cleanupSpreadsheet.getSheetByName("Cleanup Logs") ||
        cleanupSpreadsheet.insertSheet("Cleanup Logs");

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
          "Collected Volume",
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
        data.collectedVolume || "",
      ]);
    } else {
      // mesh-bag (default) — public Requests tab on this bound spreadsheet
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
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
