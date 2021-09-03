import { useCallback, useMemo, useRef, useContext } from 'react';
import ContextFactory from './ContextFactory';
import { GlobalStateActionFunction } from './types';

const useStatePiece = <T>(base: string, initialState: T, region = 'root') => {
  const regionRef = useRef(region);
  const baseRef = useRef(base);
  const initialStateRef = useRef(initialState);

  const Context = useMemo(
    () => ContextFactory.getContext(regionRef.current),
    []
  );

  const [{ [baseRef.current]: currentStatePiece }, setState, contextHolder] =
    useContext(Context);

  const defaultStateMemo = useMemo(
    () =>
      contextHolder?.setDefaultBaseState(
        baseRef.current,
        initialStateRef.current
      ) ?? initialStateRef.current,
    []
  );

  const initialStateMemo = useMemo(
    () =>
      contextHolder?.setInitialBaseState(
        baseRef.current,
        initialStateRef.current
      ) ?? initialStateRef.current,
    []
  );

  const state = useMemo(
    () => (currentStatePiece as T) ?? initialStateMemo,
    [currentStatePiece, initialStateMemo]
  );

  const updateState: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      setState(
        ({
          [baseRef.current]: currentPiece = initialStateMemo,
          ...contextState
        }) => ({
          ...contextState,
          [baseRef.current]: reducer(currentPiece),
        })
      );
    },
    [setState, initialStateMemo]
  );

  const resetState: GlobalStateActionFunction<T, void> = useCallback(
    (reducer) => {
      setState((contextState) => ({
        ...contextState,
        [baseRef.current]: reducer?.(defaultStateMemo) ?? defaultStateMemo,
      }));
    },
    [setState, defaultStateMemo]
  );

  return useMemo(
    () => [state, updateState, resetState] as const,
    [state, updateState, resetState]
  );
};

export default useStatePiece;
