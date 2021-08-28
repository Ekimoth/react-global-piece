import React, { ReactNode, useState } from 'react';

// types
import { GlobalStateType } from '../types';

// hooks
import usePiecefulContext from '../hooks/usePiecefulContext';

interface Props {
  children?: ReactNode;
  region?: string;
  initialState?: any;
}

const PiecefulProvider = ({
  children,
  region,
  initialState: initialRuntimeState,
}: Props) => {
  const { Provider, initialStaticState } = usePiecefulContext(
    region ? `_${region}` : 'root'
  );

  const [state, setState] = useState<GlobalStateType>(
    initialRuntimeState || initialStaticState
  );

  return <Provider value={[state, setState]}>{children}</Provider>;
};

export default PiecefulProvider;
