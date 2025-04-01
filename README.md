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

This extension works with the following Line6 devices:
- Helix Floor
- Helix LT
- Helix Rack
- Helix Native
- HX Effects
- HX Stomp
- Pod Go
- Pod Go Wireless

## Installation

### Chrome Web Store Status

⏳ The extension is currently under review by the Chrome Web Store team. Once approved, it will be available for direct installation from the store.

### Manual Installation (Current Method)

While the extension is under review, you can install it manually:

1. Get the source code:
   - Click the green "Code" button above
   - Click "Download ZIP" and extract it


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
patch-collector/
├── background.js      # Background script
├── content.js         # Content script
├── guide.html         # User guide
├── icon128.png        # Extension icon
├── icon48.png         # Extension icon
├── icon16.png         # Extension icon
├── manifest.json      # Extension manifest
├── popup.html         # Extension popup
├── popup.js           # Popup logic
└── styles.css         # Extension styles
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
