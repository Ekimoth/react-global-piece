import { contexts } from './usePiecefulContext';

export const setInitialStatePiece = <T>(
  contextKey: string,
  pieceKey: string,
  value: T,
  suppressError = false
) => {
  const initialRootState = contexts[contextKey]?.[1] || {};

  if (
    initialRootState &&
    Object.prototype.hasOwnProperty.call(initialRootState, pieceKey)
  ) {
    if (initialRootState[pieceKey] !== value && !suppressError) {
      console.error(
        `There is already a state piece created with the key "${pieceKey}". New state piece was not created.`,
        value
      );
    }

    return initialRootState[pieceKey] as T;
  }

  initialRootState[pieceKey] = value;

  return value;
};
