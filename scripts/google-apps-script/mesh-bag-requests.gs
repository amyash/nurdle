/**
 * Google Apps Script for mesh bag requests + cleanup logs.
 *
 * Bind this script to the PUBLIC mesh-bag spreadsheet (Requests tab).
 * Cleanup logs are written to a separate PRIVATE spreadsheet.
 *
 * Setup:
 * 1. Public sheet: tab "Requests" with mesh-bag headers
 * 2. Private spreadsheet ID in CLEANUP_LOGS_SPREADSHEET_ID below
 * 3. Run setupPrivateCleanupLogsSheet() once (headers)
 * 4. Optional: run migrateCleanupLogsFromPublicSheet() once (copy old rows)
 * 5. Deploy → Manage deployments → New version
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Keep GOOGLE_SHEETS_WEBHOOK_URL pointing at the web app URL
 *
 * Payload routing:
 * - { type: "cleanup-log", ... } → private Cleanup Logs spreadsheet
 * - anything else (mesh bags) → public Requests tab (this file’s spreadsheet)
 */

/** Private Cleanup Logs spreadsheet — keep Restricted / organisers only. */
var CLEANUP_LOGS_SPREADSHEET_ID =
  "1C_o20LeFVjAPRmaL-GPBcTFr6Cua9XN99H2ZdeFhC68";

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

function getPrivateCleanupSheet_() {
  var cleanupSpreadsheet = SpreadsheetApp.openById(
    CLEANUP_LOGS_SPREADSHEET_ID,
  );
  var cleanupSheet =
    cleanupSpreadsheet.getSheetByName("Cleanup Logs") ||
    cleanupSpreadsheet.insertSheet("Cleanup Logs");
  return cleanupSheet;
}

function ensureCleanupHeaders_(cleanupSheet) {
  if (cleanupSheet.getLastRow() === 0) {
    cleanupSheet.appendRow(CLEANUP_LOG_HEADERS);
  }
}

/**
 * Run once from the Apps Script editor (select function → Run).
 * Creates the Cleanup Logs tab + header row on the private spreadsheet.
 */
function setupPrivateCleanupLogsSheet() {
  var cleanupSheet = getPrivateCleanupSheet_();
  ensureCleanupHeaders_(cleanupSheet);
}

/**
 * Run once from the Apps Script editor to copy existing Cleanup Logs
 * rows from this (public) spreadsheet into the private one.
 * Skips the header row; does not delete the public tab (do that yourself after checking).
 */
function migrateCleanupLogsFromPublicSheet() {
  var publicSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cleanup Logs");
  if (!publicSheet) {
    throw new Error('No "Cleanup Logs" tab found on the public spreadsheet.');
  }

  var privateSheet = getPrivateCleanupSheet_();
  ensureCleanupHeaders_(privateSheet);

  var lastRow = publicSheet.getLastRow();
  var lastCol = Math.max(publicSheet.getLastColumn(), CLEANUP_LOG_HEADERS.length);
  if (lastRow < 2) {
    return; // headers only / empty
  }

  var values = publicSheet.getRange(2, 1, lastRow, lastCol).getValues();
  if (values.length === 0) return;

  // Pad rows to header width so Collected Volume column exists
  var width = CLEANUP_LOG_HEADERS.length;
  var padded = values.map(function (row) {
    var out = row.slice(0, width);
    while (out.length < width) out.push("");
    return out;
  });

  var startRow = privateSheet.getLastRow() + 1;
  privateSheet
    .getRange(startRow, 1, startRow + padded.length - 1, width)
    .setValues(padded);
}

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    if (data.type === "cleanup-log") {
      var cleanupSheet = getPrivateCleanupSheet_();
      ensureCleanupHeaders_(cleanupSheet);

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
