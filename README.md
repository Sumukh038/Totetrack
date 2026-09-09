**ToteTrack — Tote Box Management System**

ToteTrack is a web-based application for tracking reusable tote boxes as they move between the warehouse and operational locations.

It digitizes the dispatch and return process using **QR scanning, Google Apps Script, and Google Sheets**, providing real-time tote status and basic user management.

## 🚀 Features

* QR-based tote scanning
* Tote dispatch and return tracking
* Destination, driver, associate and condition tracking
* Duplicate dispatch prevention
* Automatic calculation of days out
* User authentication with Admin/User roles
* Offline transaction storage and synchronization
* Tote status tracking
* Overdue tote alerts and dashboard

The complete 🔄** ToteTrack process flow**: 

                 ┌─────────────────┐
                 │    OPEN APP     │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │ restoreSession  │
                 └────────┬────────┘
                          ↓
                  Logged in?
                    /       \
                  NO         YES
                  ↓           ↓
             Login screen   App
                              ↓
                         loadConfig()
                              ↓
                    ┌────────────────┐
                    │ Dispatch/Return│
                    └───────┬────────┘
                            ↓
                     Scan QR / Manual
                            ↓
                       onQRDetected()
                            ↓
                      Valid tote ID?
                       /          \
                     NO            YES
                     ↓              ↓
                   Error       scannedId
                                    ↓
                              Fill details
                                    ↓
                              submitScan()
                                    ↓
                            Internet available?
                              /            \
                            NO              YES
                            ↓                ↓
                      savePending()    postWithSession()
                            ↓                ↓
                       localStorage      Apps Script
                            ↓                ↓
                         Pending        Google Sheets/
                         Queue            backend
                            ↓
                     Internet returns
                            ↓
                      flushPending()

Each tote's dispatch and return information is maintained in a single transaction record, providing a clear operational and audit trail.

🛠️ Technology
Frontend: HTML, CSS, JavaScript
Backend: Google Apps Script
Database: Google Sheets
QR Scanning: Device Camera
Offline Storage: Browser Local Storage
Deployment: Progressive Web App (PWA)

The Google Sheets Database: https://docs.google.com/spreadsheets/d/1PWmIpwOqRrnfn_SPIHYBaZklRlr4PD0FXdCmEIXvgkU/edit?gid=898093323#gid=898093323 

🎯 Objective

ToteTrack aims to replace manual tote tracking with a simple, reliable and traceable digital workflow, while providing a foundation for expanding into a broader warehouse management / ERP system.
