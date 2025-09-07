# Customer Modal Feature

## Overview
This Chrome extension now includes a customer information modal that displays when the custom action button is clicked on Lightspeed workorder pages.

## Features

### 1. Custom Action Button
- Automatically appears on Lightspeed workorder pages
- Located next to the Checkout button
- Triggers customer data extraction and modal display

### 2. Customer Information Modal
The modal displays the following customer information:
- **Workorder ID**: Extracted from the URL
- **Customer Name**: Extracted from various form fields
- **Mobile Number**: Extracted from phone/mobile fields
- **Email Address**: Extracted from email fields (if available)
- **Address**: Extracted from address fields (if available)

### 3. Modal Features
- **Copy Info Button**: Copies customer name and mobile to clipboard
- **Close Button**: Closes the modal
- **Escape Key**: Closes the modal
- **Outside Click**: Closes the modal
- **Responsive Design**: Works on different screen sizes

## How It Works

### Data Extraction
The extension attempts to extract customer data using multiple strategies:

1. **Form Field Detection**: Looks for common field names and selectors
2. **Pattern Matching**: Uses regex to find phone numbers and emails in page text
3. **Fallback**: Uses sample data if extraction fails

### Modal Display
- **Content Script**: Creates and displays the modal directly on the page
- **Extension Popup**: Also includes a "Show Customer Info" button for testing

## Usage

### Method 1: Custom Action Button
1. Navigate to a Lightspeed workorder page
2. Look for the "🛠️ Custom Action" button
3. Click the button to extract and display customer information

### Method 2: Extension Popup
1. Click the extension icon in your browser
2. If on a Lightspeed page, click "👤 Show Customer Info"
3. View sample customer data in the modal

## Technical Implementation

### Files Modified/Created:
- `src/contentScript.ts`: Added customer data extraction and modal display
- `src/components/CustomerModal.tsx`: Created shadcn dialog component
- `src/components/ui/dialog.tsx`: Added shadcn dialog UI components
- `src/App.tsx`: Added modal integration to extension popup

### Dependencies Added:
- `@radix-ui/react-dialog`: For modal functionality

## Future Enhancements
- Real-time data extraction from page
- Integration with Chrome storage API
- Export functionality
- Customizable field mapping
- Better error handling and user feedback
