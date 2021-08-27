import { useCallback, useMemo } from 'react';
import { createStatePiece } from 'react-global-piece';

const useAccessPiece = createStatePiece('access', {
  hasAccess: false,
});

const useAccess = () => {
  const [state, updateState] = useAccessPiece();

  const toggleAccess = useCallback(() => {
    updateState(({ hasAccess, ...state }) => ({
      ...state,
      hasAccess: !hasAccess,
    }));
  }, [updateState]);

  return useMemo(
    () => [state, { toggleAccess }] as const,
    [state, toggleAccess]
  );
};

export default useAccess;
