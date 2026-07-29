/**
 * Google Apps Script — bind this to the PRIVATE Cleanup Logs spreadsheet:
 * https://docs.google.com/spreadsheets/d/1C_o20LeFVjAPRmaL-GPBcTFr6Cua9XN99H2ZdeFhC68/edit
 *
 * Then: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the /exec URL into GOOGLE_SHEETS_WEBHOOK_URL (Vercel + .env.local) and redeploy.
 *
 * Optional: set REQUESTS_SPREADSHEET_ID to the public mesh-bag spreadsheet ID
 * so Requests rows still go to the public file.
 */

var SCRIPT_VERSION = "private-v2-2026-07-29";

/** Public mesh-bag spreadsheet ID (from /d/<ID>/edit). Leave blank to skip. */
var REQUESTS_SPREADSHEET_ID = "";

var CLEANUP_LOG_HEADERS = [
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
];

function jsonResponse_(payload) {
  return ContentService.createTextOutput(
    JSON.stringify(payload),
  ).setMimeType(ContentService.MimeType.JSON);
}

function getCleanupSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Cleanup Logs");
  if (!sheet) {
    var sheets = spreadsheet.getSheets();
    if (sheets.length === 1) {
      sheet = sheets[0];
      sheet.setName("Cleanup Logs");
    } else {
      sheet = spreadsheet.insertSheet("Cleanup Logs");
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CLEANUP_LOG_HEADERS);
  }
  return sheet;
}

function getRequestsSheet_() {
  var spreadsheet;
  if (REQUESTS_SPREADSHEET_ID) {
    spreadsheet = SpreadsheetApp.openById(REQUESTS_SPREADSHEET_ID);
  } else {
    spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  }
  return (
    spreadsheet.getSheetByName("Requests") || spreadsheet.getActiveSheet()
  );
}

/**
 * Run once from the editor to prove writes work on THIS spreadsheet.
 */
function testWriteToPrivateCleanupLogs() {
  var sheet = getCleanupSheet_();
  sheet.appendRow([
    "manual-test-" + Date.now(),
    new Date().toLocaleString("en-GB"),
    "2026-07-29",
    "test-beach",
    "Manual Test Beach",
    30,
    1,
    0.03,
    "Manual Test",
    "MANUAL EDITOR TEST " + SCRIPT_VERSION,
    "Handful",
  ]);
}

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    if (data.type === "cleanup-log") {
      var cleanupSheet = getCleanupSheet_();
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
      return jsonResponse_({
        ok: true,
        target: "private-cleanup-logs",
        version: SCRIPT_VERSION,
      });
    }

    // mesh-bag (default)
    var sheet = getRequestsSheet_();
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
    return jsonResponse_({
      ok: true,
      target: REQUESTS_SPREADSHEET_ID ? "public-requests" : "active-requests",
      version: SCRIPT_VERSION,
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      version: SCRIPT_VERSION,
      error: String(error && error.message ? error.message : error),
    });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    version: SCRIPT_VERSION,
    message: "Nurdle hub webhook is running. Use POST.",
  });
}
