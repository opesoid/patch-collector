# Patch Collector Chrome Extension

A browser extension that enhances your experience on the Line6 CustomTone website by providing advanced features for downloading and organizing guitar patches.

![Patch Collector](https://github.com/opesoid/patch-collector/blob/main/icons/icon128.png?raw=true)

## Features

- Download patches from multiple pages at once
- Save metadata with your patches (artist, model, genre, etc.)
- Search and filter patches before downloading
- Track download progress
- Customize your experience with various settings

## Supported Devices

This extension works with Line6 guitar processors including Helix and Pod Go series devices.

## Installation

### Chrome Web Store Status

⏳ The extension is currently under review by the Chrome Web Store team. Once approved, it will be available for direct installation from the store.

### Manual Installation (Current Method)

While the extension is under review, you can install it manually:

1. Download the latest release:
   - Go to the [Releases page](https://github.com/opesoid/patch-collector/releases)
   - Download the latest `.zip` file

2. Install in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked"
   - Select the extracted folder (if you downloaded the zip) or the cloned repository folder
   - The extension icon should appear in your browser toolbar

3. Verify Installation:
   - The Patch Collector icon should appear in your Chrome toolbar
   - Click the icon to ensure the popup opens
   - Visit [Line6 CustomTone](https://line6.com/customtone/) to test functionality

Note: When installing manually, Chrome may show a warning about developer mode extensions. This is normal for manually installed extensions and you can safely proceed.

## Usage

Full usage instructions are available in the extension's built-in guide which can be accessed by clicking the "User Guide" link in the extension popup.

### Important Requirement

**You must be logged into your Line6 CustomTone account to download patches.** The extension enhances the download functionality, but you still need a valid account to access the patches.

### Quick Start

1. Visit [Line6 CustomTone website](https://line6.com/customtone/) and log in to your account
2. Click the Patch Collector icon in your browser's extension toolbar
3. Toggle the switch at the top to enable the extension
4. Use the extension panel to download patches

## Development

### Project Structure

```
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

```


## Support

If you find this extension helpful, consider supporting its development:

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="150">](https://www.buymeacoffee.com/opesoid)

## Acknowledgments

- Thank you to all users who provided feedback and suggestions
- [Line6](https://line6.com/) for creating the CustomTone platform

## Contact

- Website: [opesoid.co.uk](https://opesoid.co.uk)
- GitHub: [opesoid](https://github.com/opesoid)
- Email: support@opesoid.co.uk 
