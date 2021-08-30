import React, { ReactNode, useState, useRef } from 'react';

// types
import { ContextStateType } from '../types';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

interface Props {
  children?: ReactNode;
  region?: string;
  liveUpdate?: boolean;
}

const PiecefulProvider = ({ children, region = 'root' }: Props) => {
  const regionRef = useRef(region);

  const { Provider, defaultContextState } = usePiecefulContext(
    regionRef.current
  );

  const contextStateHook = useState<ContextStateType>(defaultContextState);

  return <Provider value={contextStateHook}>{children}</Provider>;
};

export default PiecefulProvider;
