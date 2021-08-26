import { useState } from 'react';
import { setInitialStatePiece } from './initialRootState';

const useInitialStatePiece = <T>(key: string, state: T) => {
  const [initialStatePiece] = useState(() =>
    setInitialStatePiece(key, state, true)
  );

  return initialStatePiece;
};

export default useInitialStatePiece;
