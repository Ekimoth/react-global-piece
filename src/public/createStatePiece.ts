// hooks
import useStatePiece from './useStatePiece';

// helpers
import { setAndReturnBaseDefaultState } from '../static/contexts';

const createStatePiece = <T>(
  base: string,
  defaultBaseState: T,
  region = 'root'
) => {
  const defaultState = setAndReturnBaseDefaultState<T>(
    region,
    base,
    defaultBaseState
  );

  return () => useStatePiece<T>(base, defaultState, region);
};

export default createStatePiece;
