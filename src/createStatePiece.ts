import ContextFactory from './ContextFactory';
import useStatePiece from './useStatePiece';

const createStatePiece = <T>(
  base: string,
  defaultValue: T,
  region = 'root'
) => {
  const _defaultValue = ContextFactory.setRegionalBaseDefaultValue(
    region,
    base,
    defaultValue
  );

  return (initialValue?: T) =>
    useStatePiece<T>(base, initialValue ?? _defaultValue, region);
};

export default createStatePiece;
