import React from 'react';

// PUBLIC_INTERFACE
export default function Display({ value, history, error }) {
  /** Top display area showing history and current value. */
  return (
    <div
      className={`calc-display${error ? ' error' : ''}`}
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      <div className="history" aria-label="calculation history">
        {history}
      </div>
      <div className="value" aria-label={error ? 'Error' : 'current value'}>
        {value}
      </div>
    </div>
  );
}
