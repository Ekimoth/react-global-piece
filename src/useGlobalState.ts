import { useCallback, useContext, useMemo, useRef } from 'react';

// context
import { RootContext } from './RootProvider';

// types
import { GlobalStateActionFunction } from './types';

const useGlobalState = <T>(id: string, initialState: T) => {
  const idRef = useRef(id);

  const initialStateRef = useRef(initialState);

  const [
    { [idRef.current]: state = initialStateRef.current },
    updateGlobalState,
  ] = useContext(RootContext);

  const updateState: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      updateGlobalState(
        ({
          [idRef.current]: currentState = initialStateRef.current,
          ...currentGlobalState
        }: Record<string, any>) => ({
          ...currentGlobalState,
          [idRef.current]: reducer(currentState),
        })
      );
    },
    [updateGlobalState]
  );

  return useMemo(
    () => [state as T, updateState] as const,
    [state, updateState]
  );
};

export default useGlobalState;
