# Quick Setup Guide

## 🚀 Install the Extension

1. **Build the extension:**
   ```bash
   npm run build
   ```

2. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `build` folder from this project

## 🎯 Test the Extension

1. **Navigate to a Lightspeed workorder page:**
   - Go to: `https://us.merchantos.com/?name=workbench.views.beta_workorder&form_name=view&id=129896&tab=details`
   - Or any similar workorder URL

2. **Look for the custom button:**
   - A blue "🛠️ Custom Action" button should appear
   - It will be in a toolbar, header, or floating in the top-right

3. **Click the button:**
   - This will trigger the example custom actions
   - Check the browser console (F12) for detailed logs

## 🔧 Customize for Your Needs

Edit `src/contentScript.ts` and modify these functions:

- `removeSpecificElements()` - Add CSS selectors of elements to remove
- `addCustomFunctionality()` - Add your custom features
- `modifyExistingElements()` - Change existing page elements
- `extractWorkorderData()` - Extract data from the page

Then rebuild with `npm run build` and reload the extension.

## 📝 Example Customizations

### Remove Elements
```typescript
const elementsToRemove: string[] = [
  '.unwanted-sidebar',
  '.annoying-popup',
  '#specific-element'
];
```

### Add Custom Button Action
```typescript
customButton.addEventListener('click', () => {
  // Your custom code here
  console.log('Custom action triggered');
  
  // Example: Hide specific elements
  document.querySelectorAll('.hide-me').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
});
```

## 🐛 Troubleshooting

- **Button not appearing?** Wait 2-3 seconds for page load
- **Extension not working?** Check browser console for errors
- **Need to reload?** Go to `chrome://extensions/` and click refresh on the extension

## 📞 Support

Check the main README.md for detailed documentation and troubleshooting.
