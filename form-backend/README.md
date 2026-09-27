# Form backend (Google Apps Script)

`Code.gs` receives the "Help me understand this" form and emails each
submission to `dan@lakehousetools.com`, with the asker as reply-to. If a
`SHEET_ID` script property is set, it also logs each lead as a row in that
Google Sheet.

## Deploy (as dan@lakehousetools.com)

1. Go to https://script.google.com → **New project**. Name it `lakehousetools form`.
2. Replace the contents of `Code.gs` with this file's `Code.gs`. Save.
3. Optional lead log: create a Google Sheet (e.g. "Lakehouse Tools leads"), copy
   its id from the URL (`docs.google.com/spreadsheets/d/<ID>/edit`), then in the
   script go to **Project Settings → Script properties → Add** `SHEET_ID` = `<ID>`.
4. In the editor, choose `testNotify` and click **Run**. Approve the permissions
   (send email as you; access the sheet). You should receive a test email.
5. **Deploy → New deployment → Select type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).
6. Put that URL in `src/site.config.ts` (`FORM_ENDPOINT`).

## Updating the script later

Edit the code, then **Deploy → Manage deployments → (pencil) → Version: New
version → Deploy**. That keeps the same URL; "New deployment" would create a new one.
