import { useCallback, useMemo } from 'react';
import { createStatePiece } from 'react-pieceful-state';

const useAuthPiece = createStatePiece('auth', {
  name: '',
  email: '',
  isAdmin: false,
});

const useAuth = () => {
  const [state, updateState] = useAuthPiece();

  const setName = useCallback(
    ({ target: { value: name } }) => {
      updateState((state) => ({ ...state, name }));
    },
    [updateState]
  );

  const setEmail = useCallback(
    ({ target: { value: email } }) => {
      updateState((state) => ({ ...state, email }));
    },
    [updateState]
  );

  const setIsAdmin = useCallback(
    ({ target: { checked: isAdmin } }) => {
      updateState((state) => ({ ...state, isAdmin }));
    },
    [updateState]
  );

  return useMemo(
    () => [state, { setName, setEmail, setIsAdmin }] as const,
    [state, setName, setEmail, setIsAdmin]
  );
};

export default useAuth;
