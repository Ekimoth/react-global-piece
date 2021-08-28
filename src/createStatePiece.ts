import { useGlobalState } from './useGlobalState';
import { setInitialStatePiece } from './initialRootState';
import splitKeys from './splitKeys';

const createStatePiece = <T>(key: string, initialState: T) => {
  const [contextKey, pieceKey] = splitKeys(key);

  const stableInitialState = setInitialStatePiece(
    contextKey,
    pieceKey,
    initialState
  );

  return () => useGlobalState(key, stableInitialState);
};

export default createStatePiece;
