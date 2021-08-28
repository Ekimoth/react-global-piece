import { useMemo, useContext } from 'react';

import { getContext } from '../contexts';

const usePiecefulContext = (region: string) => {
  const [ContextInstance, defaultContextState] = useMemo(
    () => getContext(region),
    [region]
  );

  const currentContextState = useContext(ContextInstance);

  return useMemo(
    () => ({
      Provider: ContextInstance.Provider,
      defaultContextState,
      currentContextState,
    }),
    [ContextInstance, defaultContextState, currentContextState]
  );
};

export default usePiecefulContext;
