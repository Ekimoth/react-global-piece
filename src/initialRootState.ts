import { GlobalStateType } from './types';

export const initialRootState: GlobalStateType = {};

export const setInitialStatePiece = <T>(
  key: string,
  value: T,
  suppressError = false
) => {
  if (Object.prototype.hasOwnProperty.call(initialRootState, key)) {
    if (initialRootState[key] !== value && !suppressError) {
      console.error(
        `There is already a state piece created with the key "${key}". New state piece was not created.`,
        value
      );
    }

    return initialRootState[key] as T;
  }

  initialRootState[key] = value;

  return value;
};
