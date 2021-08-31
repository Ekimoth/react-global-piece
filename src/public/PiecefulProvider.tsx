import React, { ReactNode, useState, useRef } from 'react';

// types
import { ContextStateType } from '../types';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

interface Props {
  children?: ReactNode;
  region?: string;
}

const PiecefulProvider = ({ children, region = 'root' }: Props) => {
  const regionRef = useRef(region);

  const [Context, defaultStaticState] = usePiecefulContext(regionRef.current);

  const liveState = useState<ContextStateType>(defaultStaticState);

  return (
    <Context.Provider value={liveState}>{children}</Context.Provider>
  );
};

export default PiecefulProvider;
