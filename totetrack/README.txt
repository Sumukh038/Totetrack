# ToteTrack PWA — Complete Setup Guide

## What you will build
A phone app (installable, works offline) that warehouse staff use to
scan tote box QR codes. Scans automatically update your Google Sheet.

---

## FILES IN THIS FOLDER
- index.html      ← The entire app (all screens, camera, forms)
- manifest.json   ← Makes it installable on phones
- sw.js           ← Lets it work offline
- appsscript.gs   ← Paste this into Google Apps Script (the backend)
- icon-192.png    ← App icon (create this — instructions below)
- icon-512.png    ← App icon large size

---

## STEP 1 — Install the tools you need (one time only)

1. Download and install Visual Studio Code (VS Code) from:
   https://code.visualstudio.com

2. Download and install Git from:
   https://git-scm.com/downloads
   During install: accept all defaults, click Next through everything.

3. Create a free GitHub account at:
   https://github.com
   (This is where your app will be hosted for free.)

---

## STEP 2 — Create your app icons

You need two square PNG images: 192×192 px and 512×512 px.
The simplest way for a beginner:

1. Go to https://favicon.io/favicon-generator/
2. Type "TT" as the text, pick a background colour (e.g. #111111),
   set text colour to white.
3. Click Download.
4. Inside the downloaded ZIP, find the PNG files.
5. Rename one to icon-192.png and one to icon-512.png.
6. Put both files in the totetrack folder alongside index.html.

---

## STEP 3 — Set up the Google Sheet (backend)

A. Open Google Sheets at https://sheets.google.com
B. Create a new blank spreadsheet. Name it "ToteTrack Database".
C. Click Extensions → Apps Script (opens a new tab).
D. Delete the default code in the editor completely.
E. Open the file appsscript.gs from this folder in any text editor
   (Notepad, VS Code, etc.), select all, copy.
F. Paste it into the Apps Script editor.
G. Change this line near the top to your real email address:
      const ALERT_EMAIL = 'your-email@gmail.com';
H. Save (Ctrl+S or Cmd+S). Name the project "ToteTrack".
I. In the function dropdown at the top, select "setupSheet".
   Click the Run (▶) button.
   → It will ask for permissions — click "Review permissions",
     choose your Google account, click "Advanced" → "Go to ToteTrack",
     click "Allow".
   → You should see "Sheet set up successfully!" in the spreadsheet.

J. Now deploy it as a web app:
   - Click "Deploy" button (top right) → "New deployment"
   - Click the gear icon next to "Select type" → choose "Web app"
   - Description: "ToteTrack v1"
   - Execute as: "Me"
   - Who has access: "Anyone"  ← important, otherwise the app can't post
   - Click "Deploy"
   - Copy the long URL that appears — it looks like:
     https://script.google.com/macros/s/AKfyc.../exec
   - SAVE THIS URL — you will need it in Step 4.

K. Set up the daily overdue alert:
   - In Apps Script, click "Triggers" (clock icon on the left sidebar).
   - Click "+ Add Trigger" (bottom right).
   - Function: checkOverdueTotes
   - Event source: Time-driven
   - Type: Day timer
   - Time: 8am to 9am
   - Click Save.
   → Every morning at 8am, if any tote is overdue, you get an email.

---

## STEP 4 — Add your Apps Script URL to the app

1. Open index.html in VS Code.
2. Find this line near the top of the <script> section:
      const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
3. Replace YOUR_APPS_SCRIPT_URL_HERE with the URL you copied in Step 3J.
   It should look like:
      const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfyc.../exec';
4. Save the file (Ctrl+S).

---

## STEP 5 — Test it locally before deploying

1. Open VS Code.
2. Install the extension "Live Server":
   - Click the Extensions icon on the left sidebar (looks like 4 squares).
   - Search for "Live Server" by Ritwick Dey.
   - Click Install.
3. Open your totetrack folder in VS Code:
   File → Open Folder → select the totetrack folder.
4. Right-click on index.html → "Open with Live Server".
5. Your browser opens at http://127.0.0.1:5500
6. Test: type TB001 in the manual input, click Use,
   fill in the form, click Record dispatch.
   → Check your Google Sheet — a new row should appear.

NOTE: Camera scanning only works on HTTPS (after deployment),
not on localhost. Manual entry always works.

---

## STEP 6 — Deploy to GitHub Pages (free hosting with HTTPS)

A. Create a new repository on GitHub:
   1. Go to https://github.com, click the + icon → "New repository".
   2. Repository name: totetrack
   3. Set it to Public.
   4. Do NOT tick "Add README" — leave all options unticked.
   5. Click "Create repository".
   6. Copy the repository URL shown (e.g. https://github.com/YOURNAME/totetrack.git).

B. Open Terminal (Mac/Linux) or Command Prompt (Windows).
   On Windows: press Windows key, type "cmd", press Enter.
   On Mac: press Cmd+Space, type "terminal", press Enter.

C. Navigate to your totetrack folder. Type these commands one by one,
   pressing Enter after each:

   cd Desktop/totetrack
   (If your folder is elsewhere, adjust the path accordingly.)

D. Set up Git and push the files:

   git init
   git add .
   git commit -m "Initial ToteTrack PWA"
   git branch -M main
   git remote add origin https://github.com/YOURNAME/totetrack.git
   git push -u origin main

   Replace YOURNAME with your actual GitHub username.
   Git will ask for your GitHub username and password.
   (For password, use a Personal Access Token — see note below.)

   GitHub Personal Access Token:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
     → Tokens (classic) → Generate new token.
   - Give it a name, tick "repo" scope, click Generate.
   - Copy the token and use it as your password when Git asks.

E. Enable GitHub Pages:
   1. Go to your repository page on GitHub
      (https://github.com/YOURNAME/totetrack).
   2. Click "Settings" tab.
   3. Click "Pages" in the left sidebar.
   4. Under "Branch", select "main", folder "/root", click Save.
   5. Wait 2 minutes. Refresh the page.
   6. You will see: "Your site is published at
      https://YOURNAME.github.io/totetrack/"

---

## STEP 7 — Install it on your phone

Android (Chrome):
1. Open Chrome on your Android phone.
2. Go to: https://YOURNAME.github.io/totetrack/
3. Tap the three-dot menu → "Add to Home screen" → "Add".
4. The ToteTrack icon appears on your home screen like an app.
5. Open it — tap "Start QR scanner", allow camera access.

iPhone (Safari):
1. Open Safari (must be Safari, not Chrome) on iPhone.
2. Go to: https://YOURNAME.github.io/totetrack/
3. Tap the Share button (box with arrow) → "Add to Home Screen" → "Add".

---

## STEP 8 — Share with warehouse staff

Just send them the URL: https://YOURNAME.github.io/totetrack/

They open it in Chrome, tap "Add to Home Screen", and from then on
use it like any other app. No app store, no installation, no account needed.

---

## HOW TO UPDATE THE APP LATER

Whenever you make a change to any file:
1. Save the file in VS Code.
2. In Terminal, navigate to the totetrack folder.
3. Run:
   git add .
   git commit -m "describe what you changed"
   git push
4. GitHub Pages updates automatically within 1-2 minutes.

---

## QUICK REFERENCE — the full file list

totetrack/
├── index.html       ← Edit this for UI changes
├── manifest.json    ← Only edit name/colors
├── sw.js            ← Don't edit unless you know what you're doing
├── appsscript.gs    ← Lives in Google Apps Script, not this folder
├── icon-192.png     ← App icon
└── icon-512.png     ← App icon (large)
