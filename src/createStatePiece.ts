import { useStatePiece } from './useStatePiece';
import { setInitialStatePiece } from './defaultPiecefulState';
import splitKeys from './splitKeys';

const createStatePiece = <T>(key: string, initialState: T) => {
  const [contextKey, pieceKey] = splitKeys(key);

  const stableInitialState = setInitialStatePiece(
    contextKey,
    pieceKey,
    initialState
  );

  return () => useStatePiece(key, stableInitialState);
};

export default createStatePiece;
