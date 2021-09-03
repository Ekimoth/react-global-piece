import React, { ReactNode, useState, useRef, useMemo } from 'react';
import ContextFactory from './ContextFactory';
import { ContextStateType } from './types';

interface Props {
  children?: ReactNode;
  region?: string;
}

const PiecefulProvider = ({ children, region = 'root' }: Props) => {
  const regionRef = useRef(region);

  const contextHolder = useMemo(
    () => ContextFactory.getContextHolderClone(regionRef.current),
    []
  );

  const [state, setState] = useState<ContextStateType>({});

  return (
    <contextHolder.context.Provider value={[state, setState, contextHolder]}>
      {children}
    </contextHolder.context.Provider>
  );
};

export default PiecefulProvider;
