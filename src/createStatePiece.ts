// hooks
import useStatePiece from './useStatePiece';

// factory
import ContextFactory from './ContextFactory';

const createStatePiece = <T>(
  base: string,
  defaultBaseState: T,
  region = 'root'
) => {
  const defaultState = ContextFactory.getContextHolder(
    region
  ).setDefaultBaseState(base, defaultBaseState);

  return (initialState?: T) =>
    useStatePiece<T>(base, initialState ?? defaultState, region);
};

export default createStatePiece;
