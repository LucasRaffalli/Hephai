import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@renderer/window/WindowFrame';
import Application from '@components/Application';
import Credit from '@components/Credit';

const App: React.FC = () => {
  const [page, setPage] = useState('application');

  const navigateTo = (page: string) => {
    setPage(page);
  };

  return (
    <WindowFrame title="Héphai" platform='windows'>
      {page === 'application' && <Application navigateTo={navigateTo} />}
      {page === 'credit' && <Credit navigateTo={navigateTo} />}
    </WindowFrame>
  );
};

// Render application in DOM
createRoot(document.getElementById('app')).render(<App />);