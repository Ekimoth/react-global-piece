import { useMemo } from 'react';

// helpers
import { getContext } from '../static/contexts';

const usePiecefulContext = (region: string) => {
  const [ContextInstance, defaultStaticState] = useMemo(
    () => getContext(region),
    [region]
  );

  return useMemo(
    () => [ContextInstance, defaultStaticState] as const,
    [ContextInstance, defaultStaticState]
  );
};

export default usePiecefulContext;
