import React, { ReactNode, useState, useRef, useEffect } from 'react';

// types
import { ContextStateType } from '../types';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

interface Props {
  children?: ReactNode;
  region?: string;
  initialState?: Record<string, any>;
  liveUpdate?: boolean;
}

const PiecefulProvider = ({
  children,
  region = 'root',
  initialState: initialContextState,
  liveUpdate = false,
}: Props) => {
  const regionRef = useRef(region);

  const { Provider, defaultContextState } = usePiecefulContext(
    regionRef.current
  );

  const [state, setState] = useState<ContextStateType>(
    initialContextState || defaultContextState
  );

  useEffect(() => {
    if (initialContextState && liveUpdate) {
      setState(initialContextState);
    }
  }, [initialContextState, liveUpdate]);

  return <Provider value={[state, setState]}>{children}</Provider>;
};

export default PiecefulProvider;
