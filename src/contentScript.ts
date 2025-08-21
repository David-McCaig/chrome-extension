// Content script for Lightspeed Retail workorders
console.log('Lightspeed Workorder Helper: Content script loaded - Version 2.0');

// Function to check if we're on a workorder page
function isWorkorderPage(): boolean {
  return window.location.href.includes('workbench.views.beta_workorder') && 
         window.location.href.includes('form_name=view');
}

// Function to add custom button to the page
function addCustomButton() {
  // Check if button already exists to prevent duplicates
  const existingButtons = document.querySelectorAll('[data-custom-button]');
  if (existingButtons.length > 0) {
    console.log(`Found ${existingButtons.length} existing custom buttons, skipping...`);
    return;
  }

  // Wait for the page to be fully loaded
  setTimeout(() => {
    // First, try to find the Checkout button specifically
    const checkoutButton = findCheckoutButton();
    
    if (checkoutButton) {
      // Insert our button right after the Checkout button
      insertButtonAfterCheckout(checkoutButton);
    } else {
      // Fallback: look for other button containers
      insertButtonInContainer();
    }
  }, 2000); // Wait 2 seconds for page to load
}

// Function to find the Checkout button
function findCheckoutButton(): Element | null {
  // Try multiple selectors to find the Checkout button (removing invalid :contains selectors)
  const checkoutSelectors = [
    'button[title*="Checkout"]',
    'button[aria-label*="Checkout"]',
    'button[title*="checkout"]',
    'button[aria-label*="checkout"]',
    '[class*="checkout"]',
    '[id*="checkout"]'
  ];

  // First try attribute-based selectors
  for (const selector of checkoutSelectors) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log('Found Checkout button by selector:', selector, elements[0]);
        return elements[0];
      }
    } catch (e) {
      console.log('Invalid selector:', selector);
    }
  }

  // Then search by text content
  const allButtons = document.querySelectorAll('button, a, .btn, [role="button"], input[type="button"], input[type="submit"]');
  for (const button of allButtons) {
    const text = button.textContent?.toLowerCase().trim() || '';
    const value = (button as HTMLInputElement).value?.toLowerCase().trim() || '';
    
    if (text.includes('checkout') || value.includes('checkout')) {
      console.log('Found Checkout button by text search:', button, 'Text:', text || value);
      return button;
    }
  }

  console.log('No Checkout button found');
  return null;
}

// Function to insert button after the Checkout button
function insertButtonAfterCheckout(checkoutButton: Element) {
  // Double-check for duplicates right before insertion
  const existingButtons = document.querySelectorAll('[data-custom-button]');
  if (existingButtons.length > 0) {
    console.log('Button already exists, aborting insertion');
    return;
  }
  
  const customButton = createCustomButton();
  
  // Get the parent container of the Checkout button
  const parentContainer = checkoutButton.parentElement;
  
  if (parentContainer) {
    // Insert the button right after the Checkout button in the same container
    parentContainer.insertBefore(customButton, checkoutButton.nextSibling);
    
    // Force alignment by setting container properties if needed
    const containerStyle = window.getComputedStyle(parentContainer);
    if (containerStyle.display === 'flex') {
      (customButton as HTMLElement).style.alignSelf = 'center';
    }
    
    console.log('Custom button inserted after Checkout button in same container');
    console.log('Parent container display:', containerStyle.display);
    console.log('Parent container align-items:', containerStyle.alignItems);
  } else {
    console.log('No parent container found for Checkout button');
  }
}

