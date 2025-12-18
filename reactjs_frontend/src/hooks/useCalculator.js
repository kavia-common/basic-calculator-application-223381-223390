import { useCallback, useMemo, useState } from 'react';

function formatNumber(n) {
  // Prevent trailing zeros removal on integers and manage long decimals.
  const str = String(n);
  if (str.includes('e')) return str; // keep scientific notation
  const [intPart, decPart] = str.split('.');
  const intFmt = Number(intPart).toLocaleString(undefined);
  if (decPart === undefined) return intFmt;
  // Keep up to 10 decimals for display
  return `${intFmt}.${decPart.slice(0, 10)}`;
}

function compute(a, b, op) {
  const x = Number(a);
  const y = Number(b);
  switch (op) {
    case '+': return x + y;
    case '-': return x - y;
    case '×': return x * y;
    case '÷':
      if (y === 0) return 'ERR_DIV_ZERO';
      return x / y;
    default: return y;
  }
}

// PUBLIC_INTERFACE
export default function useCalculator() {
  /**
   * Hook encapsulating calculator state machine and operations.
   * Supports digits, decimal, operators, equals, clear, all-clear, backspace,
   * +/- toggle, percent, and divide-by-zero error state.
   */
  const [display, setDisplay] = useState('0');
  const [acc, setAcc] = useState(null);            // accumulated value (string)
  const [pendingOp, setPendingOp] = useState(null); // '+', '-', '×', '÷'
  const [overwrite, setOverwrite] = useState(false);
  const [error, setError] = useState(null);

  const hasError = Boolean(error);

  const history = useMemo(() => {
    if (hasError) return 'Error';
    if (acc !== null && pendingOp) {
      return `${formatNumber(acc)} ${pendingOp}`;
    }
    return '';
  }, [acc, pendingOp, hasError]);

  const setDisplaySafe = useCallback((val) => {
    setDisplay(String(val));
  }, []);

  const resetAll = useCallback(() => {
    setDisplay('0');
    setAcc(null);
    setPendingOp(null);
    setOverwrite(false);
    setError(null);
  }, []);

  // PUBLIC_INTERFACE
  const allClear = useCallback(() => {
    /** Clear everything to initial state. */
    resetAll();
  }, [resetAll]);

  // PUBLIC_INTERFACE
  const clear = useCallback(() => {
    /** Clear current entry only. If in error, clears error and resets current entry. */
    if (hasError) {
      setError(null);
      setDisplay('0');
      return;
    }
    setDisplay('0');
    setOverwrite(true);
  }, [hasError]);

  // PUBLIC_INTERFACE
  const backspace = useCallback(() => {
    /** Remove last character of current entry (no-op in error). */
    if (hasError) return;
    if (overwrite) {
      setDisplay('0');
      setOverwrite(false);
      return;
    }
    setDisplay((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) return '0';
      return prev.slice(0, -1);
    });
  }, [hasError, overwrite]);

  // PUBLIC_INTERFACE
  const inputDigit = useCallback((d) => {
    /** Input a digit (0-9). */
    if (hasError) return;
    setDisplay((prev) => {
      if (overwrite || prev === '0') {
        setOverwrite(false);
        return d;
      }
      return prev + d;
    });
  }, [hasError, overwrite]);

  // PUBLIC_INTERFACE
  const inputDecimal = useCallback(() => {
    /** Input a decimal point; ensures only one decimal in current entry. */
    if (hasError) return;
    setDisplay((prev) => {
      if (overwrite) {
        setOverwrite(false);
        return '0.';
      }
      if (prev.includes('.')) return prev;
      return prev + '.';
    });
  }, [hasError, overwrite]);

  // PUBLIC_INTERFACE
  const toggleSign = useCallback(() => {
    /** Toggle sign of current entry. */
    if (hasError) return;
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : prev === '0' ? '0' : '-' + prev));
  }, [hasError]);

  // PUBLIC_INTERFACE
  const percent = useCallback(() => {
    /** Convert current entry to percentage (divide by 100). */
    if (hasError) return;
    setDisplay((prev) => String(Number(prev) / 100));
  }, [hasError]);

  const doComputeIfPossible = useCallback((nextOp = null) => {
    if (acc !== null && pendingOp) {
      const result = compute(acc, display, pendingOp);
      if (result === 'ERR_DIV_ZERO') {
        setError('Divide by zero');
        setAcc(null);
        setPendingOp(null);
        setDisplay('Cannot divide by 0');
        setOverwrite(true);
        return;
      }
      setAcc(String(result));
      setDisplaySafe(formatNumber(result));
    } else {
      setAcc(display);
    }
    if (nextOp) {
      setPendingOp(nextOp);
      setOverwrite(true);
    }
  }, [acc, pendingOp, display, setDisplaySafe]);

  // PUBLIC_INTERFACE
  const chooseOperator = useCallback((op) => {
    /** Select an operator and compute pending operation if needed. */
    if (hasError) return;
    doComputeIfPossible(op);
  }, [hasError, doComputeIfPossible]);

  // PUBLIC_INTERFACE
  const evaluate = useCallback(() => {
    /** Compute the result for the current expression. */
    if (hasError) return;
    if (pendingOp === null || acc === null) return;
    const result = compute(acc, display, pendingOp);
    if (result === 'ERR_DIV_ZERO') {
      setError('Divide by zero');
      setAcc(null);
      setPendingOp(null);
      setDisplay('Cannot divide by 0');
      setOverwrite(true);
      return;
    }
    setDisplaySafe(formatNumber(result));
    setAcc(null);
    setPendingOp(null);
    setOverwrite(true);
  }, [hasError, pendingOp, acc, display, setDisplaySafe]);

  return {
    display,
    history,
    hasError: hasError,
    inputDigit,
    inputDecimal,
    clear,
    allClear,
    backspace,
    toggleSign,
    percent,
    chooseOperator,
    evaluate,
  };
}
