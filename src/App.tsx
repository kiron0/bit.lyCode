import React, { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Input from './pages/Input';
import Redirect from './pages/Redirect';
import NotFound from './shared/NotFound';
import Preloader from './shared/Preloader/Preloader';

export const InitializeContext = createContext(null as any);

function App() {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    <>
      {
        loading ? (
          <Preloader />
        ) : (
          <div className="bg-[url('./assets/bg.png')] bg-cover">
            <Routes>
              <Route path="/" element={<Input />} />
              <Route path="/:slug" element={<Redirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        )
      }
    </>
  );
}

export default App;
