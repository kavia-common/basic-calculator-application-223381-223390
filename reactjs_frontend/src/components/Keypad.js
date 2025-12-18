import React from 'react';

function Key({ children, onClick, className = '', ariaLabel }) {
  return (
    <button
      type="button"
      className={`key ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel || String(children)}
    >
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
export default function Keypad({
  onDigit,
  onDecimal,
  onClear,
  onAllClear,
  onBackspace,
  onToggleSign,
  onPercent,
  onOperator,
  onEquals,
}) {
  /** Grid keypad with controls, digits, operators and equals. */

  return (
    <div className="keypad" role="group" aria-label="calculator keypad">
      {/* Row 1 */}
      <Key className="control" ariaLabel="all clear" onClick={onAllClear}>AC</Key>
      <Key className="control" ariaLabel="clear entry" onClick={onClear}>C</Key>
      <Key className="control" ariaLabel="backspace" onClick={onBackspace}>⌫</Key>
      <Key className="operator" ariaLabel="divide" onClick={() => onOperator('÷')}>÷</Key>

      {/* Row 2 */}
      <Key onClick={() => onDigit('7')}>7</Key>
      <Key onClick={() => onDigit('8')}>8</Key>
      <Key onClick={() => onDigit('9')}>9</Key>
      <Key className="operator" ariaLabel="multiply" onClick={() => onOperator('×')}>×</Key>

      {/* Row 3 */}
      <Key onClick={() => onDigit('4')}>4</Key>
      <Key onClick={() => onDigit('5')}>5</Key>
      <Key onClick={() => onDigit('6')}>6</Key>
      <Key className="operator" ariaLabel="subtract" onClick={() => onOperator('-')}>−</Key>

      {/* Row 4 */}
      <Key onClick={() => onDigit('1')}>1</Key>
      <Key onClick={() => onDigit('2')}>2</Key>
      <Key onClick={() => onDigit('3')}>3</Key>
      <Key className="operator" ariaLabel="add" onClick={() => onOperator('+')}>+</Key>

      {/* Row 5 */}
      <Key className="control" ariaLabel="toggle sign" onClick={onToggleSign}>+/−</Key>
      <Key onClick={() => onDigit('0')}>0</Key>
      <Key ariaLabel="decimal point" onClick={onDecimal}>.</Key>
      <Key className="equals" ariaLabel="equals" onClick={onEquals}>=</Key>

      {/* Row 6 utility */}
      <Key className="control span-2" ariaLabel="percent" onClick={onPercent}>%</Key>
      <div className="span-2" aria-hidden="true" />
    </div>
  );
}
