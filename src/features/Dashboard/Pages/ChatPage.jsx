import React, { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import ChatDetails from '../components/ChatDetails';

const Messages = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-8 bg-bg-main min-h-screen font-poppins flex flex-col xl:flex-row gap-8 h-screen max-h-screen overflow-hidden relative">
      <ChatSidebar />
      
      {/* Passing the toggle function to ChatWindow */}
      <ChatWindow onToggleDetails={() => setShowDetails(!showDetails)} isDetailsOpen={showDetails} />

    

      {/* Overlay for mobile when details are open */}
      {showDetails && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 xl:hidden" 
          onClick={() => setShowDetails(false)}
        ></div>
      )}
    </div>
  );
};

export default Messages;