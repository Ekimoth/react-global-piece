import React, { ReactNode, useState } from 'react';

import { GlobalStateType } from './types';
import usePiecefulContext from './usePiecefulContext';

interface Props {
  children?: ReactNode;
  contextKey?: string;
  initialState?: any;
}

const PiecefulProvider = ({
  children,
  contextKey,
  initialState: initialRuntimeState,
}: Props) => {
  const { Provider, initialStaticState } = usePiecefulContext(
    contextKey ? `_${contextKey}` : 'root'
  );

  const [state, setState] = useState<GlobalStateType>(
    initialRuntimeState || initialStaticState
  );

  return <Provider value={[state, setState]}>{children}</Provider>;
};

export default PiecefulProvider;
