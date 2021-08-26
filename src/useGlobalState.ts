import { useCallback, useContext, useMemo, useRef } from 'react';

import { RootContext } from './RootContext';
import { GlobalStateActionFunction } from './types';
import { setInitialStatePiece } from './initialRootState';

export const useGlobalState = <T>(key: string, initialState: T) => {
  const keyRef = useRef(key);

  const initialStateMemo = useMemo(
    () => setInitialStatePiece(keyRef.current, initialState, true),
    []
  );

  const [{ [keyRef.current]: state = initialStateMemo }, updateGlobalState] =
    useContext(RootContext);

  const updateState: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      updateGlobalState(
        ({
          [keyRef.current]: currentState = initialStateMemo,
          ...currentGlobalState
        }: Record<string, any>) => ({
          ...currentGlobalState,
          [keyRef.current]: reducer(currentState),
        })
      );
    },
    [updateGlobalState, initialStateMemo]
  );

  return useMemo(
    () => [state as T, updateState] as const,
    [state, updateState]
  );
};

export default useGlobalState;
