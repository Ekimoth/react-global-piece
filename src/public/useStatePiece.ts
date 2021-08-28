import { useCallback, useMemo } from 'react';

// types
import { GlobalStateActionFunction } from 'types';

// helpers
import { setAndReturnBaseDefaultState } from 'contexts';

// hooks
import usePiecefulContext from 'hooks/usePiecefulContext';

// utils
import splitKey from 'utils/splitKey';

export const useBaseState = <T>(
  region: string,
  base: string,
  defaultState: T
) => {
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

const useStatePiece = <T>(key: string, defaultState: T) => {
  const [region, base] = splitKey(key);

  return useBaseState(region, base, defaultState);
};

export default useStatePiece;