// Function to insert button in a container (fallback)
function insertButtonInContainer() {
  // Double-check for duplicates right before insertion
  const existingButtons = document.querySelectorAll('[data-custom-button]');
  if (existingButtons.length > 0) {
    console.log('Button already exists, aborting container insertion');
    return;
  }
  
  // Look for a good place to insert the button
  const possibleContainers = [
    '.action-buttons',
    '.toolbar',
    '.header-actions',
    '.page-header',
    '.workorder-header',
    '.details-header',
    '.btn-group',
    '.button-container',
    '.actions',
    '.controls'
  ];

  let container: Element | null = null;
  
  for (const selector of possibleContainers) {
    container = document.querySelector(selector);
    if (container) break;
  }

  // If no specific container found, try to find any button area
  if (!container) {
    const buttons = document.querySelectorAll('button');
    if (buttons.length > 0) {
      container = buttons[0].parentElement;
    }
  }

  // If still no container, create one
  if (!container) {
    container = document.createElement('div');
    (container as HTMLElement).style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: white;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(container);
  }

  const customButton = createCustomButton();
  container.appendChild(customButton);
  
  console.log('Custom button added to container');
}

// Function to create the custom button
function createCustomButton(): HTMLElement {
  const customButton = document.createElement('button');
  customButton.textContent = '🛠️ Custom Action';
  customButton.setAttribute('data-custom-button', 'true');
  
  // Try to match the Checkout button's styling
  const checkoutButton = findCheckoutButton();
  let buttonStyle = `
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin: 0 5px;
    height: auto;
    line-height: 1.2;
    display: inline-block;
    vertical-align: middle;
    transition: background-color 0.2s ease;
    white-space: nowrap;
  `;
  
  // If we found a Checkout button, try to match its styling
  if (checkoutButton) {
    const checkoutStyle = window.getComputedStyle(checkoutButton as HTMLElement);
    buttonStyle = `
      background: #007bff;
      color: white;
      border: ${checkoutStyle.border || 'none'};
      padding: ${checkoutStyle.padding || '8px 16px'};
      border-radius: ${checkoutStyle.borderRadius || '4px'};
      cursor: pointer;
      font-size: ${checkoutStyle.fontSize || '14px'};
      margin: ${checkoutStyle.margin || '0 5px'};
      height: ${checkoutStyle.height || 'auto'};
      line-height: ${checkoutStyle.lineHeight || '1.2'};
      display: ${checkoutStyle.display || 'inline-block'};
      vertical-align: ${checkoutStyle.verticalAlign || 'middle'};
      transition: background-color 0.2s ease;
      white-space: nowrap;
      font-family: ${checkoutStyle.fontFamily || 'inherit'};
      font-weight: ${checkoutStyle.fontWeight || 'normal'};
      box-sizing: ${checkoutStyle.boxSizing || 'border-box'};
      min-height: ${checkoutStyle.height || 'auto'};
      margin-left: 5px;
    `;
  }
  
  customButton.style.cssText = buttonStyle;

  // Add a small delay to apply additional alignment fixes after insertion
  setTimeout(() => {
    // Try to match the Checkout button's position more precisely
    if (checkoutButton) {
      const checkoutRect = (checkoutButton as HTMLElement).getBoundingClientRect();
      const customRect = customButton.getBoundingClientRect();
      
      // If there's a vertical misalignment, try to fix it
      if (Math.abs(checkoutRect.top - customRect.top) > 2) {
        const topDiff = checkoutRect.top - customRect.top;
        customButton.style.transform = `translateY(${topDiff}px)`;
        console.log(`Applied vertical offset: ${topDiff}px`);
      }
    }
  }, 100);

  // Add hover effect
  customButton.addEventListener('mouseenter', () => {
    customButton.style.background = '#0056b3';
  });
  customButton.addEventListener('mouseleave', () => {
    customButton.style.background = '#007bff';
  });

  // Add click handler
  customButton.addEventListener('click', () => {
    console.log('Custom button clicked on workorder:', window.location.href);
    
    // Extract workorder ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const workorderId = urlParams.get('id');
    
    console.log('Workorder ID:', workorderId);
    
    // ===== CUSTOM LOGIC AREA =====
    // Add your specific functionality here:
    
    // Example 1: Remove specific elements
    removeSpecificElements();
    
    // Example 2: Add new functionality
    addCustomFunctionality();
    
    // Example 3: Extract data from the page
    extractWorkorderData();
    
    // Show success message
    alert(`Custom action completed for workorder ID: ${workorderId}`);
  });

  return customButton;
}

