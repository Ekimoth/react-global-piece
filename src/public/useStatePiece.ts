import { useCallback, useMemo } from 'react';

// types
import { GlobalStateActionFunction } from '../types';

// helpers
import { setAndReturnBaseDefaultState } from '../static/contexts';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

const useStatePiece = <T>(base: string, defaultState: T, region = 'root') => {
  const [baseMemo, regionMemo] = useMemo(() => [base, region], []);

  const defaultStateMemo = useMemo(
    () => setAndReturnBaseDefaultState(regionMemo, base, defaultState, true),
    []
  );

  const {
    currentContextState: [{ [baseMemo]: state = defaultStateMemo }, setState],
  } = usePiecefulContext(regionMemo);

  const updateState: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      setState(
        ({
          [baseMemo]: currentBaseState = defaultStateMemo,
          ...contextState
        }: Record<string, any>) => ({
          ...contextState,
          [baseMemo]: reducer(currentBaseState),
        })
      );
    },
    [setState, defaultStateMemo, baseMemo]
  );

  const resetState: GlobalStateActionFunction<T, void> = useCallback(
    (reducer) => {
      setState((contextState: Record<string, any>) => ({
        ...contextState,
        [baseMemo]: reducer?.(defaultStateMemo) || defaultStateMemo,
      }));
    },
    [setState, defaultStateMemo, baseMemo]
  );

  return useMemo(
    () => [state as T, updateState, resetState] as const,
    [state, updateState, resetState]
  );
};

export default useStatePiece;
