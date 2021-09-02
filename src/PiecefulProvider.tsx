import React, { ReactNode, useState, useRef, useMemo } from 'react';

// types
import { ContextStateType } from './types';

// factory
import ContextFactory from './ContextFactory';

interface Props {
  children?: ReactNode;
  region?: string;
}

const PiecefulProvider = ({ children, region = 'root' }: Props) => {
  const regionRef = useRef(region);

  const contextHolder = useMemo(
    () => ContextFactory.cloneContextHolder(regionRef.current),
    []
  );

  const Context = contextHolder.context;

  const [state, setState] = useState<ContextStateType>({});

  return (
    <Context.Provider value={[state, setState, contextHolder]}>
      {children}
    </Context.Provider>
  );
};

export default PiecefulProvider;
