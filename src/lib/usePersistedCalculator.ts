import { useEffect, useReducer, type Dispatch } from 'react';
import { initialState, reducer, type Action, type CalculatorState } from '@/lib/state';
import { loadState, saveState } from '@/lib/storage';

/**
 * Calculator state that survives reloads. Persisted data enters only through the
 * reducer's `hydrate` (which sanitises it). Nothing is written while the state is
 * still the untouched `initialState`, so a mount can never overwrite saved marks.
 */
export function usePersistedCalculator(): [CalculatorState, Dispatch<Action>] {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: 'hydrate', state: saved });
  }, []);

  useEffect(() => {
    if (state !== initialState) saveState(state);
  }, [state]);

  return [state, dispatch];
}
