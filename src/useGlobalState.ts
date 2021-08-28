import { useCallback, useMemo } from 'react';

import { GlobalStateActionFunction } from './types';
import { setInitialStatePiece } from './initialRootState';
import usePiecefulContext from './usePiecefulContext';
import splitKeys from './splitKeys';

export const useGlobalState = <T>(key: string, initialState: T) => {
  const [contextKey, pieceKey] = useMemo(() => splitKeys(key), []);

  const initialStateMemo = useMemo(
    () => setInitialStatePiece(contextKey, pieceKey, initialState, true),
    []
  );

  const {
    currentContextState: [
      { [pieceKey]: state = initialStateMemo },
      updateGlobalState,
    ],
  } = usePiecefulContext(contextKey);

  const updateState: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      updateGlobalState(
        ({
          [pieceKey]: currentState = initialStateMemo,
          ...currentGlobalState
        }: Record<string, any>) => ({
          ...currentGlobalState,
          [pieceKey]: reducer(currentState),
        })
      );
    },
    [updateGlobalState, initialStateMemo, pieceKey]
  );

  return useMemo(
    () => [state as T, updateState] as const,
    [state, updateState]
  );
};

export default useGlobalState;
