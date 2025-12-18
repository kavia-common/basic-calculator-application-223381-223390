import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import Calculator from './components/Calculator';

// PUBLIC_INTERFACE
function App() {
  /** Root app for the calculator with theme toggle and Ocean Professional styling. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark themes for the whole app. */
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <main className="app-shell" role="main">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <section
          className="hero"
          aria-label="Calculator container"
        >
          <Calculator />
        </section>
      </main>
    </div>
  );
}

export default App;
