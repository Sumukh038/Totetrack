// ════════════════════════════════════════════════════════════════
//  ToteTrack — Google Apps Script backend
//  Paste this entire file into your Apps Script editor
//  (Extensions > Apps Script inside your Google Sheet)
// ════════════════════════════════════════════════════════════════

// Name of your main sheet tab
const SHEET_NAME = 'ToteLog';

// Alert threshold in days — email is sent if tote is out longer than this
const ALERT_THRESHOLD_DAYS = 3;

// Your email address for alerts
const ALERT_EMAIL = 'your-email@gmail.com';


// ────────────────────────────────────────────────────────────────
//  doPost — receives scan data from the PWA
//  This runs every time the phone submits a scan
// ────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const action = data.action; // 'dispatch' or 'return'

    if (action === 'dispatch') {
      // Add a new row for this dispatch
      sheet.appendRow([
        data.toteId,
        data.timestamp,       // Dispatch date & time
        '',                   // Return date & time (blank until returned)
        'Out of warehouse',   // Status
        data.destination,
        data.driver,
        data.contents || '',
        '',                   // Days out (calculated below)
        '',                   // Condition (blank until return)
        data.notes || ''
      ]);
      colorLastRow(sheet, '#F7C1C1');  // Red for out of warehouse

    } else if (action === 'return') {
      // Find the most recent open dispatch for this tote ID
      const lastRow = findLastDispatch(sheet, data.toteId);

      if (lastRow) {
        const dispatchCell = sheet.getRange(lastRow, 2).getValue();
        const dispatchDate = new Date(dispatchCell);
        const returnDate   = new Date(data.timestamp);
        const daysOut      = Math.round((returnDate - dispatchDate) / (1000 * 60 * 60 * 24));

        sheet.getRange(lastRow, 3).setValue(data.timestamp);      // Return date
        sheet.getRange(lastRow, 4).setValue('In warehouse');       // Status
        sheet.getRange(lastRow, 6).setValue(data.associate);       // Associate
        sheet.getRange(lastRow, 8).setValue(daysOut);              // Days out
        sheet.getRange(lastRow, 9).setValue(data.condition);       // Condition
        sheet.getRange(lastRow, 10).setValue(data.notes || '');    // Notes
        colorRow(sheet, lastRow, '#C0DD97');  // Green for returned
      } else {
        // Tote returned but no dispatch found — add a note row anyway
        sheet.appendRow([
          data.toteId, '', data.timestamp, 'In warehouse',
          '', data.associate, '', '', data.condition, 'Return without dispatch record'
        ]);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}


// ────────────────────────────────────────────────────────────────
//  findLastDispatch — finds the last row with this tote ID
//  that has no return date yet
// ────────────────────────────────────────────────────────────────
function findLastDispatch(sheet, toteId) {
  const data     = sheet.getDataRange().getValues();
  let   lastRow  = null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === toteId && data[i][3] === 'Out of warehouse') {
      lastRow = i + 1; // +1 because getDataRange is 0-indexed, sheet rows are 1-indexed
    }
  }
  return lastRow;
}


// ────────────────────────────────────────────────────────────────
//  colorLastRow / colorRow — apply background color to row
// ────────────────────────────────────────────────────────────────
function colorLastRow(sheet, hex) {
  const last = sheet.getLastRow();
  sheet.getRange(last, 1, 1, sheet.getLastColumn()).setBackground(hex);
}

function colorRow(sheet, row, hex) {
  sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground(hex);
}


// ────────────────────────────────────────────────────────────────
//  checkOverdueTotes — runs on a timer (set it to every day)
//  Sends you an email if any tote has been out more than 3 days
// ────────────────────────────────────────────────────────────────
function checkOverdueTotes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data  = sheet.getDataRange().getValues();
  const now   = new Date();
  const overdue = [];

  for (let i = 1; i < data.length; i++) {
    const status       = data[i][3];
    const dispatchTime = data[i][1];
    if (status === 'Out of warehouse' && dispatchTime) {
      const daysOut = (now - new Date(dispatchTime)) / (1000 * 60 * 60 * 24);
      if (daysOut > ALERT_THRESHOLD_DAYS) {
        overdue.push({
          toteId:      data[i][0],
          daysOut:     Math.round(daysOut),
          destination: data[i][4],
          driver:      data[i][5]
        });
      }
    }
  }

  if (overdue.length === 0) return;

  const lines = overdue.map(t =>
    `• ${t.toteId} — ${t.daysOut} days out — at ${t.destination} — driver: ${t.driver}`
  ).join('\n');

  MailApp.sendEmail({
    to:      ALERT_EMAIL,
    subject: `⚠️ ${overdue.length} tote box(es) overdue — ToteTrack alert`,
    body:    `The following tote boxes have been out of the warehouse for more than ${ALERT_THRESHOLD_DAYS} days:\n\n${lines}\n\nPlease follow up with the driver or field team.\n\n— ToteTrack`
  });
}


// ────────────────────────────────────────────────────────────────
//  setupSheet — run this ONCE manually to create the header row
//  In Apps Script editor: select this function and click Run
// ────────────────────────────────────────────────────────────────
function setupSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Only add header if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Tote ID',
      'Dispatch date & time',
      'Return date & time',
      'Status',
      'Destination / machine',
      'Driver / associate',
      'Contents',
      'Days out',
      'Condition',
      'Notes'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#111111').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, 10, 160);
  }

  SpreadsheetApp.getUi().alert('Sheet set up successfully! You can now deploy the web app.');
}
