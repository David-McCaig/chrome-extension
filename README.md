# Lightspeed Workorder Helper Chrome Extension

A Chrome extension that enhances the Lightspeed Retail (R-Series) workorder interface by adding custom functionality and buttons.

## Features

- 🛠️ **Custom Action Button**: Adds a "🛠️ Custom Action" button to Lightspeed workorder pages
- 📋 **Workorder ID Extraction**: Automatically extracts and displays workorder IDs from URLs
- 🎯 **Smart Element Detection**: Intelligently finds the best location to place custom buttons
- 🔄 **Dynamic Page Monitoring**: Automatically re-applies changes when page content updates
- 🎨 **Modern UI**: Beautiful popup interface with status indicators

## Installation

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd chrome-extension-react-template
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `build` folder from this project

### Production Installation

1. Build the extension: `npm run build`
2. The `build` folder contains all necessary files for distribution

## Usage

### Basic Usage

1. **Navigate to a Lightspeed workorder page** (URL format: `https://us.merchantos.com/?name=workbench.views.beta_workorder&form_name=view&id=129896&tab=details`)

2. **Look for the custom button** - it will appear as "🛠️ Custom Action" in one of these locations:
   - In existing button containers (toolbars, headers, etc.)
   - As a floating button in the top-right corner (if no suitable container is found)

3. **Click the button** to trigger custom actions and see the workorder ID

4. **Check the browser console** for detailed logs and debugging information

### Extension Popup

- Click the extension icon in your Chrome toolbar to open the popup
- The popup shows:
  - Current status (active/inactive on Lightspeed pages)
  - Feature list
  - Usage instructions
  - Refresh button to check current status

## Customization

### Adding Custom Logic

Edit `src/contentScript.ts` to add your own functionality:

```typescript
// In the click handler of the custom button:
customButton.addEventListener('click', () => {
  // Add your custom logic here
  console.log('Custom action triggered');
  
  // Example: Remove specific elements
  const elementsToRemove = document.querySelectorAll('.unwanted-class');
  elementsToRemove.forEach(el => el.remove());
  
  // Example: Add new functionality
  // Your custom code here...
});
```

### Removing Elements

To remove specific elements from the page, add their CSS selectors to the `selectorsToRemove` array:

```typescript
const selectorsToRemove: string[] = [
  '.some-unwanted-element',
  '.another-element-to-remove',
  '#specific-id-to-remove'
];
```

### Styling the Button

Modify the button styling in the `addCustomButton()` function:

```typescript
customButton.style.cssText = `
  background: #your-color;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
`;
```

## Development

### Project Structure

```
├── src/
│   ├── App.tsx              # Main popup component
│   ├── App.css              # Popup styles
│   ├── contentScript.ts     # Content script for page injection
│   └── main.tsx             # Entry point
├── public/
│   └── manifest.json        # Extension manifest
├── build/                   # Built extension files
└── vite.config.ts          # Build configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build extension for production
- `npm run preview` - Preview built extension

### Building for Production

1. Run `npm run build`
2. The `build` folder contains all files needed for the extension
3. Load the `build` folder in Chrome's extension manager

## Troubleshooting

### Extension Not Working

1. **Check console logs**: Open browser console (F12) and look for "Lightspeed Workorder Helper" messages
2. **Verify URL**: Make sure you're on a workorder page with the correct URL format
3. **Reload extension**: Go to `chrome://extensions/` and click the refresh icon on your extension
4. **Check permissions**: Ensure the extension has permission to access `us.merchantos.com`

### Button Not Appearing

1. **Wait for page load**: The button appears 2 seconds after page load
2. **Check page structure**: The extension looks for common button containers
3. **Manual placement**: If no container is found, a floating button will appear in the top-right

### Custom Actions Not Working

1. **Check console errors**: Look for JavaScript errors in the browser console
2. **Verify selectors**: Make sure CSS selectors in your custom code are correct
3. **Test in isolation**: Try your custom code in the browser console first

## Security Notes

- The extension only runs on `us.merchantos.com` domains
- No data is collected or transmitted outside the browser
- All functionality runs locally in the user's browser

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Lightspeed pages
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
