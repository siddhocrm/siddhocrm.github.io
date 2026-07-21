// ============================================================
//  Siddho CRM — Google Apps Script Backend
//  INSTRUCTIONS:
//  1. Open your Google Sheet → Extensions → Apps Script
//  2. Delete all existing code and paste EVERYTHING below
//  3. Click Deploy → New Deployment
//     - Type: Web App
//     - Execute as: Me
//     - Who has access: Anyone
//  4. Click Deploy → Copy the Web App URL
//  5. Paste that URL into script.js where it says YOUR_APPS_SCRIPT_URL
// ============================================================

const SHEET_NAME = 'Sheet1'; // Change if your sheet tab has a different name

/**
 * Handles POST requests from the contact form.
 * Appends one new row per submission.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    // Add header row automatically on first submission if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Phone / WhatsApp', 'Business & Location', 'Interested Services']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#ffffff');
    }

    // Append the lead data
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('en-IN'),
      data.name || '',
      data.phone || '',
      data.business || '',
      data.services || ''
    ]);

    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Lead saved!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Return error details (useful for debugging)
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles GET requests (e.g. browser test / ping).
 * Useful to confirm the deployment is live.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Siddho CRM Apps Script is live!' }))
    .setMimeType(ContentService.MimeType.JSON);
}