// Example function: Remove specific elements
function removeSpecificElements() {
  // Add the CSS selectors of elements you want to remove
  const elementsToRemove: string[] = [
    // '.unwanted-sidebar',
    // '.annoying-popup',
    // '.unnecessary-button',
    // '#some-id-to-remove'
  ];

  elementsToRemove.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.remove();
      console.log(`Removed element: ${selector}`);
    });
  });
}

// Example function: Add custom functionality
function addCustomFunctionality() {
  // Example: Add a custom info panel
  const infoPanel = document.createElement('div');
  infoPanel.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10001;
      max-width: 400px;
    ">
      <h3>Custom Workorder Info</h3>
      <p>This is a custom panel added by the extension.</p>
      <button onclick="this.parentElement.remove()" style="
        background: #dc3545;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">Close</button>
    </div>
  `;
  document.body.appendChild(infoPanel);
}

// Note: modifyExistingElements() function was removed because it was turning all buttons green

// Example function: Extract data from the page
function extractWorkorderData() {
  // Example: Extract workorder details from the page
  const workorderData: any = {
    id: new URLSearchParams(window.location.search).get('id'),
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString()
  };

  // Try to extract more data from the page
  const titleElement = document.querySelector('h1, .title, .workorder-title');
  if (titleElement) {
    workorderData.pageTitle = titleElement.textContent?.trim();
  }

  console.log('Extracted workorder data:', workorderData);
  
  // You could send this data somewhere or store it
  // localStorage.setItem('lastWorkorderData', JSON.stringify(workorderData));
}

// Function to remove specific elements (customize as needed)
function removeElements() {
  // Add selectors for elements you want to remove
  const selectorsToRemove: string[] = [
    // '.some-unwanted-element',
    // '.another-element-to-remove'
  ];

  selectorsToRemove.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.remove();
      console.log(`Removed element: ${selector}`);
    });
  });
}

// Main initialization
function init() {
  if (isWorkorderPage()) {
    console.log('Detected Lightspeed workorder page, initializing...');
    
    // Clear any existing custom buttons first
    const existingButtons = document.querySelectorAll('[data-custom-button]');
    if (existingButtons.length > 0) {
      console.log(`Removing ${existingButtons.length} existing custom buttons...`);
      existingButtons.forEach(button => button.remove());
    }
    
    // Add a small delay to ensure page is stable
    setTimeout(() => {
      addCustomButton();
      removeElements();
    }, 500);
    
    // Listen for dynamic content changes with immediate duplicate removal and debounced re-adding
    let debounceTimer: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      // Immediately check for and remove duplicate buttons (no delay)
      const currentButtons = document.querySelectorAll('[data-custom-button]');
      if (currentButtons.length > 1) {
        console.log(`Found ${currentButtons.length} buttons, immediately removing duplicates...`);
        // Keep only the first button, remove the rest immediately
        for (let i = 1; i < currentButtons.length; i++) {
          currentButtons[i].remove();
        }
      }
      
      // Clear existing timer for re-adding missing buttons
      clearTimeout(debounceTimer);
      
      // Set new timer to debounce re-adding (only if no buttons exist)
      debounceTimer = setTimeout(() => {
        const remainingButtons = document.querySelectorAll('[data-custom-button]');
        if (remainingButtons.length === 0) {
          console.log('Page content changed, re-adding custom button...');
          addCustomButton();
        }
      }, 300); // Reduced to 300ms for faster response
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Also run on navigation changes (for SPA behavior)
let currentUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== currentUrl) {
    currentUrl = url;
    console.log('URL changed, reinitializing...');
    setTimeout(init, 1000);
  }
}).observe(document, { subtree: true, childList: true });
