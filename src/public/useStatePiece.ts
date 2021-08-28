import { useCallback, useMemo } from 'react';

// types
import { GlobalStateActionFunction } from '../types';

// helpers
import { setInitialStatePiece } from '../helpers/defaultPiecefulState';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

// utils
import splitKeys from '../utils/splitKeys';

export const useStatePiece = <T>(key: string, initialState: T) => {
  const [region, pieceKey] = useMemo(() => splitKeys(key), []);

  const initialStateMemo = useMemo(
    () => setInitialStatePiece(region, pieceKey, initialState, true),
    []
  );

  const {
    currentContextState: [
      { [pieceKey]: state = initialStateMemo },
      updateGlobalState,
    ],
  } = usePiecefulContext(region);

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

export default useStatePiece;
