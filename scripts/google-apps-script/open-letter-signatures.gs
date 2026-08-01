/**
 * Google Apps Script — bind this to the Open Letter Signatures spreadsheet:
 * https://docs.google.com/spreadsheets/d/1fQJXLQJHRPYhO78XrDNiikCb2ci_rlU_upVocCwlqJo/edit
 *
 * Setup:
 * 1. Open that spreadsheet → Extensions → Apps Script
 * 2. Paste this file (replace any default Code.gs)
 * 3. Deploy → New deployment → Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Copy the /exec URL into GOOGLE_SHEETS_OPEN_LETTER_WEBHOOK_URL
 *    (Vercel + .env.local) and redeploy the site
 *
 * This script only writes open-letter rows. It is not shared with mesh bags
 * or cleanup logs.
 */

var SCRIPT_VERSION = "open-letter-v1-2026-08-01";

var OPEN_LETTER_HEADERS = [
  "ID",
  "Signed At",
  "Full Name",
  "Town",
  "Postcode",
  "Joined WhatsApp Group",
];

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getSignaturesSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Signatures");
  if (!sheet) {
    var sheets = spreadsheet.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      sheet = sheets[0];
      sheet.setName("Signatures");
    } else {
      sheet = spreadsheet.insertSheet("Signatures");
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(OPEN_LETTER_HEADERS);
  }
  return sheet;
}

/**
 * Run once from the editor to prove writes work on THIS spreadsheet.
 */
function testWriteOpenLetterSignature() {
  var sheet = getSignaturesSheet_();
  sheet.appendRow([
    "manual-test-" + Date.now(),
    new Date().toLocaleString("en-GB"),
    "Manual Test",
    "North Shields",
    "NE30 4NT",
    "no",
  ]);
}

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    if (data.type !== "open-letter-signature") {
      return jsonResponse_({
        ok: false,
        error: "unsupported_type",
        version: SCRIPT_VERSION,
      });
    }

    var sheet = getSignaturesSheet_();
    sheet.appendRow([
      data.id || "",
      data.signedAt || "",
      data.fullName || "",
      data.town || "",
      data.postcode || "",
      data.joinedWhatsapp || "",
    ]);

    return jsonResponse_({
      ok: true,
      target: "open-letter-signatures",
      version: SCRIPT_VERSION,
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error),
      version: SCRIPT_VERSION,
    });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    service: "open-letter-signatures",
    version: SCRIPT_VERSION,
  });
}
