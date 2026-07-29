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
 * 5. Run diagnoseCleanupMigration() if migrate seems to do nothing
 * 6. Deploy → Manage deployments → New version
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Keep GOOGLE_SHEETS_WEBHOOK_URL pointing at the web app URL
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

function alert_(message) {
  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (e) {
    // Running without UI (e.g. from some contexts) — fall back to log
    Logger.log(message);
  }
}

function getPrivateSpreadsheet_() {
  return SpreadsheetApp.openById(CLEANUP_LOGS_SPREADSHEET_ID);
}

function getPrivateCleanupSheet_() {
  var cleanupSpreadsheet = getPrivateSpreadsheet_();
  var cleanupSheet = findSheetByNameInsensitive_(
    cleanupSpreadsheet,
    "Cleanup Logs",
  );

  if (!cleanupSheet) {
    var sheets = cleanupSpreadsheet.getSheets();
    // If the file only has a blank default sheet, rename it
    if (
      sheets.length === 1 &&
      (sheets[0].getLastRow() === 0 ||
        (sheets[0].getLastRow() === 1 && !sheets[0].getRange(1, 1).getValue()))
    ) {
      cleanupSheet = sheets[0];
      cleanupSheet.setName("Cleanup Logs");
    } else {
      cleanupSheet = cleanupSpreadsheet.insertSheet("Cleanup Logs");
    }
  }

  return cleanupSheet;
}

function findSheetByNameInsensitive_(spreadsheet, name) {
  var target = String(name).toLowerCase();
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (String(sheets[i].getName()).toLowerCase() === target) {
      return sheets[i];
    }
  }
  return null;
}

function findPublicCleanupSourceSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var exact = findSheetByNameInsensitive_(spreadsheet, "Cleanup Logs");
  if (exact) return exact;

  // Fall back: any tab whose header row mentions Estimated Weight
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    if (sheet.getLastRow() < 1 || sheet.getLastColumn() < 1) continue;
    var header = sheet
      .getRange(1, 1, 1, Math.min(sheet.getLastColumn(), 15))
      .getValues()[0]
      .join(" ")
      .toLowerCase();
    if (
      header.indexOf("estimated weight") !== -1 ||
      header.indexOf("cleanup date") !== -1
    ) {
      return sheet;
    }
  }
  return null;
}

function ensureCleanupHeaders_(cleanupSheet) {
  if (cleanupSheet.getLastRow() === 0) {
    cleanupSheet.appendRow(CLEANUP_LOG_HEADERS);
    return;
  }
  // If row 1 is blank, write headers there
  if (!cleanupSheet.getRange(1, 1).getValue()) {
    cleanupSheet.getRange(1, 1, 1, CLEANUP_LOG_HEADERS.length).setValues([
      CLEANUP_LOG_HEADERS,
    ]);
  }
}

/**
 * Run once from the Apps Script editor (select function → Run).
 * Creates/renames the Cleanup Logs tab + header row on the private spreadsheet.
 */
function setupPrivateCleanupLogsSheet() {
  var cleanupSheet = getPrivateCleanupSheet_();
  ensureCleanupHeaders_(cleanupSheet);
  alert_(
    'Private sheet ready.\n\nOpen the private spreadsheet and check the tab named "Cleanup Logs" (not Sheet1).\n\n' +
      "URL:\nhttps://docs.google.com/spreadsheets/d/" +
      CLEANUP_LOGS_SPREADSHEET_ID +
      "/edit",
  );
}

/**
 * Run once to copy existing Cleanup Logs rows from the PUBLIC spreadsheet
 * (the one this script is bound to) into the private spreadsheet.
 */
function migrateCleanupLogsFromPublicSheet() {
  var publicSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var publicSheet = findPublicCleanupSourceSheet_();

  if (!publicSheet) {
    var names = publicSpreadsheet
      .getSheets()
      .map(function (s) {
        return s.getName() + " (" + s.getLastRow() + " rows)";
      })
      .join("\n");
    alert_(
      'No Cleanup Logs source tab found on THIS spreadsheet:\n"' +
        publicSpreadsheet.getName() +
        '"\n\nTabs found:\n' +
        names +
        "\n\nMake sure you run this from Apps Script on the PUBLIC Requests spreadsheet, and that the old Cleanup Logs tab still exists there.",
    );
    return;
  }

  var privateSheet = getPrivateCleanupSheet_();
  ensureCleanupHeaders_(privateSheet);

  var lastRow = publicSheet.getLastRow();
  var lastCol = Math.max(
    publicSheet.getLastColumn(),
    CLEANUP_LOG_HEADERS.length,
  );

  if (lastRow < 2) {
    alert_(
      'Found tab "' +
        publicSheet.getName() +
        '" on "' +
        publicSpreadsheet.getName() +
        '", but it has no data rows (only ' +
        lastRow +
        " row).\n\nNothing to copy. If your old logs are on another Google Sheet, open that file and copy-paste the rows manually into the private Cleanup Logs tab.",
    );
    return;
  }

  var values = publicSheet.getRange(2, 1, lastRow, lastCol).getValues();
  var width = CLEANUP_LOG_HEADERS.length;
  var padded = [];
  for (var r = 0; r < values.length; r++) {
    var row = values[r];
    // Skip completely empty rows
    var hasData = false;
    for (var c = 0; c < row.length; c++) {
      if (row[c] !== "" && row[c] != null) {
        hasData = true;
        break;
      }
    }
    if (!hasData) continue;
    var out = row.slice(0, width);
    while (out.length < width) out.push("");
    padded.push(out);
  }

  if (padded.length === 0) {
    alert_(
      'Tab "' +
        publicSheet.getName() +
        '" has no non-empty data rows to copy.',
    );
    return;
  }

  var startRow = privateSheet.getLastRow() + 1;
  privateSheet
    .getRange(startRow, 1, startRow + padded.length - 1, width)
    .setValues(padded);

  alert_(
    "Copied " +
      padded.length +
      ' data row(s) from public tab "' +
      publicSheet.getName() +
      '"\n→ private tab "Cleanup Logs".\n\nOpen the private spreadsheet and select the Cleanup Logs tab:\nhttps://docs.google.com/spreadsheets/d/' +
      CLEANUP_LOGS_SPREADSHEET_ID +
      "/edit\n\nAfter checking, delete the Cleanup Logs tab on the public sheet.",
  );
}

/**
 * Run this if migrate did nothing — shows which spreadsheet/tabs the script can see.
 */
function diagnoseCleanupMigration() {
  var publicSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var publicLines = publicSpreadsheet.getSheets().map(function (s) {
    return (
      "- " +
      s.getName() +
      ": lastRow=" +
      s.getLastRow() +
      ", lastCol=" +
      s.getLastColumn()
    );
  });

  var privateLines = [];
  try {
    var privateSpreadsheet = getPrivateSpreadsheet_();
    privateLines = privateSpreadsheet.getSheets().map(function (s) {
      return (
        "- " +
        s.getName() +
        ": lastRow=" +
        s.getLastRow() +
        ", lastCol=" +
        s.getLastColumn()
      );
    });
  } catch (e) {
    privateLines = ["ERROR opening private spreadsheet: " + e];
  }

  alert_(
    "PUBLIC (script is bound here):\n" +
      publicSpreadsheet.getName() +
      "\n" +
      publicLines.join("\n") +
      "\n\nPRIVATE:\n" +
      privateLines.join("\n"),
  );
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
