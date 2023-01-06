import React, { createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Input from './pages/Input';
import Redirect from './pages/Redirect';
import NotFound from './shared/NotFound';

export const InitializeContext = createContext(null as any);

function App() {
  return (
      <div className="bg-[url('./assets/bg.png')] bg-cover">
        <Routes>
          <Route path="/" element={<Input />} />
          <Route path="/:slug" element={<Redirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
  );
}

export default App;
