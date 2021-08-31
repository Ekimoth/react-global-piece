// hooks
import useStatePiece from './useStatePiece';

// helpers
import { setDefaultStaticPiece } from '../static/contexts';

const createStatePiece = <T>(
  base: string,
  defaultBaseState: T,
  region = 'root'
) => {
  const defaultState = setDefaultStaticPiece<T>(region, base, defaultBaseState);

  return (initialState?: T) =>
    useStatePiece<T>(base, defaultState, region, initialState);
};

export default createStatePiece;
