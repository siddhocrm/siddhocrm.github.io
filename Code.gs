function doPost(e) {
  // 1. Get the active spreadsheet and the first sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    // 2. Extract the data from the POST request
    const timestamp = e.parameter.timestamp || new Date().toLocaleString();
    const name = e.parameter.name || "";
    const phone = e.parameter.phone || "";
    const business = e.parameter.business || "";
    const services = e.parameter.services || "";

    // 3. Append the data as a new row in the sheet
    // Make sure your Google Sheet has these exact headers in the first row:
    // Timestamp | Name | Phone | Business | Services
    sheet.appendRow([timestamp, name, phone, business, services]);

    // 4. Return a success response
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return an error response if something goes wrong
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// A simple doGet function so you can test if the Web App is online by visiting its URL in a browser
function doGet(e) {
  return ContentService.createTextOutput("The web app is running and ready to receive POST requests.");
}
