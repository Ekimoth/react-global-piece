import { useGlobalState } from './useGlobalState';
import { setInitialStatePiece } from './initialRootState';

const createStatePiece = <T>(key: string, initialState: T) => {
  const stableInitialState = setInitialStatePiece(key, initialState);

  return () => useGlobalState(key, stableInitialState);
};

export default createStatePiece;
