import React, { } from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@renderer/window/WindowFrame';
import Application from '@components/Application';
// import Settings from '@components/Settings';

const App: React.FC = () => {


  return (


    <WindowFrame title="Héphai" platform='windows'>
      <Application />
    </WindowFrame>

  );
};

// Render application in DOM
createRoot(document.getElementById('app')).render(<App />);