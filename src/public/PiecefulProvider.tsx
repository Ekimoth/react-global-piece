import React, { ReactNode, useState } from 'react';

// types
import { ContextStateType } from '../types';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

interface Props {
  children?: ReactNode;
  region?: string;
  initialState?: Record<string, any>;
}

const PiecefulProvider = ({
  children,
  region = 'root',
  initialState: initialContextState,
}: Props) => {
  const { Provider, defaultContextState } = usePiecefulContext(region);

  const [state, setState] = useState<ContextStateType>(
    initialContextState || defaultContextState
  );

  return <Provider value={[state, setState]}>{children}</Provider>;
};

export default PiecefulProvider;
