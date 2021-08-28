import { createStatePiece } from 'react-pieceful-state';
import { useCallback, useMemo } from 'react';

import useNumber from './useNumber';

const useNamesPiece = createStatePiece('names', [] as string[]);

const useNames = (presetName: string) => {
  const [names, updateState] = useNamesPiece();
  const [numberOfNames, { increment, decrement }] = useNumber();

  const addName = useCallback(() => {
    updateState((state) => [...state, presetName]);
    increment();
  }, [updateState, increment]);

  const removeName = useCallback(
    (name: string) => {
      updateState((state) => state.filter((n) => n !== presetName));
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
