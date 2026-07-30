/**
 * Google Apps Script — bind this to the PRIVATE Cleanup Logs spreadsheet:
 * https://docs.google.com/spreadsheets/d/1C_o20LeFVjAPRmaL-GPBcTFr6Cua9XN99H2ZdeFhC68/edit
 *
 * Then: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the /exec URL into GOOGLE_SHEETS_WEBHOOK_URL (Vercel + .env.local) and redeploy.
 *
 * Optional: set DROPOFFS_SPREADSHEET_ID to a public mesh-bag spreadsheet ID
 * so drop-off rows go to a separate public file.
 */

var SCRIPT_VERSION = "private-v6-2026-07-30";

/** Optional public mesh-bag drop-offs spreadsheet ID (from /d/<ID>/edit). Leave blank to use active. */
var DROPOFFS_SPREADSHEET_ID = "";

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

var DROPOFF_HEADERS = [
  "ID",
  "Submitted At",
  "Quantity",
  "Location ID",
  "Location Label",
  "Location Other",
  "Dropped At",
  "Maker Name",
];

var ADMIN_TIME_HEADERS = [
  "ID",
  "Submitted At",
  "Work Date",
  "Duration Minutes",
  "Category",
  "Category Label",
  "Person Name",
  "Notes",
];

var WILDLIFE_HEADERS = [
  "ID",
  "Submitted At",
  "Status",
  "Beach ID",
  "Beach Name",
  "Date Observed",
  "Time Observed",
  "Animal Type",
  "Animal Type Label",
  "Species",
  "Count",
  "Condition",
  "Condition Label",
  "Description",
  "Has Supporting Evidence",
  "Email",
  "Reporter Name",
];

var OPEN_LETTER_HEADERS = [
  "ID",
  "Signed At",
  "Full Name",
  "Address",
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

function getDropoffsSheet_() {
  var spreadsheet;
  if (DROPOFFS_SPREADSHEET_ID) {
    spreadsheet = SpreadsheetApp.openById(DROPOFFS_SPREADSHEET_ID);
  } else {
    spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  }
  var sheet = spreadsheet.getSheetByName("Bag Drop-offs");
  if (!sheet) {
    sheet = spreadsheet.insertSheet("Bag Drop-offs");
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(DROPOFF_HEADERS);
  }
  return sheet;
}

function getAdminTimeSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Admin Time");
  if (!sheet) {
    sheet = spreadsheet.insertSheet("Admin Time");
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ADMIN_TIME_HEADERS);
  }
  return sheet;
}

function getWildlifeSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Wildlife Reports");
  if (!sheet) {
    sheet = spreadsheet.insertSheet("Wildlife Reports");
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(WILDLIFE_HEADERS);
  }
  return sheet;
}

function getOpenLetterSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Open Letter Signatures");
  if (!sheet) {
    sheet = spreadsheet.insertSheet("Open Letter Signatures");
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(OPEN_LETTER_HEADERS);
  }
  return sheet;
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

    if (data.type === "mesh-bag-dropoff") {
      var dropoffSheet = getDropoffsSheet_();
      dropoffSheet.appendRow([
        data.id || "",
        data.submittedAt || "",
        data.quantity || "",
        data.locationId || "",
        data.locationLabel || "",
        data.locationOther || "",
        data.droppedAt || "",
        data.makerName || "",
      ]);
      return jsonResponse_({
        ok: true,
        target: DROPOFFS_SPREADSHEET_ID
          ? "public-bag-dropoffs"
          : "active-bag-dropoffs",
        version: SCRIPT_VERSION,
      });
    }

    if (data.type === "admin-time-log") {
      var adminSheet = getAdminTimeSheet_();
      adminSheet.appendRow([
        data.id || "",
        data.submittedAt || "",
        data.workDate || "",
        data.durationMinutes || "",
        data.category || "",
        data.categoryLabel || "",
        data.personName || "",
        data.notes || "",
      ]);
      return jsonResponse_({
        ok: true,
        target: "admin-time",
        version: SCRIPT_VERSION,
      });
    }

    if (data.type === "wildlife-report") {
      var wildlifeSheet = getWildlifeSheet_();
      wildlifeSheet.appendRow([
        data.id || "",
        data.submittedAt || "",
        data.status || "pending",
        data.beachId || "",
        data.beachName || "",
        data.dateObserved || "",
        data.timeObserved || "",
        data.animalType || "",
        data.animalTypeLabel || "",
        data.species || "",
        data.count || "",
        data.condition || "",
        data.conditionLabel || "",
        data.description || "",
        data.hasSupportingEvidence === true ? "yes" : "no",
        data.email || "",
        data.reporterName || "",
      ]);
      return jsonResponse_({
        ok: true,
        target: "wildlife-reports",
        version: SCRIPT_VERSION,
      });
    }

    if (data.type === "open-letter-signature") {
      var openLetterSheet = getOpenLetterSheet_();
      openLetterSheet.appendRow([
        data.id || "",
        data.signedAt || "",
        data.fullName || "",
        data.address || "",
      ]);
      return jsonResponse_({
        ok: true,
        target: "open-letter-signatures",
        version: SCRIPT_VERSION,
      });
    }

    return jsonResponse_({
      ok: false,
      version: SCRIPT_VERSION,
      error: "unknown_type",
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
