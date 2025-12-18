import React, { useEffect, useRef } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import useCalculator from '../hooks/useCalculator';

// PUBLIC_INTERFACE
export default function Calculator() {
  /** Calculator card that composes Display and Keypad and wires keyboard events. */
  const {
    display,
    history,
    hasError,
    inputDigit,
    inputDecimal,
    clear,
    allClear,
    backspace,
    toggleSign,
    percent,
    chooseOperator,
    evaluate,
  } = useCalculator();

  const cardRef = useRef(null);

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        inputDigit(key);
        return;
      }
      if (key === '.' || key === ',') {
        inputDecimal();
        return;
      }
      if (key === '+' || key === '-' || key === '*' || key === 'x' || key === 'X') {
        chooseOperator(key === '*' || key.toLowerCase() === 'x' ? '×' : key);
        return;
      }
      if (key === '/' || key === '÷') {
        chooseOperator('÷');
        return;
      }
      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        evaluate();
        return;
      }
      if (key === 'Backspace') {
        backspace();
        return;
      }
      if (key === 'Escape') {
        clear();
        return;
      }
      if (key === '%') {
        percent();
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [inputDigit, inputDecimal, chooseOperator, evaluate, backspace, clear, percent]);

  return (
    <div className="calc-card" ref={cardRef} role="region" aria-label="Calculator">
      <Display value={display} history={history} error={hasError} />
      <Keypad
        onDigit={inputDigit}
        onDecimal={inputDecimal}
        onClear={clear}
        onAllClear={allClear}
        onBackspace={backspace}
        onToggleSign={toggleSign}
        onPercent={percent}
        onOperator={chooseOperator}
        onEquals={evaluate}
      />
    </div>
  );
}
