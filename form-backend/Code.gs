/**
 * lakehousetools.com "Help me understand this" form handler.
 *
 * Deployed as a Google Apps Script web app under dan@lakehousetools.com.
 * Each submission is emailed to NOTIFY_EMAIL (reply-to = the asker) and,
 * if a SHEET_ID script property is set, appended as a row to that sheet.
 *
 * Script properties (Project Settings -> Script properties), all optional:
 *   NOTIFY_EMAIL  where to send questions (default below)
 *   SHEET_ID      id of a Google Sheet to log leads into
 */
var DEFAULT_NOTIFY_EMAIL = 'dan@lakehousetools.com';
var MAX_PER_HOUR_PER_EMAIL = 5;

function doPost(e) {
  var p = (e && e.parameter) || {};
  var wantsHtml = !!p._redirect;

  // Bots fill the hidden field; pretend success and do nothing.
  if (p._gotcha) return respond_(true, 'ok', wantsHtml);

  var question = clean_(p.question, 4000);
  var name = clean_(p.name, 200);
  var email = clean_(p.email, 254);
  var company = clean_(p.company, 200);
  var source = clean_(p.source, 200);
  var page = clean_(p.page, 500);
  var subscribe = p.subscribe === 'yes' ? 'yes' : 'no';

  if (!question || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond_(false, 'Please fill in your question, name and a valid email.', wantsHtml);
  }

  // Simple abuse guard: a few submissions per email address per hour.
  var cache = CacheService.getScriptCache();
  var key = 'n:' + email.toLowerCase();
  var count = Number(cache.get(key) || 0);
  if (count >= MAX_PER_HOUR_PER_EMAIL) {
    return respond_(false, 'Too many questions from this address. Please try again later.', wantsHtml);
  }
  cache.put(key, String(count + 1), 3600);

  var props = PropertiesService.getScriptProperties();
  var to = props.getProperty('NOTIFY_EMAIL') || DEFAULT_NOTIFY_EMAIL;
  var submittedAt = new Date();

  var lines = [
    'Question:', question, '',
    'Name: ' + name,
    'Email: ' + email,
    'Company: ' + (company || '-'),
    'Wants updates: ' + subscribe,
    'Source: ' + (source || '-'),
    'Page: ' + (page || '-'),
    'Sent: ' + submittedAt.toISOString(),
  ];
  MailApp.sendEmail({
    to: to,
    replyTo: email,
    name: 'lakehousetools.com',
    subject: 'Question from ' + name + (company ? ' (' + company + ')' : '') + ' via lakehousetools.com',
    body: lines.join('\n'),
  });

  var sheetId = props.getProperty('SHEET_ID');
  if (sheetId) {
    try {
      var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Submitted', 'Name', 'Email', 'Company', 'Question', 'Wants updates', 'Source', 'Page']);
      }
      sheet.appendRow([submittedAt, name, email, company, question, subscribe, source, page]);
    } catch (err) {
      console.error('Sheet logging failed: ' + err); // the email already went out
    }
  }

  return respond_(true, 'ok', wantsHtml);
}

function doGet() {
  return ContentService.createTextOutput('lakehousetools.com form endpoint');
}

/** Run once from the editor to authorize the script and send yourself a test email. */
function testNotify() {
  doPost({ parameter: {
    question: 'Test question from the Apps Script editor',
    name: 'Test', email: DEFAULT_NOTIFY_EMAIL, source: 'Editor test', page: '-',
  }});
}

function clean_(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function respond_(ok, message, wantsHtml) {
  if (wantsHtml) {
    // Used when the browser posted the form without JavaScript.
    var text = ok ? "Thanks! Your question is on its way. I'll reply by email." : message;
    var html = '<p style="font:16px system-ui,sans-serif">' + text + '</p>' +
      '<p style="font:16px system-ui,sans-serif"><a href="https://www.lakehousetools.com/" target="_top">Back to lakehousetools.com</a></p>';
    return HtmlService.createHtmlOutput(html).setTitle('Lakehouse Tools');
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: ok, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
