import { createStatePiece } from 'react-global-state';
import { useCallback, useMemo } from 'react';

import useNumber from './useNumber';

const useNamesPiece = createStatePiece('names', [] as string[]);

const useNames = () => {
  const [names, updateState] = useNamesPiece();
  const [numberOfNames, { increment, decrement }] = useNumber();

  const addName = useCallback(
    (name: string) => {
      updateState((state) => [...state, name]);
      increment();
    },
    [updateState, increment]
  );

  const removeName = useCallback(
    (name: string) => {
      updateState((state) => state.filter((n) => n !== name));
      decrement();
    },
    [updateState, decrement]
  );

  return useMemo(
    () =>
      [
        { names, numberOfNames },
        { addName, removeName },
      ] as const,
    [names, numberOfNames, addName, removeName]
  );
};

export default useNames;
