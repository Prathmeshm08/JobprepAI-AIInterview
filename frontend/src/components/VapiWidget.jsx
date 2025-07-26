import { VapiWidget } from '@vapi-ai/web-widget';
import { useEffect } from 'react';

const MyVapiWidget = () => {
  useEffect(() => {
    // You can programmatically trigger calls if needed
  }, []);

  return (
    <VapiWidget
      apiKey="3a461cf6-94f4-444e-abc8-04be86d9b828"  // 🔐 Replace with your real Vapi API key
      assistant="76205b88-ed2e-4aff-8b69-90afec5c4133"        // 🧠 Replace with your Assistant ID
      theme={{
        position: 'bottom-right',
        color: '#4F46E5',
        layout: 'button', // or 'widget'
      }}
    />
  );
};

export default MyVapiWidget;
