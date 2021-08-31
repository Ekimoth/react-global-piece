import { useCallback, useMemo, useRef, useContext } from 'react';

// types
import { GlobalStateActionFunction } from '../types';

// helpers
import { setDefaultStaticPiece } from '../static/contexts';

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
    setDefaultStaticPiece<T>(regionRef.current, base, defaultState, true)
  );

  const [Context] = usePiecefulContext(regionRef.current);

  const [{ [baseRef.current]: currentStatePiece }, setState] =
    useContext(Context);

  const state = useMemo(
    () =>
      currentStatePiece && currentStatePiece !== defaultStateFactoryRef.current
        ? currentStatePiece
        : initialStateRef.current || defaultStateFactoryRef.current(),
    [currentStatePiece]
  );

  const updateState: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      setState(
        ({
          [baseRef.current]: currentPiece = initialStateRef.current ??
            defaultStateFactoryRef.current(),
          ...contextState
        }) => ({
          ...contextState,
          [baseRef.current]: reducer(currentPiece),
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
