import { useCallback, useMemo, useRef } from 'react';

// types
import { GlobalStateActionFunction } from '../types';

// helpers
import { makeBaseDefaultState } from '../static/contexts';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

const useStatePiece = <T>(
  base: string,
  defaultState: T,
  region = 'root',
  initialState?: T
) => {
  const regionRef = useRef(region);
  const baseRef = useRef(base);

  const initialStateRef = useRef(initialState);
  const defaultStateFactoryRef = useRef(() =>
    makeBaseDefaultState<T>(regionRef.current, base, defaultState, true)
  );

  const {
    currentContextState: [{ [baseRef.current]: currentBaseState }, setState],
  } = usePiecefulContext(regionRef.current);

  const state = useMemo(
    () =>
      currentBaseState && currentBaseState !== defaultStateFactoryRef.current
        ? currentBaseState
        : initialStateRef.current || defaultStateFactoryRef.current(),
    [currentBaseState]
  );

  const updateState: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      setState(
        ({
          [baseRef.current]: currentBaseState = initialStateRef.current ??
            defaultStateFactoryRef.current(),
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
          reducer?.(defaultStateFactoryRef.current()) ??
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
