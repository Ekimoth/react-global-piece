import { createContext, Dispatch } from 'react';

import { GlobalStateType } from './types';

export const RootContext = createContext([
  {} as GlobalStateType,
  (() => {}) as Dispatch<GlobalStateType>,
] as const);
