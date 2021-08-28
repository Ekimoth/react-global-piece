// hooks
import { useStatePiece } from './useStatePiece';

// helpers
import { setInitialStatePiece } from '../helpers/defaultPiecefulState';

// utils
import splitKeys from '../utils/splitKeys';

const createStatePiece = <T>(key: string, initialState: T) => {
  const [region, pieceKey] = splitKeys(key);

  const stableInitialState = setInitialStatePiece(
    region,
    pieceKey,
    initialState
  );

  return () => useStatePiece(key, stableInitialState);
};

export default createStatePiece;
