import { useCallback, useMemo } from 'react';

// types
import { GlobalStateActionFunction } from '../types';

// helpers
import { setAndReturnBaseDefaultState } from '../static/contexts';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

const useStatePiece = <T>(base: string, defaultState: T, region = 'root') => {
  const defaultStateMemo = useMemo(
    () => setAndReturnBaseDefaultState(region, base, defaultState, true),
    []
  );

  const {
    currentContextState: [{ [base]: state = defaultStateMemo }, setState],
  } = usePiecefulContext(region);

  const updateState: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      setState(
        ({
          [base]: currentBaseState = defaultStateMemo,
          ...contextState
        }: Record<string, any>) => ({
          ...contextState,
          [base]: reducer(currentBaseState),
        })
      );
    },
    [setState, defaultStateMemo, base]
  );

  return useMemo(
    () => [state as T, updateState] as const,
    [state, updateState]
  );
};

export default useStatePiece;
