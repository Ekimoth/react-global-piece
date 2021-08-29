import { useCallback, useMemo, useRef } from 'react';

// types
import { GlobalStateActionFunction } from '../types';

// helpers
import { makeBaseDefaultState } from '../static/contexts';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

const useStatePiece = <T>(base: string, defaultState: T, region = 'root') => {
  const regionRef = useRef(region);
  const baseRef = useRef(base);

  const defaultStateFactoryRef = useRef(() =>
    makeBaseDefaultState<T>(regionRef.current, base, defaultState, true)
  );

  const {
    currentContextState: [
      { [baseRef.current]: state = defaultStateFactoryRef.current() },
      setState,
    ],
  } = usePiecefulContext(regionRef.current);

  const updateState: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      setState(
        ({
          [baseRef.current]:
            currentBaseState = defaultStateFactoryRef.current(),
          ...contextState
        }) => ({
          ...contextState,
          [baseRef.current]: reducer(currentBaseState),
        })
      );
    },
    [setState]
  );

  const resetState: GlobalStateActionFunction<T, void> = useCallback(
    (reducer) => {
      setState((contextState) => ({
        ...contextState,
        [baseRef.current]:
          reducer?.(defaultStateFactoryRef.current()) ||
          defaultStateFactoryRef.current(),
      }));
    },
    [setState]
  );

  return useMemo(
    () => [state as T, updateState, resetState] as const,
    [state, updateState, resetState]
  );
};

export default useStatePiece;
