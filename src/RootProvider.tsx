import React, { ReactNode, createContext, useState, Dispatch } from 'react';

type T = Record<string, any>;

export const RootContext = createContext([
  {} as T,
  (() => {}) as Dispatch<T>,
] as const);

interface Props {
  children?: ReactNode;
}

const GlobalStateProvider = ({ children }: Props) => {
  const stateHook = useState<T>({});

  return (
    <RootContext.Provider value={stateHook}>{children}</RootContext.Provider>
  );
};

export default GlobalStateProvider;
