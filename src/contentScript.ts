

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
    // Extract customer data from the page
    const customerData = extractCustomerData();
    
    // Store customer data for the extension popup to access
    localStorage.setItem('extractedCustomerData', JSON.stringify(customerData));
    
    // Go directly to text customer modal
    // Clean phone number to remove any formatting
    const cleanPhoneNumber = (customerData.mobile || '').replace(/\D/g, '');
    showTextCustomerModal(cleanPhoneNumber);
  });

  return customButton;
}

// Note: Removed intermediate modal functions to go directly to text customer modal

// Function to extract customer data from the page
function extractCustomerData() {
  const customerData: any = {
    workorderId: new URLSearchParams(window.location.search).get('id'),
    name: '',
    mobile: '',
    email: '',
    address: ''
  };

  // Try to extract customer name from various possible selectors
  const nameSelectors = [
    '.customer-name',
    '.client-name',
    '.customer-info .name',
    '.workorder-customer',
    '[data-field="customer_name"]',
    '.form-field[data-field="customer_name"] input',
    'input[name*="customer"][name*="name"]',
    'input[name*="client"][name*="name"]',
    '.customer-details .name',
    '.workorder-details .customer-name'
  ];

  for (const selector of nameSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const value = (element as HTMLInputElement).value || element.textContent?.trim();
      if (value) {
        customerData.name = value;
        break;
      }
    }
  }

  // First, try to find mobile number specifically by looking for "Mobile" label
  let mobileFound = false;
  
  // Look for span elements with class "label" that contain "Mobile" text
  const mobileLabelSpans = document.querySelectorAll('span.label');
  for (const span of mobileLabelSpans) {
    if (span.textContent?.trim().toLowerCase() === 'mobile') {
      // Found the mobile label, now look for the phone number
      // It could be in the same li element, or a sibling, or child
      const parentLi = span.closest('li');
      if (parentLi) {
        // Get all text content from the li element
        const liText = parentLi.textContent || '';
        // Extract phone number from the text
        const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
        const phoneMatches = liText.match(phoneRegex);
        if (phoneMatches && phoneMatches.length > 0) {
          customerData.mobile = phoneMatches[0];
          mobileFound = true;
          break;
        }
      }
      
      // If not found in parent li, try looking at siblings
      const parent = span.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        for (const sibling of siblings) {
          if (sibling !== span) {
            const siblingText = sibling.textContent || '';
            const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
            const phoneMatches = siblingText.match(phoneRegex);
            if (phoneMatches && phoneMatches.length > 0) {
              customerData.mobile = phoneMatches[0];
              mobileFound = true;
              break;
            }
          }
        }
      }
      
      if (mobileFound) break;
    }
  }

  // If mobile not found, try other selectors as fallback
  if (!mobileFound) {
    const mobileSelectors = [
      '.customer-phone',
      '.customer-mobile',
      '.client-phone',
      '.client-mobile',
      '.customer-info .phone',
      '.customer-info .mobile',
      '[data-field="customer_phone"]',
      '[data-field="customer_mobile"]',
      '.form-field[data-field="customer_phone"] input',
      '.form-field[data-field="customer_mobile"] input',
      'input[name*="phone"]',
      'input[name*="mobile"]',
      'input[type="tel"]',
      '.customer-details .phone',
      '.customer-details .mobile'
    ];

    for (const selector of mobileSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const value = (element as HTMLInputElement).value || element.textContent?.trim();
        if (value) {
          customerData.mobile = value;
          break;
        }
      }
    }
  }

  // Try to extract email from various possible selectors
  const emailSelectors = [
    '.customer-email',
    '.client-email',
    '.customer-info .email',
    '[data-field="customer_email"]',
    '.form-field[data-field="customer_email"] input',
    'input[name*="email"]',
    'input[type="email"]',
    '.customer-details .email'
  ];

  for (const selector of emailSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const value = (element as HTMLInputElement).value || element.textContent?.trim();
      if (value) {
        customerData.email = value;
        break;
      }
    }
  }

  // Try to extract address from various possible selectors
  const addressSelectors = [
    '.customer-address',
    '.client-address',
    '.customer-info .address',
    '[data-field="customer_address"]',
    '.form-field[data-field="customer_address"] textarea',
    '.form-field[data-field="customer_address"] input',
    'textarea[name*="address"]',
    'input[name*="address"]',
    '.customer-details .address'
  ];

  for (const selector of addressSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const value = (element as HTMLInputElement).value || element.textContent?.trim();
      if (value) {
        customerData.address = value;
        break;
      }
    }
  }

  // If we couldn't find specific fields, try to extract from any visible text
  if (!customerData.name || !customerData.mobile) {
    // Look for patterns in the page text
    const pageText = document.body.textContent || '';
    
    // Try to find phone number patterns
    if (!customerData.mobile) {
      const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
      const phoneMatches = pageText.match(phoneRegex);
      if (phoneMatches && phoneMatches.length > 0) {
        customerData.mobile = phoneMatches[0];
      }
    }

    // Try to find email patterns
    if (!customerData.email) {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const emailMatches = pageText.match(emailRegex);
      if (emailMatches && emailMatches.length > 0) {
        customerData.email = emailMatches[0];
      }
    }
  }

  console.log('Extracted customer data:', customerData);
  
  // Store the customer data for the extension to access
  localStorage.setItem('extractedCustomerData', JSON.stringify(customerData));
  
  return customerData;
}

// Removed the intermediate customer modal - now going directly to text modal

