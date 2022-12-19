import React, { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Input from './pages/Input';
import Redirect from './pages/Redirect';

export const InitializeContext = createContext(null as any);

function App() {
  const [theme, setTheme] = useState("emerald");

  useEffect(() => {
    setTheme(window.localStorage.getItem("theme") as any);
  }, []);

  return (
    <InitializeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme ? theme : "emerald"} className="bg-base-100">
        <Routes>
          <Route path="/" element={<Input />} />
          <Route path="/:slug" element={<Redirect />} />
        </Routes>
        <Toaster />
      </div>
    </InitializeContext.Provider>
  );
}

export default App;
