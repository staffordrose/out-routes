import { useCallback, useMemo, useState } from 'react';
import isEqual from 'lodash.isequal';

export function useUndoableState<T>(initialState: T) {
  const [states, setStates] = useState<T[]>([initialState]);
  const [index, setIndex] = useState<number>(0);

  const state = useMemo(() => states[index], [states, index]);

  const setState = (value: T) => {
    if (isEqual(state, value)) {
      // Prevent re-render if value is the same as current state
      return;
    }

    // Only keep states up to current index
    const statesCopy = states.slice(0, index + 1);
    statesCopy.push(value);
    setStates(statesCopy);
    setIndex(statesCopy.length - 1);
  };

  const clearState = () => {
    setStates([initialState]);
    setIndex(0);
  };

  const goBack = useCallback(
    (steps = 1): T => {
      const nextIndex = Math.max(0, Number(index) - (Number(steps) || 1));
      setIndex(nextIndex);
      return states[nextIndex];
    },
    [states, index]
  );

  const goForward = useCallback(
    (steps = 1): T => {
      const nextIndex = Math.min(
        states.length - 1,
        Number(index) + (Number(steps) || 1)
      );
      setIndex(nextIndex);
      return states[nextIndex];
    },
    [states, index]
  );

  return {
    states,
    index,
    state,
    setState,
    clearState,
    goBack,
    goForward,
  };
}
