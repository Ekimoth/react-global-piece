import React, { ReactNode, useState } from 'react';

import { RootContext } from './RootContext';
import { initialRootState } from './initialRootState';
import { GlobalStateType } from './types';

interface Props {
  children?: ReactNode;
}

const RootProvider = ({ children }: Props) => {
  const rootStateHook = useState<GlobalStateType>(initialRootState);

  return (
    <RootContext.Provider value={rootStateHook}>
      {children}
    </RootContext.Provider>
  );
};

export default RootProvider;
