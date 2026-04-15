# ⚠️ IMPORTANT NOTICE ⚠️

## **As of 15th April 2026 this project will no longer be maintained via GiutHub and may be out of date.**

**I will update this extension exclusively via the [Chrome Web Store](https://chromewebstore.google.com/detail/patch-collector/oimeamnghaeobjknbcgjmcpheplnmjpg) from now on. Moving forward, this project will no longer be open-source.**

---

If you have questions or run into any issues, please contact me.

- Website: https://opes.dev  
- Support Email: support@opes.dev  
- GitHub: https://github.com/opesoid 

---

# Patch Collector Chrome Extension

A browser extension that enhances your experience on the Line6 CustomTone website by providing advanced features for downloading and organizing guitar patches.

![Patch Collector](https://github.com/opesoid/patch-collector/blob/main/icons/icon128.png?raw=true)

## Features

- Download patches from multiple pages at once
- Search and filter patches before downloading
- Track download progress

## Supported Devices

This extension works with Line6 guitar processors including Helix and Pod Go series devices.

## Installation

### Official Installation (Recommended)

The easiest and most secure way to install Patch Collector is directly through the official Chrome Web Store. This ensures you always receive the latest features and automatic background updates.

👉 **[Install Patch Collector from the Chrome Web Store](https://chromewebstore.google.com/detail/patch-collector/oimeamnghaeobjknbcgjmcpheplnmjpg)**

### Manual Installation (Alternative/Legacy)

This method is primarily for developers or users who need to install a specific legacy version from this archived repository.

1.  **Download the Source Code:**
    * Download the [Source Code](https://github.com/opesoid/patch-collector/archive/refs/heads/main.zip) from this GitHub repo.
    * **Important:** Unzip the downloaded file into a dedicated folder on your computer. Remember where you save this folder.

2.  **Install in Chrome:**
    * Open Google Chrome.
    * Type `chrome://extensions/` into the address bar and press Enter.
    * Enable "Developer mode" using the toggle switch in the top-right corner of the page.
    * Click the "Load unpacked" button that appears.
    * Navigate to and select the folder where you **unzipped** the downloaded source code in Step 1.
    * The Patch Collector extension icon should now appear in your browser toolbar and in the list on the `chrome://extensions/` page.

3.  **Verify Installation:**
    * Click the Patch Collector icon in your Chrome toolbar to ensure the popup window opens correctly.
    * Visit the [Line6 CustomTone website](https://line6.com/customtone/) and log in to check if the extension's features appear on the page.

**Note:** When installing manually, Chrome might display a warning like "Disable developer mode extensions" upon restarting. This is expected. However, be aware that manually installed extensions do not update automatically. 

## Usage

Full usage instructions are available in the extension's built-in guide which can be accessed by clicking the "User Guide" link in the extension popup.

### Important Requirement

**You must be logged into your Line6 CustomTone account to download patches.** The extension enhances the download functionality, but you still need a valid account to access the patches.

### Quick Start

1. Visit the [Line6 CustomTone website](https://line6.com/customtone/) and log in to your account
2. Click the Patch Collector icon in your browser's extension toolbar
3. Toggle the switch at the top to enable the extension
4. Use the extension panel to download patches

## Development

### Project Structure

```text
.
├── manifest.json              # Extension manifest file
├── README.md                  # This README file
├── guide.html                 # User guide page
├── privacy_policy.html        # Privacy policy page
│
├── css/
│   └── styles.css             # Main CSS styles for content script UI
│
├── icons/
│   ├── icon16.png             # Extension icon (16x16)
│   ├── icon48.png             # Extension icon (48x48)
│   └── icon128.png            # Extension icon (128x128)
│
├── js/
│   ├── constants.js           # Constant values
│   ├── content.js             # Content script injected into CustomTone pages
│   ├── downloader.js          # Handles patch downloading logic
│   ├── modal.js               # UI logic for modals
│   ├── progress.js            # UI logic for progress indicators
│   ├── ui.js                  # Builds the main extension UI panel
│   └── utils.js               # Utility functions (parsing, helpers)
│
└── popup/
    ├── popup.html             # HTML for the browser action popup
    └── popup.js               # JavaScript logic for the popup
