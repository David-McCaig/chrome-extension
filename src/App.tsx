import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

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
    <div className="w-[350px] min-h-[400px] p-5 font-sans bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="text-center mb-5">
        <h1 className="m-0 mb-1 text-black text-2xl font-semibold">🛠️ Lightspeed Helper</h1>
        <p className="m-0 opacity-90 text-sm">Workorder Enhancement Extension</p>
      </div>
      
      <div className="bg-white/10 rounded-lg p-4 mb-5 backdrop-blur-md">
        {isActive ? (
          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></span>
            <span>Active on Lightspeed page</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50"></span>
            <span>Navigate to Lightspeed to activate</span>
          </div>
        )}
      </div>

      <div className="bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-md">
        <h3 className="m-0 mb-2.5 text-base font-semibold">Features:</h3>
        <ul className="m-0 pl-5 text-sm leading-relaxed">
          <li className="mb-1">✅ Custom action button on workorder pages</li>
          <li className="mb-1">✅ Element removal capabilities</li>
          <li className="mb-1">✅ Workorder ID extraction</li>
          <li className="mb-1">✅ Dynamic page monitoring</li>
        </ul>
      </div>

      <div className="bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-md">
        <h3 className="m-0 mb-2.5 text-base font-semibold">How to use:</h3>
        <ol className="m-0 pl-5 text-sm leading-relaxed">
          <li className="mb-1">Navigate to a Lightspeed workorder page</li>
          <li className="mb-1">Look for the "🛠️ Custom Action" button</li>
          <li className="mb-1">Click to trigger custom actions</li>
          <li className="mb-1">Check browser console for logs</li>
        </ol>
      </div>

      <div className="text-center mt-5">
        <Button 
          onClick={checkIfOnWorkorderPage}
          variant="outline"
          className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-md"
        >
          🔄 Refresh Status
        </Button>
      </div>
    </div>
  )
}

export default App
