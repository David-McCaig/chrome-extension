import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isActive, setIsActive] = useState(false)

  const checkIfOnWorkorderPage = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab.url && currentTab.url.includes('us.merchantos.com')) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      });
    }
  };

  // Check status when component mounts
  useEffect(() => {
    checkIfOnWorkorderPage();
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>🛠️ Lightspeed Helper</h1>
        <p>Workorder Enhancement Extension</p>
      </div>
      
      <div className="status">
        {isActive ? (
          <div className="status-active">
            <span className="status-dot active"></span>
            <span>Active on Lightspeed page</span>
          </div>
        ) : (
          <div className="status-inactive">
            <span className="status-dot inactive"></span>
            <span>Navigate to Lightspeed to activate</span>
          </div>
        )}
      </div>

      <div className="features">
        <h3>Features:</h3>
        <ul>
          <li>✅ Custom action button on workorder pages</li>
          <li>✅ Element removal capabilities</li>
          <li>✅ Workorder ID extraction</li>
          <li>✅ Dynamic page monitoring</li>
        </ul>
      </div>

      <div className="instructions">
        <h3>How to use:</h3>
        <ol>
          <li>Navigate to a Lightspeed workorder page</li>
          <li>Look for the "🛠️ Custom Action" button</li>
          <li>Click to trigger custom actions</li>
          <li>Check browser console for logs</li>
        </ol>
      </div>

      <div className="footer">
        <button 
          onClick={checkIfOnWorkorderPage}
          className="refresh-btn"
        >
          🔄 Refresh Status
        </button>
      </div>
    </div>
  )
}

export default App