// Function to show text customer modal
function showTextCustomerModal(phoneNumber: string) {
  // Create text modal HTML
  const textModalHTML = `
    <div id="text-customer-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    ">
      <div style="
        background: white;
        padding: 24px;
        border-radius: 12px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border: 1px solid #e5e7eb;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              width: 20px;
              height: 20px;
              background: #10b981;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
            ">💬</div>
            <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">Text Customer</h3>
          </div>
          <button id="close-text-modal" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            color: #6b7280;
            border-radius: 4px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
          " onmouseover="this.style.backgroundColor='#f3f4f6'" onmouseout="this.style.backgroundColor='transparent'">×</button>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #374151;">Customer Phone Number</p>
          <input id="phone-input" type="tel" placeholder="5551234567" value="${phoneNumber}" style="
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 16px;
          " maxlength="10">
          
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #374151;">Message</p>
          <textarea id="message-input" placeholder="Enter your message..." rows="4" style="
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            resize: none;
            font-family: inherit;
          ">Good news! Your bike is all set and ready to roll. You can pick it up anytime during our shop hours at Urbane Cyclist.</textarea>
          <p id="char-count" style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">0/160 characters</p>
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <button id="cancel-text" style="
            background: #6b7280;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
          " onmouseover="this.style.backgroundColor='#4b5563'" onmouseout="this.style.backgroundColor='#6b7280'">Cancel</button>
          <button id="send-text" style="
            background: #10b981;
        color: white;
        border: none;
        padding: 8px 16px;
            border-radius: 6px;
        cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
          " onmouseover="this.style.backgroundColor='#059669'" onmouseout="this.style.backgroundColor='#10b981'">Text Customer</button>
        </div>
      </div>
    </div>
  `;

  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', textModalHTML);

  // Add event listeners
  const textModal = document.getElementById('text-customer-modal');
  const closeTextModal = () => {
    if (textModal) {
      textModal.remove();
    }
  };

  // Phone number input - no formatting, digits only
  const phoneInput = document.getElementById('phone-input') as HTMLInputElement;
  
  phoneInput?.addEventListener('input', (e) => {
    // Remove all non-digit characters
    const digitsOnly = (e.target as HTMLInputElement).value.replace(/\D/g, "");
    (e.target as HTMLInputElement).value = digitsOnly;
  });

  // Message character count
  const messageInput = document.getElementById('message-input') as HTMLTextAreaElement;
  const charCount = document.getElementById('char-count');
  
  messageInput?.addEventListener('input', (e) => {
    const length = (e.target as HTMLTextAreaElement).value.length;
    if (charCount) {
      charCount.textContent = `${length}/160 characters`;
    }
  });

  // Initialize character count
  if (messageInput && charCount) {
    charCount.textContent = `${messageInput.value.length}/160 characters`;
  }

  // Close button events
  document.getElementById('close-text-modal')?.addEventListener('click', closeTextModal);
  document.getElementById('cancel-text')?.addEventListener('click', closeTextModal);

  // Send text button
  document.getElementById('send-text')?.addEventListener('click', async () => {
    const phone = phoneInput?.value || '';
    const message = messageInput?.value || '';
    
    if (!phone.trim() || !message.trim()) {
      alert('Please fill in both phone number and message.');
      return;
    }
    
    // Show loading state
    const sendButton = document.getElementById('send-text') as HTMLButtonElement;
    sendButton.textContent = 'Sending...';
    sendButton.disabled = true;
    
    try {
      // Send POST request to the API
      const response = await fetch('http://localhost:4000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          message: message,
          phoneNumber: phone
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API response:', result);
      
      // Show success dialog
      showSuccessDialog(phone);
      closeTextModal();
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message to user
      alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Reset button state
      sendButton.textContent = 'Text Customer';
      sendButton.disabled = false;
    }
  });

  // Close on outside click
  textModal?.addEventListener('click', (e) => {
    if (e.target === textModal) {
      closeTextModal();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTextModal();
    }
  });
}

// Function to show success dialog
function showSuccessDialog(phoneNumber: string) {
  // Format phone number for display (digits only for API, formatted for user display)
  const formatForDisplay = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    return phone; // Return as-is if not 10 digits
  };
  
  const displayPhone = formatForDisplay(phoneNumber);
  // Create success dialog HTML with shadcn-style styling
  const successDialogHTML = `
    <div id="success-dialog" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10001;
      backdrop-filter: blur(4px);
    ">
      <div style="
        background: white;
        padding: 24px;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border: 1px solid #e5e7eb;
        position: relative;
      ">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 32px 0;">
          <div style="
            width: 64px;
            height: 64px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            color: white;
            font-size: 32px;
          ">✓</div>
          <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827;">Message Sent Successfully!</h3>
          <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280;">Your customer has been notified at ${displayPhone}</p>
          <button id="close-success-dialog" style="
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
            width: 100%;
          " onmouseover="this.style.backgroundColor='#0056b3'" onmouseout="this.style.backgroundColor='#007bff'">Close</button>
        </div>
        <button id="close-success-dialog-x" style="
          position: absolute;
          right: 16px;
          top: 16px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          color: #6b7280;
          border-radius: 4px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        " onmouseover="this.style.backgroundColor='#f3f4f6'" onmouseout="this.style.backgroundColor='transparent'">×</button>
      </div>
    </div>
  `;

  // Add dialog to page
  document.body.insertAdjacentHTML('beforeend', successDialogHTML);

  // Add event listeners
  const successDialog = document.getElementById('success-dialog');
  const closeSuccessDialog = () => {
    if (successDialog) {
      successDialog.remove();
    }
  };

  // Close button events
  document.getElementById('close-success-dialog')?.addEventListener('click', closeSuccessDialog);
  document.getElementById('close-success-dialog-x')?.addEventListener('click', closeSuccessDialog);

  // Close on outside click
  successDialog?.addEventListener('click', (e) => {
    if (e.target === successDialog) {
      closeSuccessDialog();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSuccessDialog();
    }
  });
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
