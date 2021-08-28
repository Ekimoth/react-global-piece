// hooks
import { useBaseState } from 'public/useStatePiece';

// helpers
import { setAndReturnBaseDefaultState } from 'contexts';

// utils
import splitKey from 'utils/splitKey';

const createStatePiece = <T>(key: string, defaultBaseState: T) => {
  const [region, base] = splitKey(key);

  const stableInitialState = setAndReturnBaseDefaultState<T>(
    region,
    base,
    defaultBaseState
  );

  return () => useBaseState<T>(region, base, stableInitialState);
};

export default createStatePiece;
